import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation/Navigation";
import SignUp from "./views/SignUp";
import Login from "./views/Login";
import Scanner from "./views/Scanner";
import Settings from "./views/Settings";
import Messaging from "./views/Messaging";
import Homepage from "./views/Homepage";
import Onboarding from "./views/Onboarding";
import Profile from "./views/Profile";
import Shopping from "./views/Shopping";
import YourLibrary from "./views/YourLibrary";
import SideBarNavigation from "./components/Navigation/SideBarNavigation";
import Achievement from "./views/Achievement";
import NewRecipe from "./views/NewRecipe";
import ViewDish from "./views/ViewDish";
import RecipeDirection from "./views/RecipeDirection";
import MyProfile from "./views/MyProfile";
import SavedRecipe from "./views/SavedRecipe";
import AllDone from "./views/AllDone";
import Logout from "./views/Logout";
import RecipesPage from "./views/RecipesPage";
import AddShoppingCategory from "./views/AddShoppingCategory";
import LoadingIndicator from "./components/LoadingIndicator";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/utils/ProtectedRoute";

const closeModal = () => {
  // Implementation for closing the modal
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsDataLoaded(true);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleLogin = () => {
    setIsVisible(false);
    localStorage.setItem("isLoggedIn", "true");
  };

  const handleLogout = () => {
    setIsVisible(false);
    localStorage.setItem("isLoggedIn", "false");
  };

  return (
    <Router>
      {isLoading || !isDataLoaded ? (
        <LoadingIndicator />
      ) : (
        <>
          <Routes>
            <Route path="/" element={<SignUp handleLogin={handleLogin} />} />
            <Route
              path="/login"
              element={<Login handleLogin={handleLogin} />}
            />
            <Route element={<ProtectedRoute />}>
              <Route path="/Onboarding" element={<Onboarding />} />
              <Route path="/Home" element={<Homepage />} />
              <Route path="/Profile" element={<Profile />} />
              <Route path="/Scanner" element={<Scanner />} />
              <Route path="/Shopping" element={<Shopping />} />
              <Route path="/Settings" element={<Settings />} />
              <Route path="/Messaging" element={<Messaging />} />
              <Route path="/YourLibrary" element={<YourLibrary />} />
              <Route path="/MyProfile" element={<MyProfile />} />
              <Route
                path="/Achievement"
                element={<Achievement closeModal={closeModal} />}
              />
              <Route path="/NewRecipe" element={<NewRecipe />} />
           
              <Route path="/ViewDish/:id" element={<ViewDish />} />
              <Route
                path="/RecipeDirection/:id"
                element={<RecipeDirection />}
              />
           
              <Route
                path="/SavedRecipe/:category"
                element={<SavedRecipe closeModal={closeModal} />}
              />
              <Route path="/AllDone" element={<AllDone />} />
              <Route
                path="/AddShoppingCategory"
                element={<AddShoppingCategory />}
              />
              <Route path="/RecipesPage" element={<RecipesPage />} />
              <Route
                path="/Logout"
                element={<Logout handleLogout={handleLogout} />}
              />
            </Route>
          </Routes>
          {localStorage.getItem("isLoggedIn") === "true" && (
            <>
              <Navigation />
              <SideBarNavigation setIsVisible={setIsVisible} />
            </>
          )}
        </>
      )}
    </Router>
  );
}

export default App;
