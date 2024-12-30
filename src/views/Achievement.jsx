import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AchievementAvatar from "../components/Achievement/AchievementAvatar";
import AchievementBadges from "../components/Achievement/AchievementBadges";
import BackArrow from "../components/BackClick/BackArrow";

function Achievement({ handleLogin }) {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-pastel-blue min-h-[95vh] overflow-auto no-scrollbar"
    >
      <div className="w-11/12 md:w-5/6 mx-auto py-4">
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="flex items-center"
        >
          <BackArrow onClick={handleBackClick} />
          <h1 className="font-bold text-2xl md:text-3xl text-center flex-1 pr-8">
            Dashboard
          </h1>
        </motion.div>
        <AchievementAvatar />
        <div className="mb-16">
          <AchievementBadges />
        </div>
      </div>
    </motion.div>
  );
}

export default Achievement;
