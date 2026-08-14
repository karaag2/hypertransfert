import path from "path";
import crypto from "crypto";
import fs from "fs";

export const DATA_DIR = path.join(process.cwd(), ".data");

// Ensure the data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function sanitizeFilename(userFilename: string): string {
  // Extract just the base name
  const base = path.basename(userFilename);
  
  // Remove any remaining path chars or weird symbols
  const sanitized = base.replace(/[^a-zA-Z0-9.-]/g, "_");
  
  // Create a unique name to prevent collisions but keep the extension
  const ext = path.extname(sanitized).toLowerCase();
  const uniqueId = crypto.randomUUID();
  
  return `${uniqueId}${ext}`;
}
