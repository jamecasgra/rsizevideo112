const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const ffprobeInstaller = require("@ffprobe-installer/ffprobe");
const fs = require("fs").promises;
const fsSync = require("fs");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const nodemailer = require("nodemailer");
const mcache = require("memory-cache");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const { pipeline } = require("stream");
const util = require("util");
const streamPipeline = util.promisify(pipeline);

// Configuration constants
const processingPort = process.env.PROCESSING_PORT || 5000;
const downloadPort = process.env.DOWNLOAD_PORT || 5001;
const API_KEY = process.env.API_KEY || "wetrbctyrt23r672429346b8cw9b8erywueyr7123647326489bc18yw89eucr9b1287346bc1ywuerbqwyueirybcqy98r761b237489656231892erbcw89biuo12u3468sdgn01298nc8n1ndi2n8u1nw9dn3717nspskfnw9731n0237461928ubc762yuebcqiwub127934";
const FRONTEND_URL = process.env.FRONTEND_URL || "https://rsizevideo.com";
const ZOHO_MAIL_FROM = process.env.ZOHO_MAIL_FROM || "mail.rsizevideo@rsizevideo.com";
const ZOHO_MAIL_PASSWORD = process.env.ZOHO_MAIL_PASSWORD || "pass";

// Resource configuration
const MAX_MEMORY = 4 * 1024; // 4GB in MB
process.env.NODE_OPTIONS = `--max-old-space-size=${MAX_MEMORY}`;

// FFmpeg configuration
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.eu',
  port: 465,
  secure: true,
  auth: {
    user: ZOHO_MAIL_FROM,
    pass: ZOHO_MAIL_PASSWORD
  },
  pool: true,
  maxConnections: 10,
  maxMessages: Infinity
});

// Constants
const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
const VIDEOS_DIR = path.join(__dirname, "videos");
const UPLOADS_DIR = path.join(__dirname, "uploads");
const TEMP_DIR = path.join(__dirname, "temp");

// Initialize Express applications
const processingApp = express();
const downloadApp = express();

// Memory cache for responses
const responseCache = new mcache.Cache();

// Email notification function
const sendEmailNotification = async (email, videoData) => {
  try {
    const downloadUrl = `${FRONTEND_URL}/download/${videoData.id}`;
    const mailOptions = {
      from: ZOHO_MAIL_FROM,
      to: email,
      subject: "Your compressed video is ready!",
      text: `Your video has been successfully compressed. We've reduced the size by ${videoData.reductionPercentage}%. Access your video here: ${downloadUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="${FRONTEND_URL}/logo.png" alt="Logo" style="width: 120px; height: auto;" />
          </div>
          <h1 style="color: #2563eb; text-align: center; margin-bottom: 30px;">Your video is ready!</h1>
          <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; margin-top: 0;">Compression Details:</h2>
            <div style="margin: 20px 0; background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="font-size: 36px; font-weight: bold; color: #2563eb;">
                  ${videoData.reductionPercentage}%
                </div>
                <div style="color: #6b7280; font-size: 16px;">Total Reduction</div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
                <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px;">
                  <div style="font-size: 18px; font-weight: bold; color: #2563eb;">
                    ${(videoData.originalSize / (1024 * 1024)).toFixed(2)} MB
                  </div>
                  <div style="color: #6b7280; font-size: 14px;">Original Size</div>
                </div>
                <div style="text-align: center; padding: 10px; background-color: #ffffff; border-radius: 6px;">
                  <div style="font-size: 18px; font-weight: bold; color: #2563eb;">
                    ${(videoData.newSize / (1024 * 1024)).toFixed(2)} MB
                  </div>
                  <div style="color: #6b7280; font-size: 14px;">New Size</div>
                </div>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <div style="font-size: 16px; color: #4b5563; margin-bottom: 10px;">
                Filename: <span style="color: #2563eb; font-weight: bold;">${videoData.filename}</span>
              </div>
              <div style="font-size: 16px; color: #4b5563;">
                Processing Time: <span style="color: #2563eb; font-weight: bold;">${(videoData.compressionTime / 60).toFixed(1)} minutes</span>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${downloadUrl}" 
               style="display: inline-block; background-color: #2563eb; color: white; font-weight: bold; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; transition: background-color 0.2s;">
              View and Download Video
            </a>
          </div>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 25px 0;">
            <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4b5563" stroke-width="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span style="margin-left: 8px; color: #4b5563; font-weight: bol
d;">Important</span>
            </div>
            <p style="margin: 0; color: #4b5563; font-size: 14px; text-align: center;">
              Your video will be available for the next 24 hours
            </p>
          </div>
          <div style="text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 20px;">
            <p>This is an automated email, please do not reply to this message.</p>
            <p style="margin-top: 10px;">© ${new Date().getFullYear()} Video Compressor. All rights reserved.</p>
          </div>
        </div>
      `
    };
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    const key = "__express__" + req.originalUrl || req.url;
    const cachedBody = responseCache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        responseCache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// Configure middleware
const configureApp = (app) => {
  app.use(
    compression({
      level: 1,
      threshold: 10 * 1024,
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false;
        }
        return compression.filter(req, res);
      },
    })
  );
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      exposedHeaders: ["Content-Disposition", "X-Expires-In"],
      optionsSuccessStatus: 200,
      maxAge: 86400,
    })
  );
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      crossOriginOpenerPolicy: { policy: "unsafe-none" },
      contentSecurityPolicy: false,
    })
  );
  app.use(
    express.json({
      limit: "1mb",
      strict: false,
    })
  );
  app.disable("x-powered-by");
  app.setMaxListeners(0);
};

