import os from "os";

export function getLocalIpAddress(): string {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    const iface = interfaces[name];
    if (!iface) continue;
    
    for (const alias of iface) {
      if (alias.family === "IPv4" && !alias.internal) {
        // En0 is usually WiFi on Mac, but we can just return the first non-internal IPv4
        return alias.address;
      }
    }
  }
  
  return "localhost";
}
