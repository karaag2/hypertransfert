const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");
const busboy = require("busboy");
const os = require("os");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const DATA_DIR = path.join(process.cwd(), ".data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

app.prepare().then(() => {
  createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Enable CORS for raw APIs just in case
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
      }

      if (pathname === "/api/raw/upload" && req.method === "POST") {
        const bb = busboy({ headers: req.headers });
        let safeName = "upload_" + Date.now();
        let fileId = "";
        let originalName = "";
        let mimeType = "application/octet-stream";
        let fileSize = 0;
        
        bb.on("file", (name, file, info) => {
          originalName = info.filename || "unknown";
          mimeType = info.mimeType || "application/octet-stream";
          // We add a unique suffix to avoid overwriting
          safeName = sanitizeFilename(originalName) + "_" + Date.now().toString(36);
          fileId = safeName;
          
          const saveTo = path.join(DATA_DIR, safeName);
          const writeStream = fs.createWriteStream(saveTo);
          
          file.on("data", (data) => {
            fileSize += data.length;
          });
          
          file.pipe(writeStream);
        });

        bb.on("finish", () => {
          if (!fileId) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "No file uploaded" }));
            return;
          }

          // Save metadata
          const metadataPath = path.join(DATA_DIR, `${safeName}.meta.json`);
          const metadata = {
            originalName,
            size: fileSize,
            mimeType,
          };
          fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

          const localIp = getLocalIpAddress();
          const downloadUrl = `http://${localIp}:${port}/d/${fileId}`;

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true, fileId, downloadUrl }));
        });

        bb.on("error", (err) => {
          console.error(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Upload failed" }));
        });

        req.pipe(bb);
        return;
      }

      if (pathname.startsWith("/api/raw/download/") && req.method === "GET") {
        const id = pathname.replace("/api/raw/download/", "");
        if (!id) {
          res.writeHead(404);
          res.end("Not Found");
          return;
        }

        const safeId = path.basename(id);
        const filePath = path.join(DATA_DIR, safeId);
        const metadataPath = path.join(DATA_DIR, `${safeId}.meta.json`);

        if (!fs.existsSync(filePath)) {
          res.writeHead(404);
          res.end("File not found");
          return;
        }

        let metadata = { originalName: safeId, mimeType: "application/octet-stream", size: 0 };
        if (fs.existsSync(metadataPath)) {
          try {
            metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
          } catch (e) {}
        }

        const stat = fs.statSync(filePath);

        res.writeHead(200, {
          "Content-Type": metadata.mimeType,
          "Content-Length": stat.size,
          "Content-Disposition": `attachment; filename="${encodeURIComponent(metadata.originalName)}"`,
        });

        // Zero-copy high performance pipe with large buffers
        const readStream = fs.createReadStream(filePath, { highWaterMark: 10 * 1024 * 1024 }); // 10MB chunks
        readStream.pipe(res);
        
        req.on("close", () => {
            readStream.destroy();
        });
        return;
      }

      // Pass all other requests to Next.js
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
