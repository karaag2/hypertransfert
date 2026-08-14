"use client";

import { useState } from "react";
import Dropzone from "../components/Dropzone";
import QRCodeDisplay from "../components/QRCodeDisplay";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ url: string; filename: string } | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/raw/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'upload");
      }

      const data = await response.json();
      
      setUploadResult({
        url: data.downloadUrl,
        filename: file.name,
      });
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'envoi du fichier.");
    } finally {
      setIsUploading(false);
    }
  };

  const reset = () => {
    setUploadResult(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4"
          >
            Hypertransfert
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-500"
          >
            Le moyen le plus simple d'envoyer un fichier de votre Mac à votre téléphone.
          </motion.p>
        </div>

        <div className="relative h-[400px]">
          <AnimatePresence mode="wait">
            {!uploadResult ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Dropzone onFileSelect={handleFileSelect} isUploading={isUploading} />
              </motion.div>
            ) : (
              <motion.div
                key="qrcode"
                initial={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <QRCodeDisplay 
                  url={uploadResult.url} 
                  filename={uploadResult.filename} 
                  onReset={reset} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
