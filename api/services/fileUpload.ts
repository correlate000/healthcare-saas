// File Upload Service
// Comprehensive file upload with security scanning, image processing, and secure storage

import multer from 'multer';
import sharp from 'sharp';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/connection';
import { auditLogger } from './audit';

interface FileUploadOptions {
  maxFileSize?: number;
  allowedMimeTypes?: string[];
  uploadContext?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  generateThumbnails?: boolean;
  enableVirusScanning?: boolean;
  encryptFile?: boolean;
}

interface UploadedFile {
  id: string;
  originalFilename: string;
  storedFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileHash: string;
  uploadContext?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  virusScanStatus: string;
  encryptionEnabled: boolean;
  thumbnails?: Array<{
    size: string;
    path: string;
  }>;
}

interface ProcessedImage {
  original: string;
  thumbnails: Array<{
    size: string;
    path: string;
    width: number;
    height: number;
  }>;
}

interface FileMetadata {
  dimensions?: { width: number; height: number };
  exifData?: any;
  documentPages?: number;
  contentAnalysis?: any;
}

class FileUploadService {
  private uploadDir: string;
  private thumbnailDir: string;
  private maxFileSize: number;
  private allowedMimeTypes: Set<string>;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads';
    this.thumbnailDir = path.join(this.uploadDir, 'thumbnails');
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB default
    
    this.allowedMimeTypes = new Set([
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword'
    ]);

