import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { protect } from '../middleware/authMiddleware.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';
import { logAudit } from '../services/auditLogger.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Stored in dedicated isolated storage directory outside public web root
const uploadDir = path.join(__dirname, '../uploads');

// Ensure isolated upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration with cryptographically secure random names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Determine extension safely
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = /^\.(jpg|jpeg|png|webp|gif|avif)$/.test(ext) ? ext : '.jpg';
    const randomHex = crypto.randomBytes(16).toString('hex');
    const safeFilename = `spice-${Date.now()}-${randomHex}${safeExt}`;
    cb(null, safeFilename);
  }
});

// Image File Extension & MIME Pre-filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /^\.(jpe?g|png|webp|gif|avif)$/i;
  const allowedMimes = /^image\/(jpeg|png|webp|gif|avif)$/i;

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExtensions.test(ext) && allowedMimes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only genuine image files (JPG, PNG, WebP, GIF, AVIF) under 5MB are allowed'));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB strict limit per image
    files: 10
  },
  fileFilter
});

/**
 * Deep File Content Inspection: Validates Magic Bytes
 * Confirms the binary signature matches real image data, not renamed executable scripts.
 */
const validateImageContentSignature = (filePath) => {
  try {
    const buffer = Buffer.alloc(16);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, 16, 0);
    fs.closeSync(fd);

    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'jpeg';
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
      return 'png';
    }

    // GIF: 47 49 46 38 ('GIF8')
    if (
      buffer[0] === 0x47 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x38
    ) {
      return 'gif';
    }

    // WEBP: RIFF .... WEBP
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return 'webp';
    }

    // AVIF: .... ftyp
    const ftyp = buffer.toString('ascii', 4, 12);
    if (ftyp.includes('ftyp') || ftyp.includes('avif') || ftyp.includes('mif1')) {
      return 'avif';
    }

    return null;
  } catch (err) {
    console.error('[validateImageContentSignature] Error checking magic bytes:', err);
    return null;
  }
};

// Endpoint: Protected Upload Image(s) with MIME, Size & Magic Byte Verification
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
          return res.status(400).json({ success: false, message: 'File is too large. Maximum allowed size is 5MB.' });
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

        // Validate content binary signature (magic bytes) for each uploaded file
        for (const file of uploadedFiles) {
          const detectedType = validateImageContentSignature(file.path);
          if (!detectedType) {
            // Delete corrupt or disguised file immediately
            try {
              if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
            } catch (unlinkErr) {
              console.warn('[UploadSecurity] Could not delete rejected file:', unlinkErr);
            }
            return res.status(400).json({
              success: false,
              message: 'Security validation failed: File content does not match genuine image binary signature.'
            });
          }
        }

        const urls = uploadedFiles.map((f) => `/uploads/${f.filename}`);

        await logAudit(req, {
          action: 'FILE_UPLOAD',
          resourceType: 'System',
          details: {
            fileCount: uploadedFiles.length,
            files: urls
          }
        });

        return res.json({
          success: true,
          message: 'Image(s) verified and uploaded successfully',
          url: urls[0],
          urls,
          files: uploadedFiles.map((f) => ({
            filename: f.filename,
            size: f.size,
            url: `/uploads/${f.filename}`
          }))
        });
      } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
      }
    });
  }
);

export default router;
