import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Menus } from "./menuData";

const Navigation = () => {
  const location = useLocation();
  
  // Hide navigation on specified routes
  const isAboutPage = location.pathname === '/' || 
                     location.pathname === '/login' || 
                     location.pathname === '/onboarding';
                     
  if (isAboutPage) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-slate-800 to-slate-700 shadow-lg md:hidden">
      <ul className="flex items-center justify-around px-4 py-3">
        {Menus.map((menu, i) => {
          const isActive = location.pathname === menu.path;
          
          return (
            <li key={i} className="relative">
              <Link
                to={menu.path}
                className={`flex flex-col items-center transition-all duration-300 ease-in-out
                  ${isActive ? "transform -translate-y-2" : ""}`}
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-1
                    ${isActive
                      ? "bg-white shadow-lg transform scale-110"
                      : "bg-slate-600 hover:bg-slate-500"}`}
                >
                  <img
                    src={menu.icon}
                    alt={menu.altText}
                    className={`w-6 h-6 transition-all duration-300
                      ${isActive ? "filter brightness-0" : "filter brightness-200"}`}
                  />
                </div>
                <span className={`text-xs font-medium transition-colors duration-300
                  ${isActive ? "text-white" : "text-slate-300"}`}>
                  {menu.label}
                </span>
                {isActive && (
                  <span className="absolute -bottom-3 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;