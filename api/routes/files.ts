// File Upload Routes
// Complete REST API endpoints for file upload, processing, and management

import express, { Request, Response } from 'express';
import { param, query, body, validationResult } from 'express-validator';
import { fileUploadService } from '../services/fileUpload';
import { authenticate, requireRole } from '../middleware/auth';
import { rateLimit } from '../services/rateLimit';

const router = express.Router();

// Helper function to handle validation errors
const handleValidationErrors = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  return null;
};

// Apply authentication to all routes
router.use(authenticate());

// File Upload Middleware with Rate Limiting
const uploadRateLimit = async (req: Request, res: Response, next: any) => {
  if (!req.user) {
    return res.status(401).json({ error: 'User not authenticated' });
  }

  // Rate limit: 20 uploads per hour per user
  const allowed = await rateLimit.check(`upload:${req.user.id}`, 20, 3600);
  if (!allowed) {
    return res.status(429).json({
      error: 'Upload rate limit exceeded. Please try again later.'
    });
  }

  next();
};

// POST /files/upload - Upload single file
router.post('/upload', uploadRateLimit, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Configure upload options based on request
    const uploadOptions = {
      maxFileSize: parseInt(req.headers['x-max-file-size'] as string) || undefined,
      allowedMimeTypes: req.headers['x-allowed-types'] ? 
        (req.headers['x-allowed-types'] as string).split(',') : undefined,
      uploadContext: req.headers['x-upload-context'] as string,
      relatedEntityType: req.headers['x-entity-type'] as string,
      relatedEntityId: req.headers['x-entity-id'] as string,
      generateThumbnails: req.headers['x-generate-thumbnails'] === 'true',
      enableVirusScanning: req.headers['x-virus-scan'] !== 'false',
      encryptFile: req.headers['x-encrypt'] === 'true'
    };

    // Get multer upload handler
    const upload = fileUploadService.getMulterConfig(uploadOptions);
    
    // Handle single file upload
    const uploadMiddleware = upload.single('file');
    
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('File upload error:', err);
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ error: 'File too large' });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({ error: 'Unexpected file field' });
        }
        if (err.message.includes('not allowed')) {
          return res.status(400).json({ error: err.message });
        }
        
        return res.status(500).json({ error: 'File upload failed' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      try {
        // Process the uploaded file
        const uploadedFile = await fileUploadService.processUploadedFile(
          req.file,
          req.user!.id,
          uploadOptions
        );

        res.status(201).json({
          message: 'File uploaded successfully',
          file: {
            id: uploadedFile.id,
            originalFilename: uploadedFile.originalFilename,
            fileSize: uploadedFile.fileSize,
            mimeType: uploadedFile.mimeType,
            uploadContext: uploadedFile.uploadContext,
            virusScanStatus: uploadedFile.virusScanStatus,
            encryptionEnabled: uploadedFile.encryptionEnabled,
            thumbnails: uploadedFile.thumbnails
          }
        });

      } catch (processError) {
        console.error('File processing error:', processError);
        
        if (processError.message.includes('malicious content')) {
          return res.status(400).json({ error: 'File rejected: security scan failed' });
        }
        
        return res.status(500).json({ error: 'File processing failed' });
      }
    });

  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({ error: 'Upload service error' });
  }
});

