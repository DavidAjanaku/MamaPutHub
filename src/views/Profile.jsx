import React, {useState, useEffect} from "react";
import Header from "../components/Header";
import ProfileTag from "../components/Profile/ProfileTag";
import AchievementTag from "../components/Achievement/AchievementTag";
import ProfileOptions from "../components/Profile/ProfileOptions";
import { account, databases } from "../services/appwriteConfig";
import { Link, useNavigate } from "react-router-dom";


function Profile() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

 // Run the effect only once on component mount

  return (
    <div className="bg-background-color h-[95vh] w-5\6 md:h-[100vh] m-auto">
      
      <div className="w-10/12 mx-auto pb-20">
       <ProfileTag/>
        <AchievementTag />
        <ProfileOptions />
        <div 
          className="mt-8 flex items-center justify-center cursor-pointer bg-slate-700 hover:bg-slate-600 text-white rounded-lg p-4 transition-colors duration-300"
          onClick={handleLogout}
        >
          <img src="/assets/back-arrow.png" alt="Logout" className="w-4 h-4 mr-2" />
          <span className="text-base font-medium">Logout</span>
        </div>
      </div>
      
    </div>
  );
}

export default Profile;
