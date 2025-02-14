import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

const API_DOMAIN = process.env.NEXT_PUBLIC_API_DOMAIN;

const StoreBanner = ({ banner, onBack, isOwner }) => (
  <div className="relative">
    <img
      src={banner ? `${API_DOMAIN}${banner}` : "/images/mumullogo.jpg"}
      alt="Store"
      className="w-full h-48 object-cover"
    />
    {isOwner && (
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="absolute top-4 left-4 bg-indigo-500 rounded-full p-1 text-white shadow-lg flex items-center justify-center w-7 h-7"
        onClick={onBack}
      >
        <ChevronLeft />
      </motion.button>
    )}
  </div>
);

export default StoreBanner;