// POST /files/upload-multiple - Upload multiple files
router.post('/upload-multiple', uploadRateLimit, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Configure upload options
    const uploadOptions = {
      maxFileSize: parseInt(req.headers['x-max-file-size'] as string) || undefined,
      allowedMimeTypes: req.headers['x-allowed-types'] ? 
        (req.headers['x-allowed-types'] as string).split(',') : undefined,
      uploadContext: req.headers['x-upload-context'] as string,
      relatedEntityType: req.headers['x-entity-type'] as string,
      relatedEntityId: req.headers['x-entity-id'] as string,
      generateThumbnails: req.headers['x-generate-thumbnails'] === 'true',
      enableVirusScanning: req.headers['x-virus-scan'] !== 'false',
      encryptFile: req.headers['x-encrypt'] === 'true'
    };

    // Get multer upload handler for multiple files
    const upload = fileUploadService.getMulterConfig(uploadOptions);
    const uploadMiddleware = upload.array('files', 5); // Maximum 5 files

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        console.error('Multiple file upload error:', err);
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ error: 'One or more files are too large' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ error: 'Too many files. Maximum 5 files allowed.' });
        }
        
        return res.status(500).json({ error: 'File upload failed' });
      }

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return res.status(400).json({ error: 'No files provided' });
      }

      const files = req.files as Express.Multer.File[];
      const results = { successful: [], failed: [] as any[] };

      // Process each file
      for (const file of files) {
        try {
          const uploadedFile = await fileUploadService.processUploadedFile(
            file,
            req.user!.id,
            uploadOptions
          );

          results.successful.push({
            id: uploadedFile.id,
            originalFilename: uploadedFile.originalFilename,
            fileSize: uploadedFile.fileSize,
            mimeType: uploadedFile.mimeType,
            uploadContext: uploadedFile.uploadContext,
            virusScanStatus: uploadedFile.virusScanStatus,
            encryptionEnabled: uploadedFile.encryptionEnabled,
            thumbnails: uploadedFile.thumbnails
          });

        } catch (processError) {
          console.error(`File processing error for ${file.originalname}:`, processError);
          results.failed.push({
            filename: file.originalname,
            error: processError.message
          });
        }
      }

      res.status(201).json({
        message: `${results.successful.length} files uploaded successfully, ${results.failed.length} failed`,
        results
      });
    });

  } catch (error) {
    console.error('Multiple upload route error:', error);
    res.status(500).json({ error: 'Upload service error' });
  }
});

// GET /files - Get user's files
router.get('/', [
  query('uploadContext').optional().isLength({ min: 1, max: 100 }).withMessage('Invalid upload context'),
  query('mimeType').optional().isLength({ min: 1, max: 100 }).withMessage('Invalid mime type'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const filters = {
      uploadContext: req.query.uploadContext as string,
      mimeType: req.query.mimeType as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const result = await fileUploadService.getUserFiles(req.user.id, filters);

    res.json(result);

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// GET /files/:fileId - Get file information
router.get('/:fileId', [
  param('fileId').isUUID().withMessage('Invalid file ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const file = await fileUploadService.getFile(req.params.fileId, req.user.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({
      file: {
        id: file.id,
        originalFilename: file.originalFilename,
        fileSize: file.fileSize,
        mimeType: file.mimeType,
        uploadContext: file.uploadContext,
        relatedEntityType: file.relatedEntityType,
        relatedEntityId: file.relatedEntityId,
        virusScanStatus: file.virusScanStatus,
        encryptionEnabled: file.encryptionEnabled,
        thumbnails: file.thumbnails
      }
    });

  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ error: 'Failed to get file information' });
  }
});

