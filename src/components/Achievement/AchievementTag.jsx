import React from "react";
import { Link } from "react-router-dom";
import chefHat from "/assets/chef-hat.png";

const AchievementTag = () => {
  return (
    <Link 
      to="/achievement" 
      className="block group no-underline"
    >
      <div className="p-6 rounded-lg bg-pastel-blue shadow-md hover:bg-pastel-blue/90 transition-colors duration-200 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="text-lg font-semibold text-black">
              Achievements
            </h4>
            <p className="text-sm text-slate-700">
              Review your progress
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <img
              src={chefHat}
              alt="Chef hat"
              className="w-8 h-8 md:w-16 md:h-16 object-contain"
            />
            <img
              src="/assets/right arrow grey.png"
              alt="Right arrow"
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AchievementTag;