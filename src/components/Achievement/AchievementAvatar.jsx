import { React } from "react";
import { motion } from "framer-motion";

function AchievementAvatar() {
  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="my-6 md:my-8"
    >
      <div className="p-6 md:p-8 rounded-xl shadow-lg border bg-background-color relative hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div className="flex-1 min-w-[200px]">
            <h4 className="text-lg md:text-xl font-semibold text-black mb-2">
              Overall progress
            </h4>
            <p className="text-sm md:text-base text-gray-700 dark:text-black">
              This represents your cumulative progress thus far.
            </p>
          </div>
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            src="/assets/25percent.png"
            alt="userimage"
            className="w-28 md:w-32 h-28 md:h-32 object-contain"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default AchievementAvatar;