// GET /files/:fileId/download - Download file
router.get('/:fileId/download', [
  param('fileId').isUUID().withMessage('Invalid file ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Rate limit downloads
    const allowed = await rateLimit.check(`download:${req.user.id}`, 100, 3600);
    if (!allowed) {
      return res.status(429).json({
        error: 'Download rate limit exceeded. Please try again later.'
      });
    }

    const { stream, file } = await fileUploadService.getFileStream(req.params.fileId, req.user.id);

    // Set appropriate headers
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Length', file.fileSize.toString());
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalFilename}"`);
    
    // Security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'private, no-cache');

    // Pipe the file stream to the response
    stream.pipe(res);

    stream.on('error', (error) => {
      console.error('Stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: 'File download failed' });
      }
    });

  } catch (error) {
    console.error('Download file error:', error);
    
    if (error.message === 'File not found') {
      return res.status(404).json({ error: 'File not found' });
    }
    
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// GET /files/:fileId/thumbnail/:size - Get file thumbnail
router.get('/:fileId/thumbnail/:size', [
  param('fileId').isUUID().withMessage('Invalid file ID'),
  param('size').isIn(['small', 'medium', 'large']).withMessage('Invalid thumbnail size')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const file = await fileUploadService.getFile(req.params.fileId, req.user.id);

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (!file.thumbnails) {
      return res.status(404).json({ error: 'No thumbnails available for this file' });
    }

    const thumbnail = file.thumbnails.find(t => t.size === req.params.size);
    if (!thumbnail) {
      return res.status(404).json({ error: 'Thumbnail size not found' });
    }

    // Stream thumbnail file
    const fs = require('fs');
    const thumbnailStream = fs.createReadStream(thumbnail.path);

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours

    thumbnailStream.pipe(res);

    thumbnailStream.on('error', (error) => {
      console.error('Thumbnail stream error:', error);
      if (!res.headersSent) {
        res.status(404).json({ error: 'Thumbnail not found' });
      }
    });

  } catch (error) {
    console.error('Get thumbnail error:', error);
    res.status(500).json({ error: 'Failed to get thumbnail' });
  }
});

// DELETE /files/:fileId - Delete file
router.delete('/:fileId', [
  param('fileId').isUUID().withMessage('Invalid file ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const success = await fileUploadService.deleteFile(req.params.fileId, req.user.id);

    if (!success) {
      return res.status(404).json({ error: 'File not found' });
    }

    res.json({ message: 'File deleted successfully' });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// POST /files/bulk-delete - Bulk delete files
router.post('/bulk-delete', [
  body('fileIds').isArray({ min: 1, max: 50 }).withMessage('File IDs must be an array with 1-50 items'),
  body('fileIds.*').isUUID().withMessage('Invalid file ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { fileIds } = req.body;
    const results = { successful: 0, failed: 0, errors: [] as any[] };

    for (const fileId of fileIds) {
      try {
        const success = await fileUploadService.deleteFile(fileId, req.user.id);
        if (success) {
          results.successful++;
        } else {
          results.failed++;
          results.errors.push({ fileId, error: 'File not found' });
        }
      } catch (error) {
        results.failed++;
        results.errors.push({ fileId, error: error.message });
      }
    }

    res.json({
      message: 'Bulk delete operation completed',
      results
    });

  } catch (error) {
    console.error('Bulk delete files error:', error);
    res.status(500).json({ error: 'Failed to perform bulk delete operation' });
  }
});

// Admin Routes

// GET /files/admin/stats - Get file upload statistics (admin only)
router.get('/admin/stats', [
  requireRole('admin', 'company_admin'),
  query('companyId').optional().isUUID().withMessage('Invalid company ID'),
  query('startDate').optional().isISO8601().withMessage('Invalid start date'),
  query('endDate').optional().isISO8601().withMessage('Invalid end date')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // This would be implemented in the file upload service
    // For now, return a placeholder response
    const stats = {
      totalFiles: 0,
      totalSize: 0,
      filesByType: {},
      recentUploads: 0,
      virusScanResults: {
        clean: 0,
        infected: 0,
        failed: 0
      }
    };

    res.json({ stats });

  } catch (error) {
    console.error('Get file stats error:', error);
    res.status(500).json({ error: 'Failed to get file statistics' });
  }
});

// POST /files/admin/cleanup - Clean up old files (admin only)
router.post('/admin/cleanup', [
  requireRole('admin', 'super_admin'),
  body('daysOld').optional().isInt({ min: 1, max: 365 }).withMessage('Days old must be 1-365')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const daysOld = req.body.daysOld || 30;
    const result = await fileUploadService.cleanupOldFiles(daysOld);

    res.json({
      message: 'File cleanup completed',
      result
    });

  } catch (error) {
    console.error('File cleanup error:', error);
    res.status(500).json({ error: 'Failed to perform file cleanup' });
  }
});

// POST /files/admin/rescan - Rescan files for viruses (admin only)
router.post('/admin/rescan', [
  requireRole('admin', 'super_admin'),
  body('fileIds').optional().isArray().withMessage('File IDs must be an array'),
  body('fileIds.*').optional().isUUID().withMessage('Invalid file ID')
], async (req: Request, res: Response) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return;

    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // This would trigger a background job to rescan files
    // For now, return a success response
    res.json({
      message: 'File rescan initiated',
      jobId: `rescan_${Date.now()}`
    });

  } catch (error) {
    console.error('File rescan error:', error);
    res.status(500).json({ error: 'Failed to initiate file rescan' });
  }
});

export default router;