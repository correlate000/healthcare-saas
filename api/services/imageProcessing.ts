// Image Processing Service
// Advanced image processing for healthcare applications with privacy protection

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { auditLogger } from './audit';

interface ImageProcessingOptions {
  removeExif?: boolean;
  convertFormat?: string;
  quality?: number;
  resize?: {
    width?: number;
    height?: number;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  };
  watermark?: {
    text?: string;
    image?: string;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    opacity?: number;
  };
  blur?: {
    sigma: number;
    regions?: Array<{ x: number; y: number; width: number; height: number }>;
  };
  anonymize?: {
    detectFaces?: boolean;
    blurFaces?: boolean;
    removeText?: boolean;
  };
  medicalEnhancement?: {
    contrastEnhancement?: boolean;
    noiseReduction?: boolean;
    edgeEnhancement?: boolean;
    colorNormalization?: boolean;
  };
}

interface ProcessedImageResult {
  processedPath: string;
  originalDimensions: { width: number; height: number };
  processedDimensions: { width: number; height: number };
  format: string;
  size: number;
  processingSteps: string[];
  metadata?: any;
}

interface ImageAnalysisResult {
  dimensions: { width: number; height: number };
  format: string;
  colorSpace: string;
  hasAlpha: boolean;
  density?: number;
  quality?: number;
  exifData?: any;
  histogram?: any;
  medicalMarkers?: {
    dicomTags?: any;
    anatomicalRegions?: string[];
    imageType?: string;
  };
  privacyRisks?: {
    hasPersonalInfo?: boolean;
    hasFaces?: boolean;
    hasText?: boolean;
    hasLocationData?: boolean;
  };
}

class ImageProcessingService {
  private tempDir: string;
  private processedDir: string;

  constructor() {
    this.tempDir = path.join(process.env.UPLOAD_DIR || './uploads', 'temp');
    this.processedDir = path.join(process.env.UPLOAD_DIR || './uploads', 'processed');
    this.initializeDirectories();
  }

