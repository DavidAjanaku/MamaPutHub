import React from "react";
import { Link } from "react-router-dom";
import { ProfileMenu } from "./ProfileMenu";
import rightArrow from "/assets/right arrow.png";

const ProfileOptions = () => {
  return (
    <div className="space-y-2">
      {ProfileMenu.map((pMenu, i) => (
        <Link 
          key={i} 
          to={pMenu.path}
          className="block no-underline"
        >
          <div className="p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={pMenu.icon}
                  alt={`${pMenu.name} icon`}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gray-100 object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <h4 className="text-lg font-semibold text-gray-900">
                  {pMenu.name}
                </h4>
              </div>
              
              <img
                src={rightArrow}
                alt="Navigate to option"
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              />
            </div>
            
            {i !== ProfileMenu.length - 1 && (
              <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-200" />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProfileOptions;