import fs from "fs";
import path from "path";
import { DATA_DIR } from "../../../lib/storage";
import { Download, HardDrive } from "lucide-react";

// Format bytes to a human-readable string
function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default async function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const safeId = path.basename(id);
  const metadataPath = path.join(DATA_DIR, `${safeId}.meta.json`);

  let fileExists = false;
  let metadata = { originalName: safeId, size: 0, mimeType: "" };

  if (fs.existsSync(metadataPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      fileExists = true;
    } catch (e) {
      console.error(e);
    }
  }

  if (!fileExists) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Fichier introuvable</h1>
          <p className="text-gray-500">Ce fichier n'existe plus ou le lien est invalide.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
        
        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
          <HardDrive className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 break-all line-clamp-3">
          {metadata.originalName}
        </h1>
        
        <p className="text-gray-500 font-medium mb-8">
          {formatBytes(metadata.size)}
        </p>

        <a
          href={`/api/raw/download/${safeId}`}
          className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-[0.98] transition-all duration-200 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 shadow-sm"
          download={metadata.originalName}
        >
          <Download className="w-5 h-5" />
          Télécharger le fichier
        </a>
      </div>
    </main>
  );
}