  private async initializeDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.tempDir, { recursive: true });
      await fs.mkdir(this.processedDir, { recursive: true });
      await fs.mkdir(path.join(this.processedDir, 'medical'), { recursive: true });
      await fs.mkdir(path.join(this.processedDir, 'anonymized'), { recursive: true });
    } catch (error) {
      console.error('Failed to initialize image processing directories:', error);
    }
  }

  // Main image processing function
  async processImage(
    inputPath: string,
    userId: string,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImageResult> {
    try {
      const processingId = uuidv4();
      const processingSteps: string[] = [];

      // Analyze input image
      const analysis = await this.analyzeImage(inputPath);
      
      // Start with the input image
      let pipeline = sharp(inputPath);
      
      // Remove EXIF data for privacy (default for healthcare)
      if (options.removeExif !== false) {
        pipeline = pipeline.withMetadata({ exif: {} });
        processingSteps.push('exif_removal');
      }

      // Apply medical enhancements if requested
      if (options.medicalEnhancement) {
        pipeline = await this.applyMedicalEnhancements(pipeline, options.medicalEnhancement);
        processingSteps.push('medical_enhancement');
      }

      // Apply anonymization if requested
      if (options.anonymize) {
        pipeline = await this.applyAnonymization(pipeline, inputPath, options.anonymize);
        processingSteps.push('anonymization');
      }

      // Apply blur to specific regions if requested
      if (options.blur && options.blur.regions) {
        pipeline = await this.applyRegionalBlur(pipeline, options.blur);
        processingSteps.push('regional_blur');
      }

      // Resize if requested
      if (options.resize) {
        pipeline = pipeline.resize(options.resize.width, options.resize.height, {
          fit: options.resize.fit || 'inside',
          withoutEnlargement: true
        });
        processingSteps.push('resize');
      }

      // Apply watermark if requested
      if (options.watermark) {
        pipeline = await this.applyWatermark(pipeline, options.watermark);
        processingSteps.push('watermark');
      }

      // Convert format if requested
      const outputFormat = options.convertFormat || analysis.format;
      const quality = options.quality || 85;

      switch (outputFormat.toLowerCase()) {
        case 'jpeg':
        case 'jpg':
          pipeline = pipeline.jpeg({ quality, mozjpeg: true });
          break;
        case 'png':
          pipeline = pipeline.png({ quality, compressionLevel: 6 });
          break;
        case 'webp':
          pipeline = pipeline.webp({ quality });
          break;
        case 'tiff':
          pipeline = pipeline.tiff({ quality });
          break;
        default:
          pipeline = pipeline.jpeg({ quality, mozjpeg: true });
          break;
      }

      if (outputFormat !== analysis.format) {
        processingSteps.push('format_conversion');
      }

      // Generate output filename
      const outputFilename = `${processingId}.${outputFormat}`;
      const outputPath = path.join(this.processedDir, outputFilename);

      // Execute the processing pipeline
      const info = await pipeline.toFile(outputPath);

      // Get file size
      const stats = await fs.stat(outputPath);

      // Log processing operation
      await auditLogger.logDataAccess(
        userId,
        'image_processing',
        processingId,
        'create',
        '127.0.0.1',
        undefined,
        {
          inputPath: path.basename(inputPath),
          outputPath: path.basename(outputPath),
          processingSteps,
          originalSize: analysis.dimensions,
          processedSize: { width: info.width, height: info.height }
        }
      );

      return {
        processedPath: outputPath,
        originalDimensions: analysis.dimensions,
        processedDimensions: { width: info.width || 0, height: info.height || 0 },
        format: info.format || outputFormat,
        size: stats.size,
        processingSteps,
        metadata: {
          processingId,
          userId,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Image processing error:', error);
      throw error;
    }
  }

  // Analyze image properties and detect potential privacy issues
  async analyzeImage(imagePath: string): Promise<ImageAnalysisResult> {
    try {
      const image = sharp(imagePath);
      const metadata = await image.metadata();
      
      // Basic image information
      const analysis: ImageAnalysisResult = {
        dimensions: { width: metadata.width || 0, height: metadata.height || 0 },
        format: metadata.format || 'unknown',
        colorSpace: metadata.space || 'unknown',
        hasAlpha: metadata.hasAlpha || false,
        density: metadata.density,
        exifData: metadata.exif ? this.parseExifData(metadata.exif) : null
      };

      // Check for privacy risks
      analysis.privacyRisks = await this.assessPrivacyRisks(imagePath, metadata);

      // Medical image analysis
      if (this.isMedicalImage(imagePath, metadata)) {
        analysis.medicalMarkers = await this.analyzeMedicalImage(imagePath, metadata);
      }

      // Generate histogram for image quality assessment
      const stats = await image.stats();
      analysis.histogram = {
        channels: stats.channels?.map(channel => ({
          min: channel.min,
          max: channel.max,
          mean: channel.mean,
          std: channel.std
        }))
      };

      return analysis;

    } catch (error) {
      console.error('Image analysis error:', error);
      throw error;
    }
  }

  // Apply medical image enhancements
  private async applyMedicalEnhancements(
    pipeline: sharp.Sharp,
    options: ImageProcessingOptions['medicalEnhancement']
  ): Promise<sharp.Sharp> {
    if (!options) return pipeline;

    // Contrast enhancement
    if (options.contrastEnhancement) {
      pipeline = pipeline.normalise();
    }

    // Noise reduction using blur
    if (options.noiseReduction) {
      pipeline = pipeline.blur(0.5);
    }

    // Edge enhancement using sharpen
    if (options.edgeEnhancement) {
      pipeline = pipeline.sharpen({
        sigma: 1,
        flat: 1,
        jagged: 2
      });
    }

    // Color normalization
    if (options.colorNormalization) {
      pipeline = pipeline.modulate({
        brightness: 1.1,
        saturation: 1.0,
        hue: 0
      });
    }

    return pipeline;
  }

  // Apply anonymization techniques
  private async applyAnonymization(
    pipeline: sharp.Sharp,
    inputPath: string,
    options: ImageProcessingOptions['anonymize']
  ): Promise<sharp.Sharp> {
    if (!options) return pipeline;

    // Face detection and blurring
    if (options.detectFaces && options.blurFaces) {
      const faces = await this.detectFaces(inputPath);
      if (faces.length > 0) {
        // Apply blur to detected face regions
        for (const face of faces) {
          // Create a blurred overlay for each face region
          const blurredRegion = await sharp(inputPath)
            .extract({
              left: face.x,
              top: face.y,
              width: face.width,
              height: face.height
            })
            .blur(10)
            .toBuffer();

          // Composite the blurred region back onto the image
          pipeline = pipeline.composite([{
            input: blurredRegion,
            left: face.x,
            top: face.y
          }]);
        }
      }
    }

    // Text removal (simplified - would use OCR in production)
    if (options.removeText) {
      // Apply slight blur to potential text regions
      pipeline = pipeline.blur(0.3);
    }

    return pipeline;
  }

  // Apply regional blur to specific areas
  private async applyRegionalBlur(
    pipeline: sharp.Sharp,
    blurOptions: ImageProcessingOptions['blur']
  ): Promise<sharp.Sharp> {
    if (!blurOptions || !blurOptions.regions) return pipeline;

    const sigma = blurOptions.sigma || 5;

    for (const region of blurOptions.regions) {
      // Create a blurred version of the region
      const blurredRegion = await pipeline
        .clone()
        .extract({
          left: region.x,
          top: region.y,
          width: region.width,
          height: region.height
        })
        .blur(sigma)
        .toBuffer();

      // Composite it back onto the image
      pipeline = pipeline.composite([{
        input: blurredRegion,
        left: region.x,
        top: region.y
      }]);
    }

    return pipeline;
  }

  // Apply watermark to image
  private async applyWatermark(
    pipeline: sharp.Sharp,
    watermarkOptions: ImageProcessingOptions['watermark']
  ): Promise<sharp.Sharp> {
    if (!watermarkOptions) return pipeline;

    if (watermarkOptions.text) {
      // Text watermark
      const watermarkSvg = this.generateTextWatermark(
        watermarkOptions.text,
        watermarkOptions.opacity || 0.3
      );

      pipeline = pipeline.composite([{
        input: Buffer.from(watermarkSvg),
        gravity: this.getGravityFromPosition(watermarkOptions.position || 'bottom-right')
      }]);
    }

    if (watermarkOptions.image) {
      // Image watermark
      const watermarkBuffer = await fs.readFile(watermarkOptions.image);
      
      pipeline = pipeline.composite([{
        input: watermarkBuffer,
        gravity: this.getGravityFromPosition(watermarkOptions.position || 'bottom-right'),
        blend: 'overlay'
      }]);
    }

    return pipeline;
  }

  // Detect faces in image (simplified implementation)
  private async detectFaces(imagePath: string): Promise<Array<{ x: number; y: number; width: number; height: number }>> {
    // In a real implementation, you would use a face detection service like:
    // - OpenCV
    // - Amazon Rekognition
    // - Google Vision API
    // - Azure Computer Vision
    
    // For now, return empty array as placeholder
    return [];
  }

  // Assess privacy risks in image
  private async assessPrivacyRisks(imagePath: string, metadata: sharp.Metadata): Promise<ImageAnalysisResult['privacyRisks']> {
    const risks: ImageAnalysisResult['privacyRisks'] = {};

    // Check for location data in EXIF
    if (metadata.exif) {
      const exifData = this.parseExifData(metadata.exif);
      risks.hasLocationData = !!(exifData.gps || exifData.location);
    }

    // Check for faces (would use actual face detection)
    risks.hasFaces = false; // Placeholder

    // Check for text (would use OCR)
    risks.hasText = false; // Placeholder

    // Check for personal information
    risks.hasPersonalInfo = risks.hasLocationData || risks.hasFaces || risks.hasText;

    return risks;
  }

  // Check if image is a medical image
  private isMedicalImage(imagePath: string, metadata: sharp.Metadata): boolean {
    // Check file extension and metadata for medical image formats
    const medicalExtensions = ['.dcm', '.dicom'];
    const extension = path.extname(imagePath).toLowerCase();
    
    return medicalExtensions.includes(extension) || 
           (metadata.format === 'magick'); // DICOM images often appear as 'magick' format
  }

  // Analyze medical image properties
  private async analyzeMedicalImage(imagePath: string, metadata: sharp.Metadata): Promise<ImageAnalysisResult['medicalMarkers']> {
    const markers: ImageAnalysisResult['medicalMarkers'] = {};

    // In a real implementation, you would:
    // 1. Parse DICOM tags if it's a DICOM image
    // 2. Detect anatomical regions using ML models
    // 3. Classify the type of medical image (X-ray, MRI, CT, etc.)

    // Placeholder implementation
    markers.imageType = 'unknown';
    markers.anatomicalRegions = [];
    
    return markers;
  }

  // Parse EXIF data from buffer
  private parseExifData(exifBuffer: Buffer): any {
    // In a real implementation, you would use a proper EXIF parser
    // This is a simplified placeholder
    try {
      return {
        hasLocationData: false,
        camera: null,
        timestamp: null,
        gps: null
      };
    } catch (error) {
      return null;
    }
  }

  // Generate SVG text watermark
  private generateTextWatermark(text: string, opacity: number): string {
    return `
      <svg width="200" height="50">
        <text x="10" y="30" font-family="Arial" font-size="16" 
              fill="white" fill-opacity="${opacity}" stroke="black" stroke-width="1">
          ${text}
        </text>
      </svg>
    `;
  }

  // Convert position string to Sharp gravity
  private getGravityFromPosition(position: string): string {
    const gravityMap: Record<string, string> = {
      'top-left': 'northwest',
      'top-right': 'northeast',
      'bottom-left': 'southwest',
      'bottom-right': 'southeast',
      'center': 'center'
    };

    return gravityMap[position] || 'southeast';
  }

  // Batch process multiple images
  async batchProcessImages(
    imagePaths: string[],
    userId: string,
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImageResult[]> {
    const results: ProcessedImageResult[] = [];

    for (const imagePath of imagePaths) {
      try {
        const result = await this.processImage(imagePath, userId, options);
        results.push(result);
      } catch (error) {
        console.error(`Failed to process image ${imagePath}:`, error);
        // Continue with other images even if one fails
      }
    }

    return results;
  }

  // Convert image format while preserving quality
  async convertImageFormat(
    inputPath: string,
    outputFormat: string,
    quality: number = 85
  ): Promise<string> {
    const outputFilename = `${uuidv4()}.${outputFormat}`;
    const outputPath = path.join(this.processedDir, outputFilename);

    let pipeline = sharp(inputPath);

    switch (outputFormat.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        pipeline = pipeline.jpeg({ quality, mozjpeg: true });
        break;
      case 'png':
        pipeline = pipeline.png({ quality, compressionLevel: 6 });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'tiff':
        pipeline = pipeline.tiff({ quality });
        break;
      default:
        throw new Error(`Unsupported output format: ${outputFormat}`);
    }

    await pipeline.toFile(outputPath);
    return outputPath;
  }

  // Clean up processed images
  async cleanupProcessedImages(olderThanHours: number = 24): Promise<{ deleted: number; errors: number }> {
    try {
      const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);
      const files = await fs.readdir(this.processedDir);
      
      let deleted = 0;
      let errors = 0;

      for (const file of files) {
        try {
          const filePath = path.join(this.processedDir, file);
          const stats = await fs.stat(filePath);
          
          if (stats.mtime.getTime() < cutoffTime) {
            await fs.unlink(filePath);
            deleted++;
          }
        } catch (error) {
          console.error(`Failed to delete ${file}:`, error);
          errors++;
        }
      }

      return { deleted, errors };

    } catch (error) {
      console.error('Cleanup processed images error:', error);
      throw error;
    }
  }
}

export const imageProcessingService = new ImageProcessingService();
export { ImageProcessingService, type ImageProcessingOptions, type ProcessedImageResult, type ImageAnalysisResult };