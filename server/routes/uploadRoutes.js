import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';
import { logAudit } from '../services/auditLogger.js';

const router = express.Router();

// Memory Storage: Ideal for serverless deployment (Vercel) & direct MongoDB storage
const storage = multer.memoryStorage();

// Image File Extension & MIME Pre-filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = /^image\/(jpeg|png|webp|gif|avif)$/i;
  if (allowedMimes.test(file.mimetype) || /\.(jpe?g|png|webp|gif|avif)$/i.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error('Only genuine image files (JPG, PNG, WebP, GIF, AVIF) under 5MB are allowed'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1024 * 1024, // 4MB safe limit for MongoDB document storage
    files: 10
  },
  fileFilter
});

/**
 * Deep Binary Magic Byte Validation on Memory Buffer
 */
const validateImageBufferSignature = (buffer) => {
  if (!buffer || buffer.length < 4) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg';
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return 'image/png';
  }

  // GIF: 47 49 46 38 ('GIF8')
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return 'image/gif';
  }

  // WEBP: RIFF .... WEBP
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return 'image/webp';
  }

  // AVIF: .... ftyp
  const ftyp = buffer.toString('ascii', 4, 16);
  if (ftyp.includes('ftyp') || ftyp.includes('avif') || ftyp.includes('mif1')) {
    return 'image/avif';
  }

  return null;
};

// Endpoint: Protected Upload Image(s) returning universally accessible Data URIs
router.post(
  '/',
  protect, // Authentication required
  adminMutationRateLimiter, // Mutation rate limit
  (req, res) => {
    upload.fields([
      { name: 'images', maxCount: 10 },
      { name: 'image', maxCount: 1 }
    ])(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File is too large. Maximum allowed size is 4MB.' });
        }
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
      } else if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      try {
        const uploadedFiles = [];
        if (req.files?.images) uploadedFiles.push(...req.files.images);
        if (req.files?.image) uploadedFiles.push(...req.files.image);
        if (req.file) uploadedFiles.push(req.file);

        if (uploadedFiles.length === 0) {
          return res.status(400).json({ success: false, message: 'No image file uploaded' });
        }

        const dataUris = [];
        for (const file of uploadedFiles) {
          const detectedMime = validateImageBufferSignature(file.buffer);
          if (!detectedMime) {
            return res.status(400).json({
              success: false,
              message: 'Security validation failed: File content does not match genuine image binary signature.'
            });
          }

          // Convert to direct Base64 Data URI
          const base64Data = file.buffer.toString('base64');
          const dataUri = `data:${detectedMime};base64,${base64Data}`;
          dataUris.push(dataUri);
        }

        await logAudit(req, {
          action: 'FILE_UPLOAD',
          resourceType: 'System',
          details: {
            fileCount: uploadedFiles.length,
            fileSizes: uploadedFiles.map((f) => f.size)
          }
        });

        return res.json({
          success: true,
          message: 'Image(s) verified and processed successfully',
          url: dataUris[0],
          urls: dataUris,
          files: uploadedFiles.map((f, i) => ({
            filename: f.originalname,
            size: f.size,
            url: dataUris[i]
          }))
        });
      } catch (error) {
        console.error('[UploadHandler Error]', error);
        return res.status(500).json({ success: false, message: error.message });
      }
    });
  }
);

export default router;
