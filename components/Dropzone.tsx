"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud } from "lucide-react";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export default function Dropzone({ onFileSelect, isUploading }: DropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onFileSelect(e.dataTransfer.files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
      className="relative w-full max-w-xl mx-auto"
    >
      <label
        htmlFor="file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-80 rounded-3xl border-2 border-dashed cursor-pointer transition-colors duration-200 ease-out overflow-hidden
          ${
            isDragActive
              ? "border-blue-500 bg-blue-50/50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
          }
          ${isUploading ? "pointer-events-none opacity-80" : ""}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center z-10">
          <motion.div
            initial={false}
            animate={{ 
              y: isDragActive ? -10 : 0, 
              scale: isDragActive ? 1.1 : 1 
            }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
          >
            <UploadCloud 
              className={`w-16 h-16 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} 
            />
          </motion.div>
          <p className="mb-2 text-xl font-medium text-gray-700">
            {isUploading ? "Transfert en cours..." : "Glissez votre fichier ici"}
          </p>
          <p className="text-sm text-gray-500">
            ou cliquez pour parcourir
          </p>
        </div>

        {/* Blur overlay for smooth transitions if needed */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 bg-white/30 z-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin z-20"></div>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleFileInput}
          disabled={isUploading}
        />
      </label>
    </motion.div>
  );
}
