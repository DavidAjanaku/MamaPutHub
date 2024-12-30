import React, { useState } from "react";
import { Badges } from "./AchievementBadgesList";
import { motion } from "framer-motion";

function AchievementBadges() {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
  };

  const handleModalClick = (e) => {
    if (e.target === e.currentTarget) {
      setSelectedBadge(null);
    }
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mb-16"
    >
      <h1 className="font-bold text-2xl text-center mb-6">Achievement Badges</h1>
      <div className="p-8 md:p-12 bg-pastel-blue rounded-xl relative min-h-[40vh]">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {Badges.map((badge, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleBadgeClick(badge)}
            >
              <motion.img 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                src={badge.img} 
                alt={badge.alt} 
                className="w-20 h-20 md:w-24 md:h-24 hover:drop-shadow-lg transition-all"
              />
              <p className="mt-3 text-sm md:text-base font-medium">{badge.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedBadge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50"
          onClick={handleModalClick}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 m-6 max-w-md w-full shadow-2xl"
          >
            <h2 className="font-bold text-2xl mb-4">{selectedBadge.name}</h2>
            <p className="text-gray-700 text-lg">{selectedBadge.description}</p>
            <button 
              onClick={() => setSelectedBadge(null)}
              className="mt-6 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>

);
}

export default AchievementBadges;