    this.initializeDirectories();
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      await fs.mkdir(this.thumbnailDir, { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'temp'), { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'processed'), { recursive: true });
      await fs.mkdir(path.join(this.uploadDir, 'encrypted'), { recursive: true });
    } catch (error) {
      console.error('Failed to initialize upload directories:', error);
    }
  }

  // Configure multer for file uploads
  getMulterConfig(options: FileUploadOptions = {}): multer.Multer {
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        const tempDir = path.join(this.uploadDir, 'temp');
        cb(null, tempDir);
      },
      filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueId}${extension}`);
      }
    });

    return multer({
      storage,
      limits: {
        fileSize: options.maxFileSize || this.maxFileSize,
        files: 5 // Maximum 5 files per request
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = options.allowedMimeTypes ? 
          new Set(options.allowedMimeTypes) : this.allowedMimeTypes;
        
        if (allowedTypes.has(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error(`File type ${file.mimetype} not allowed`));
        }
      }
    });
  }

  // Process uploaded file
  async processUploadedFile(
    file: Express.Multer.File,
    userId: string,
    options: FileUploadOptions = {}
  ): Promise<UploadedFile> {
    try {
      const fileId = uuidv4();
      const fileHash = await this.calculateFileHash(file.path);
      
      // Check for duplicate files
      const existingFile = await this.checkDuplicateFile(fileHash, userId);
      if (existingFile) {
        // Clean up temp file
        await fs.unlink(file.path);
        return existingFile;
      }

      // Perform security scanning
      const virusScanResult = await this.performVirusScan(file.path, options.enableVirusScanning);
      
      if (virusScanResult.infected) {
        await fs.unlink(file.path);
        throw new Error('File contains malicious content');
      }

      // Analyze file content
      const metadata = await this.analyzeFile(file.path, file.mimetype);
      const containsPHI = await this.checkForPHI(file.path, file.mimetype, metadata);

      // Process based on file type
      let processedFile: ProcessedImage | null = null;
      if (this.isImageFile(file.mimetype)) {
        processedFile = await this.processImage(file.path, fileId, options.generateThumbnails);
      }

      // Encrypt file if required
      let finalPath = file.path;
      let encryptionEnabled = false;
      
      if (options.encryptFile || containsPHI) {
        finalPath = await this.encryptFile(file.path, fileId);
        encryptionEnabled = true;
        await fs.unlink(file.path); // Remove unencrypted temp file
      } else {
        // Move to processed directory
        const processedPath = path.join(this.uploadDir, 'processed', path.basename(file.path));
        await fs.rename(file.path, processedPath);
        finalPath = processedPath;
      }

      // Store file metadata in database
      const uploadedFile = await this.storeFileMetadata({
        id: fileId,
        userId,
        originalFilename: file.originalname,
        storedFilename: path.basename(finalPath),
        filePath: finalPath,
        fileSize: file.size,
        mimeType: file.mimetype,
        fileHash,
        uploadContext: options.uploadContext,
        relatedEntityType: options.relatedEntityType,
        relatedEntityId: options.relatedEntityId,
        virusScanStatus: virusScanResult.status,
        encryptionEnabled,
        containsPHI,
        metadata
      });

      // Add thumbnail information if available
      if (processedFile?.thumbnails) {
        uploadedFile.thumbnails = processedFile.thumbnails.map(thumb => ({
          size: thumb.size,
          path: thumb.path
        }));
      }

      // Log file upload
      await auditLogger.logDataAccess(
        userId,
        'file_upload',
        fileId,
        'create',
        '127.0.0.1', // This would come from the request
        undefined,
        {
          filename: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadContext: options.uploadContext,
          encryptionEnabled,
          containsPHI
        }
      );

      return uploadedFile;

    } catch (error) {
      // Clean up temp file on error
      try {
        await fs.unlink(file.path);
      } catch (cleanupError) {
        console.error('Failed to clean up temp file:', cleanupError);
      }
      
      console.error('File processing error:', error);
      throw error;
    }
  }

  // Calculate file hash for deduplication
  private async calculateFileHash(filePath: string): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  // Check for duplicate files
  private async checkDuplicateFile(fileHash: string, userId: string): Promise<UploadedFile | null> {
    try {
      const result = await db.query(`
        SELECT * FROM file_uploads
        WHERE file_hash = $1 AND user_id = (SELECT id FROM users WHERE anonymous_id = $2)
        AND is_active = true
        ORDER BY created_at DESC
        LIMIT 1
      `, [fileHash, userId]);

      if (result.rows.length > 0) {
        const file = result.rows[0];
        return {
          id: file.id,
          originalFilename: file.original_filename,
          storedFilename: file.stored_filename,
          filePath: file.file_path,
          fileSize: file.file_size,
          mimeType: file.mime_type,
          fileHash: file.file_hash,
          uploadContext: file.upload_context,
          relatedEntityType: file.related_entity_type,
          relatedEntityId: file.related_entity_id,
          virusScanStatus: file.virus_scan_status,
          encryptionEnabled: file.encryption_enabled
        };
      }

      return null;
    } catch (error) {
      console.error('Duplicate file check error:', error);
      return null;
    }
  }

  // Perform virus scanning
  private async performVirusScan(filePath: string, enabled: boolean = true): Promise<{
    status: string;
    infected: boolean;
    result?: string;
  }> {
    if (!enabled) {
      return { status: 'skipped', infected: false };
    }

    try {
      // In a real implementation, you would integrate with a virus scanning service
      // like ClamAV, VirusTotal API, or cloud-based scanning services
      
      // For now, we'll simulate scanning with basic checks
      const fileBuffer = await fs.readFile(filePath);
      const fileContent = fileBuffer.toString('binary');
      
      // Check for common malware signatures (simplified)
      const suspiciousPatterns = [
        'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*', // EICAR test
        '<?php', // PHP code in unexpected files
        '<script', // JavaScript in unexpected files
      ];

      for (const pattern of suspiciousPatterns) {
        if (fileContent.includes(pattern)) {
          return {
            status: 'infected',
            infected: true,
            result: 'Suspicious content detected'
          };
        }
      }

      return { status: 'clean', infected: false };

    } catch (error) {
      console.error('Virus scan error:', error);
      return { status: 'failed', infected: false, result: error.message };
    }
  }

  // Analyze file content and metadata
  private async analyzeFile(filePath: string, mimeType: string): Promise<FileMetadata> {
    const metadata: FileMetadata = {};

    try {
      if (this.isImageFile(mimeType)) {
        // Analyze image
        const imageInfo = await sharp(filePath).metadata();
        metadata.dimensions = {
          width: imageInfo.width || 0,
          height: imageInfo.height || 0
        };
        metadata.exifData = imageInfo.exif ? this.parseExifData(imageInfo.exif) : null;
      }

      // Add more file type specific analysis here
      // PDF: page count, text extraction
      // Documents: word count, metadata
      // etc.

    } catch (error) {
      console.error('File analysis error:', error);
    }

    return metadata;
  }

  // Check for Protected Health Information (PHI)
  private async checkForPHI(filePath: string, mimeType: string, metadata: FileMetadata): Promise<boolean> {
    try {
      // In a real implementation, you would use ML models or NLP services
      // to detect PHI in documents and images
      
      // For images, check EXIF data for location information
      if (this.isImageFile(mimeType) && metadata.exifData) {
        if (metadata.exifData.gps || metadata.exifData.location) {
          return true; // Location data could be considered PHI
        }
      }

      // For text files, you could extract text and use NLP to detect PHI
      // For now, we'll assume medical-related file contexts contain PHI
      return false; // Simplified for this example

    } catch (error) {
      console.error('PHI detection error:', error);
      return false;
    }
  }

  // Process images (resize, generate thumbnails)
  private async processImage(filePath: string, fileId: string, generateThumbnails: boolean = true): Promise<ProcessedImage> {
    const thumbnails: Array<{ size: string; path: string; width: number; height: number }> = [];

    if (generateThumbnails) {
      const thumbnailSizes = [
        { name: 'small', width: 150, height: 150 },
        { name: 'medium', width: 400, height: 400 },
        { name: 'large', width: 800, height: 600 }
      ];

      for (const size of thumbnailSizes) {
        try {
          const thumbnailFilename = `${fileId}_${size.name}.webp`;
          const thumbnailPath = path.join(this.thumbnailDir, thumbnailFilename);

          await sharp(filePath)
            .resize(size.width, size.height, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .webp({ quality: 80 })
            .toFile(thumbnailPath);

          const thumbnailInfo = await sharp(thumbnailPath).metadata();
          
          thumbnails.push({
            size: size.name,
            path: thumbnailPath,
            width: thumbnailInfo.width || size.width,
            height: thumbnailInfo.height || size.height
          });
        } catch (error) {
          console.error(`Failed to generate ${size.name} thumbnail:`, error);
        }
      }
    }

    return {
      original: filePath,
      thumbnails
    };
  }

  // Encrypt file for secure storage
  private async encryptFile(filePath: string, fileId: string): Promise<string> {
    try {
      const encryptedDir = path.join(this.uploadDir, 'encrypted');
      const encryptedPath = path.join(encryptedDir, `${fileId}.enc`);

      // Generate encryption key and IV
      const key = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);

      // Read original file
      const fileBuffer = await fs.readFile(filePath);

      // Encrypt file content
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      const encrypted = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);

      // Store encryption metadata
      const encryptionMetadata = {
        algorithm: 'aes-256-cbc',
        key: key.toString('hex'),
        iv: iv.toString('hex'),
        originalSize: fileBuffer.length
      };

      // Save encrypted file with metadata header
      const metadataBuffer = Buffer.from(JSON.stringify(encryptionMetadata));
      const metadataLength = Buffer.alloc(4);
      metadataLength.writeUInt32BE(metadataBuffer.length, 0);

      const finalBuffer = Buffer.concat([metadataLength, metadataBuffer, encrypted]);
      await fs.writeFile(encryptedPath, finalBuffer);

      return encryptedPath;

    } catch (error) {
      console.error('File encryption error:', error);
      throw error;
    }
  }

  // Store file metadata in database
  private async storeFileMetadata(fileData: {
    id: string;
    userId: string;
    originalFilename: string;
    storedFilename: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    fileHash: string;
    uploadContext?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    virusScanStatus: string;
    encryptionEnabled: boolean;
    containsPHI: boolean;
    metadata: FileMetadata;
  }): Promise<UploadedFile> {
    try {
      await db.query(`
        INSERT INTO file_uploads (
          id, user_id, original_filename, stored_filename, file_path,
          file_size, mime_type, file_hash, upload_context,
          related_entity_type, related_entity_id, virus_scan_status,
          malware_detected, encryption_enabled, contains_phi,
          content_type, processing_status
        ) VALUES (
          $1, (SELECT id FROM users WHERE anonymous_id = $2), $3, $4, $5,
          $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
        )
      `, [
        fileData.id, fileData.userId, fileData.originalFilename,
        fileData.storedFilename, fileData.filePath, fileData.fileSize,
        fileData.mimeType, fileData.fileHash, fileData.uploadContext,
        fileData.relatedEntityType, fileData.relatedEntityId,
        fileData.virusScanStatus, false, fileData.encryptionEnabled,
        fileData.containsPHI, this.determineContentType(fileData.mimeType),
        'ready'
      ]);

      return {
        id: fileData.id,
        originalFilename: fileData.originalFilename,
        storedFilename: fileData.storedFilename,
        filePath: fileData.filePath,
        fileSize: fileData.fileSize,
        mimeType: fileData.mimeType,
        fileHash: fileData.fileHash,
        uploadContext: fileData.uploadContext,
        relatedEntityType: fileData.relatedEntityType,
        relatedEntityId: fileData.relatedEntityId,
        virusScanStatus: fileData.virusScanStatus,
        encryptionEnabled: fileData.encryptionEnabled
      };

    } catch (error) {
      console.error('Store file metadata error:', error);
      throw error;
    }
  }

  // Get uploaded file by ID
  async getFile(fileId: string, userId: string): Promise<UploadedFile | null> {
    try {
      const result = await db.query(`
        SELECT fu.*, u.anonymous_id
        FROM file_uploads fu
        JOIN users u ON fu.user_id = u.id
        WHERE fu.id = $1 AND u.anonymous_id = $2 AND fu.is_active = true
      `, [fileId, userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const file = result.rows[0];

      // Log file access
      await auditLogger.logDataAccess(
        userId,
        'file_upload',
        fileId,
        'read',
        '127.0.0.1'
      );

      return {
        id: file.id,
        originalFilename: file.original_filename,
        storedFilename: file.stored_filename,
        filePath: file.file_path,
        fileSize: file.file_size,
        mimeType: file.mime_type,
        fileHash: file.file_hash,
        uploadContext: file.upload_context,
        relatedEntityType: file.related_entity_type,
        relatedEntityId: file.related_entity_id,
        virusScanStatus: file.virus_scan_status,
        encryptionEnabled: file.encryption_enabled
      };

    } catch (error) {
      console.error('Get file error:', error);
      throw error;
    }
  }

  // Get file stream for download
  async getFileStream(fileId: string, userId: string): Promise<{ stream: NodeJS.ReadableStream; file: UploadedFile }> {
    const file = await this.getFile(fileId, userId);
    
    if (!file) {
      throw new Error('File not found');
    }

    let stream: NodeJS.ReadableStream;

    if (file.encryptionEnabled) {
      stream = await this.createDecryptedStream(file.filePath);
    } else {
      const fs = require('fs');
      stream = fs.createReadStream(file.filePath);
    }

    // Update download count
    await db.query(`
      UPDATE file_uploads 
      SET download_count = download_count + 1, last_accessed_at = NOW()
      WHERE id = $1
    `, [fileId]);

    return { stream, file };
  }

  // Create decrypted stream for encrypted files
  private async createDecryptedStream(encryptedFilePath: string): Promise<NodeJS.ReadableStream> {
    const encryptedBuffer = await fs.readFile(encryptedFilePath);
    
    // Read metadata length
    const metadataLength = encryptedBuffer.readUInt32BE(0);
    
    // Extract metadata
    const metadataBuffer = encryptedBuffer.slice(4, 4 + metadataLength);
    const metadata = JSON.parse(metadataBuffer.toString());
    
    // Extract encrypted content
    const encryptedContent = encryptedBuffer.slice(4 + metadataLength);
    
    // Decrypt content
    const key = Buffer.from(metadata.key, 'hex');
    const iv = Buffer.from(metadata.iv, 'hex');
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    const decrypted = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
    
    // Create readable stream from decrypted buffer
    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push(decrypted);
    stream.push(null);
    
    return stream;
  }

  // Get user's files
  async getUserFiles(userId: string, filters: {
    uploadContext?: string;
    mimeType?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ files: UploadedFile[]; total: number }> {
    try {
      let query = `
        SELECT fu.*, COUNT(*) OVER() as total_count
        FROM file_uploads fu
        JOIN users u ON fu.user_id = u.id
        WHERE u.anonymous_id = $1 AND fu.is_active = true
      `;

      let paramIndex = 2;
      const params: any[] = [userId];

      if (filters.uploadContext) {
        query += ` AND fu.upload_context = $${paramIndex}`;
        params.push(filters.uploadContext);
        paramIndex++;
      }

      if (filters.mimeType) {
        query += ` AND fu.mime_type = $${paramIndex}`;
        params.push(filters.mimeType);
        paramIndex++;
      }

      query += ' ORDER BY fu.created_at DESC';

      if (filters.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
        paramIndex++;
      }

      if (filters.offset) {
        query += ` OFFSET $${paramIndex}`;
        params.push(filters.offset);
        paramIndex++;
      }

      const result = await db.query(query, params);

      const files = result.rows.map(row => ({
        id: row.id,
        originalFilename: row.original_filename,
        storedFilename: row.stored_filename,
        filePath: row.file_path,
        fileSize: row.file_size,
        mimeType: row.mime_type,
        fileHash: row.file_hash,
        uploadContext: row.upload_context,
        relatedEntityType: row.related_entity_type,
        relatedEntityId: row.related_entity_id,
        virusScanStatus: row.virus_scan_status,
        encryptionEnabled: row.encryption_enabled
      }));

      const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;

      return { files, total };

    } catch (error) {
      console.error('Get user files error:', error);
      throw error;
    }
  }

  // Delete file
  async deleteFile(fileId: string, userId: string): Promise<boolean> {
    const transaction = await db.beginTransaction();
    
    try {
      // Get file information
      const file = await this.getFile(fileId, userId);
      if (!file) {
        return false;
      }

      // Mark file as inactive in database
      const result = await transaction.query(`
        UPDATE file_uploads 
        SET is_active = false, updated_at = NOW()
        WHERE id = $1 AND user_id = (SELECT id FROM users WHERE anonymous_id = $2)
      `, [fileId, userId]);

      if (result.rowCount === 0) {
        await transaction.rollback();
        return false;
      }

      // Schedule file for physical deletion (in production, use a background job)
      try {
        await fs.unlink(file.filePath);
        
        // Delete thumbnails if they exist
        if (file.thumbnails) {
          for (const thumbnail of file.thumbnails) {
            try {
              await fs.unlink(thumbnail.path);
            } catch (error) {
              console.error('Failed to delete thumbnail:', error);
            }
          }
        }
      } catch (error) {
        console.error('Failed to delete physical file:', error);
        // Don't fail the transaction if physical deletion fails
      }

      await transaction.commit();

      // Log file deletion
      await auditLogger.logDataAccess(
        userId,
        'file_upload',
        fileId,
        'delete',
        '127.0.0.1',
        undefined,
        { filename: file.originalFilename }
      );

      return true;

    } catch (error) {
      await transaction.rollback();
      console.error('Delete file error:', error);
      throw error;
    } finally {
      await transaction.release();
    }
  }

  // Utility methods
  private isImageFile(mimeType: string): boolean {
    return mimeType.startsWith('image/');
  }

  private determineContentType(mimeType: string): string {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'document';
    if (mimeType.includes('text/')) return 'text';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'spreadsheet';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'document';
    return 'other';
  }

  private parseExifData(exifBuffer: Buffer): any {
    // In a real implementation, you'd use a proper EXIF parser
    // This is a simplified placeholder
    try {
      return {
        hasLocationData: false, // Would be determined by actual EXIF parsing
        camera: null,
        timestamp: null
      };
    } catch (error) {
      return null;
    }
  }

  // Clean up old files (for maintenance)
  async cleanupOldFiles(daysOld: number = 30): Promise<{ deleted: number; errors: number }> {
    try {
      const cutoffDate = new Date(Date.now() - (daysOld * 24 * 60 * 60 * 1000));
      
      // Get files to delete
      const result = await db.query(`
        SELECT id, file_path FROM file_uploads
        WHERE (expires_at IS NOT NULL AND expires_at < NOW())
           OR (is_active = false AND updated_at < $1)
      `, [cutoffDate]);

      let deleted = 0;
      let errors = 0;

      for (const file of result.rows) {
        try {
          await fs.unlink(file.file_path);
          
          // Remove from database
          await db.query('DELETE FROM file_uploads WHERE id = $1', [file.id]);
          
          deleted++;
        } catch (error) {
          console.error(`Failed to delete file ${file.id}:`, error);
          errors++;
        }
      }

      console.log(`Cleanup completed: ${deleted} files deleted, ${errors} errors`);
      return { deleted, errors };

    } catch (error) {
      console.error('File cleanup error:', error);
      throw error;
    }
  }
}

export const fileUploadService = new FileUploadService();
export { FileUploadService, type FileUploadOptions, type UploadedFile };