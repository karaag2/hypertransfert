"use client";

import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeDisplayProps {
  url: string;
  filename: string;
  onReset: () => void;
}

export default function QRCodeDisplay({ url, filename, onReset }: QRCodeDisplayProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1], // Emil Kowalski's recommended ease-out
      }}
      className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-md mx-auto w-full"
    >
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Prêt à télécharger</h2>
        <p className="text-gray-500 text-sm break-all truncate px-4 max-w-full">
          {filename}
        </p>
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: "spring", bounce: 0.2, duration: 0.6 }}
        className="p-4 bg-white rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-50 mb-8"
      >
        <QRCodeSVG 
          value={url} 
          size={220}
          level="H"
          includeMargin={false}
          className="rounded-lg"
        />
      </motion.div>

      <p className="text-sm text-gray-500 mb-6 text-center">
        Scannez ce QR Code avec votre téléphone <br/> pour démarrer le transfert.
      </p>

      <motion.button
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
        onClick={onReset}
        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors duration-200 ease-out w-full"
      >
        Envoyer un autre fichier
      </motion.button>
    </motion.div>
  );
}