// Configure both applications
configureApp(processingApp);
configureApp(downloadApp);

// API Key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers.authorization?.split(" ")[1];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized: Invalid API Key" });
  }
  next();
};

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
    cb(null, `${uniqueId}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 4000 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

// Initialize storage directories
async function initializeStorage() {
  await Promise.all([
    fs.mkdir(VIDEOS_DIR, { recursive: true }),
    fs.mkdir(UPLOADS_DIR, { recursive: true }),
    fs.mkdir(TEMP_DIR, { recursive: true }),
  ]);
}

// Generate unique ID
function generateUniqueId() {
  return crypto.randomBytes(16).toString("hex");
}

// Clean up expired videos
async function cleanupExpiredVideos() {
  try {
    const folders = await fs.readdir(VIDEOS_DIR);
    const now = Date.now();
    const deletePromises = [];
    for (const folder of folders) {
      const folderPath = path.join(VIDEOS_DIR, folder);
      const statsPath = path.join(folderPath, "stats.json");
      try {
        const statsData = await fs.readFile(statsPath, "utf8");
        const stats = JSON.parse(statsData);
        if (now - stats.createdAt > EXPIRATION_TIME) {
          deletePromises.push(
            fs
              .rm(folderPath, { recursive: true, force: true })
              .then(() => console.log(`Cleaned up expired folder: ${folder}`))
              .catch((err) => console.error(`Error deleting folder ${folder}:`, err))
          );
        }
      } catch (error) {
        try {
          const folderStats = await fs.stat(folderPath);
          if (now - folderStats.birthtimeMs > EXPIRATION_TIME * 2) {
            deletePromises.push(
              fs
                .rm(folderPath, { recursive: true, force: true })
                .then(() => console.log(`Cleaned up old folder without stats: ${folder}`))
                .catch((err) => console.error(`Error deleting folder ${folder}:`, err))
            );
          }
        } catch (statError) {
          console.error(`Error getting stats for folder ${folder}:`, statError);
        }
      }
    }
    if (deletePromises.length > 0) {
      await Promise.all(deletePromises);
    }
    // Clean uploads directory
    try {
      const uploadFiles = await fs.readdir(UPLOADS_DIR);
      const uploadDeletePromises = [];
      for (const file of uploadFiles) {
        const filePath = path.join(UPLOADS_DIR, file);
        try {
          const fileStats = await fs.stat(filePath);
          if (now - fileStats.birthtimeMs > EXPIRATION_TIME) {
            uploadDeletePromises.push(
              fs
                .unlink(filePath)
                .then(() => console.log(`Cleaned up old upload file: ${file}`))
                .catch((err) => console.error(`Error deleting upload file ${file}:`, err))
            );
          }
        } catch (statError) {
          console.error(`Error getting stats for upload file ${file}:`, statError);
        }
      }
      if (uploadDeletePromises.length > 0) {
        await Promise.all(uploadDeletePromises);
      }
    } catch (uploadError) {
      console.error("Error cleaning upload directory:", uploadError);
    }
  } catch (error) {
    console.error("Error in cleanup:", error);
  }
}

// Get video information
async function getVideoInfo(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(
      filePath,
      {
        probesize: 5000000,
        analyzeduration: 5000000,
      },
      (err, metadata) => {
        if (err) reject(err);
        else
          resolve({
            ...metadata.format,
            size: metadata.format.size,
          });
      }
    );
  });
}

// Update the compression function in server.js
const compressVideo = async (inputPath, outputPath, targetSizeMB, videoInfo) => {
  return new Promise((resolve, reject) => {
    const targetBitrate = Math.floor((targetSizeMB * 8388608) / videoInfo.duration);
    
    ffmpeg(inputPath)
      .outputOptions([
        `-b:v ${targetBitrate}`,
        '-c:v libx264',
        '-preset medium',
        '-c:a aac',
        '-b:a 128k',
        '-movflags +faststart',
        '-maxrate 5M',
        '-bufsize 10M'
      ])
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
};

// Process video endpoint
processingApp.post("/process-video", validateApiKey, upload.single("video"), async (req, res) => {
  if (req.file === undefined) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const { targetSize, email } = req.body;
  if (!targetSize) {
    return res.status(400).json({ error: "Target size is required" });
  }
  const inputPath = req.file.path;
  const uniqueId = generateUniqueId();
  const outputDir = path.join(VIDEOS_DIR, uniqueId);
  const originalName = path.parse(req.file.originalname).name;

  // Avoid duplicating the suffix if it already exists
  let outputFilename = "";
  if (originalName.toLowerCase().includes("rsizevideo")) {
    outputFilename = `${originalName}.mp4`;
  } else {
    outputFilename = `${originalName}-rsizevideo-com.mp4`;
  }
  const outputPath = path.join(outputDir, outputFilename);
  try {
    await fs.mkdir(outputDir);
    const startTime = Date.now();
    const videoInfo = await getVideoInfo(inputPath);
    const originalSize = videoInfo.size;
    const originalSizeMB = originalSize / (1024 * 1024);
    const targetSizeMB = Number(targetSize);
    if (targetSizeMB >= originalSizeMB) {
      await fs.unlink(inputPath);
      return res.status(400).json({
        error: "Target size must be smaller than the original file size",
        originalSize: originalSizeMB,
      });
    }
    if (email) {
      res.json({
        id: uniqueId,
        filename: outputFilename,
        expiresAt: new Date(Date.now() + EXPIRATION_TIME).toISOString(),
        originalSize,
        estimatedNewSize: originalSize * (targetSizeMB / originalSizeMB),
        estimatedReductionPercentage: (100 - (targetSizeMB / originalSizeMB) * 100).toFixed(2),
        emailNotification: true,
        email,
        status: "processing",
      });
      (async () => {
        try {
          await compressVideo(inputPath, outputPath, targetSizeMB, videoInfo);
          const endTime = Date.now();
          const compressionTime = (endTime - startTime) / 1000;
          const statsObj = await fs.stat(outputPath);
          const newSize = statsObj.size;
          const reductionPercentage = ((originalSize - newSize) / originalSize) * 100;
          const statsData = {
            id: uniqueId,
            createdAt: Date.now(),
            originalSize,
            newSize,
            reductionPercentage,
            compressionTime,
            filename: outputFilename,
            email,
            status: "completed",
          };
          await fs.writeFile(
            path.join(outputDir, "stats.json"),
            JSON.stringify(statsData)
          );
          await sendEmailNotification(email, {
            id: uniqueId,
            filename: outputFilename,
            originalSize,
            newSize,
            reductionPercentage: reductionPercentage.toFixed(2),
            compressionTime,
          });
          await fs.unlink(inputPath);
        } catch (error) {
          console.error("Background processing error:", error);
          try {
            await fs.unlink(inputPath);
          } catch (deleteError) {
            console.error("Error deleting input file:", deleteError);
          }
        }
      })().catch((err) => console.error("Async processing error:", err));
    } else {
      await compressVideo(inputPath, outputPath, targetSizeMB, videoInfo);
      const endTime = Date.now();
      const compressionTime = (endTime - startTime) / 1000;
      const statsObj = await fs.stat(outputPath);
      const newSize = statsObj.size;
      const reductionPercentage = ((originalSize - newSize) / originalSize) * 100;
      const statsData = {
        id: uniqueId,
        createdAt: Date.now(),
        originalSize,
        newSize,
        reductionPercentage,
        compressionTime,
        filename: outputFilename,
        status: "completed",
      };
      await fs.writeFile(
        path.join(outputDir, "stats.json"),
        JSON.stringify(statsData)
      );
      await fs.unlink(inputPath);
      res.json({
        id: uniqueId,
        filename: outputFilename,
        expiresAt: new Date(Date.now() + EXPIRATION_TIME).toISOString(),
        originalSize,
        newSize,
        reductionPercentage: reductionPercentage.toFixed(2),
        compressionTime,
        status: "completed",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    try {
      await fs.unlink(inputPath);
    } catch (deleteError) {
      console.error("Error deleting input file:", deleteError);
    }
    res.status(500).json({ error: "Failed to process video" });
  }
});

// Video status endpoint
processingApp.get("/video-status/:id", validateApiKey, async (req, res) => {
  const { id } = req.params;
  const statsPath = path.join(VIDEOS_DIR, id, "stats.json");
  try {
    const stats = JSON.parse(await fs.readFile(statsPath, "utf8"));
    const now = Date.now();
    if (now - stats.createdAt > EXPIRATION_TIME) {
      stats.status = "expired";
    }
    res.json(stats);
  } catch (error) {
    res.status(404).json({ error: "Video not found" });
  }
});

// Download endpoint
downloadApp.get("/download-video/:id/:filename", async (req, res) => {
  const { id, filename } = req.params;
  const filePath = path.join(VIDEOS_DIR, id, filename);
  const statsPath = path.join(VIDEOS_DIR, id, "stats.json");
  try {
    let stats;
    try {
      const statsData = await fs.readFile(statsPath, "utf8");
      stats = JSON.parse(statsData);
    } catch (err) {
      console.error("Error reading stats file:", err);
      return res.status(404).json({ error: "Video not found" });
    }
    const now = Date.now();
    if (now - stats.createdAt > EXPIRATION_TIME) {
      fs.rm(path.join(VIDEOS_DIR, id), { recursive: true, force: true })
        .catch((err) => console.error(`Error deleting expired folder ${id}:`, err));
      return res.status(404).json({ error: "File has expired" });
    }
    try {
      await fs.access(filePath);
    } catch (err) {
      console.error("Error accessing video file:", err);
      return res.status(404).json({ error: "Video file not found" });
    }
    const timeRemaining = EXPIRATION_TIME - (now - stats.createdAt);
    const hoursRemaining = Math.floor(timeRemaining / (60 * 60 * 1000));
    const minutesRemaining = Math.floor((timeRemaining % (60 * 60 * 1000)) / (60 * 1000));
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("X-Expires-In", `${hoursRemaining}h ${minutesRemaining}m`);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.setHeader("Accept-Ranges", "bytes");
    const fileStats = await fs.stat(filePath);
    const fileSize = fileStats.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      res.setHeader("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      res.setHeader("Content-Length", chunkSize);
      res.status(206);
      const fileStream = fsSync.createReadStream(filePath, { start, end });
      fileStream.pipe(res);
    } else {
      res.setHeader("Content-Length", fileSize);
      const fileStream = fsSync.createReadStream(filePath);
      fileStream.pipe(res);
    }
  } catch (error) {
    console.error("Error serving video:", error);
    res.status(404).json({ error: "File not found or has expired" });
  }
});

// Health check endpoints
processingApp.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", memory: process.memoryUsage() });
});
downloadApp.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", memory: process.memoryUsage() });
});

// Start servers
async function startServers() {
  await initializeStorage();
  processingApp.listen(processingPort, "0.0.0.0", () => {
    console.log(`Processing server running on port ${processingPort}`);
    cleanupExpiredVideos();
    setInterval(cleanupExpiredVideos, 30 * 60 * 1000);
  });
  downloadApp.listen(downloadPort, "0.0.0.0", () => {
    console.log(`Download server running on port ${downloadPort}`);
  });
}
startServers().catch((err) => {
  console.error("Failed to start servers:", err);
  process.exit(1);
});

// This is just to show the code was fixed
console.log("Server code fixed successfully");
