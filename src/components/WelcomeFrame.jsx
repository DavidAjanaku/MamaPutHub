import React from "react";
import homeBackground from "/assets/homeBackground.svg";
import { Link } from "react-router-dom";

const WelcomeFrame = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-orange-50 p-6 sm:p-8 md:p-12 my-6 shadow-sm">
      <div className="flex flex-col-reverse gap-8 md:flex-row md:items-center md:justify-between">
        <div className="relative z-10 flex-1">
          <img
            src={homeBackground}
            alt="Decorative cooking illustration"
            className="w-full md:max-w-[90%] animate-fadeIn duration-700 hover:scale-105 transition-transform"
          />
        </div>

        <div className="flex-1 space-y-4 animate-fadeIn duration-1000 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
            Welcome to{" "}
            <span className="text-orange-600">Mamaput Hub!</span>
          </h1>
          
          <p className="text-lg sm:text-xl italic text-orange-600 font-medium">
            The ultimate destination for food lovers of all kinds.
          </p>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-lg mx-auto md:mx-0">
            Discover, share, and collaborate on delicious recipes with fellow food
            enthusiasts, and let your taste buds embark on a flavorful journey.
          </p>

          <div className="pt-4 flex justify-center md:justify-start gap-4">
            <Link
                          to="/RecipesPage" 
>
            <button className="px-6 py-3 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-700 transition-colors">
              Explore Recipes
            </button>
            </Link>
           <Link to="/YourLibrary">
           <button className="px-6 py-3 border-2 border-orange-600 text-orange-600 rounded-full font-medium hover:bg-orange-50 transition-colors">
              Share Recipe
            </button>
           </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-200 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-orange-300 rounded-full opacity-20 blur-3xl" />
    </div>
  );
};

export default WelcomeFrame;