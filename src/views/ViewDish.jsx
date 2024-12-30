import React, { useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Trash2, Clock, Users, ChefHat } from "lucide-react";
import Button from "../components/Button";
import { databases } from "../services/appwriteConfig";

const ViewDish = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const carouselItems = location.state?.array;
  const dish = carouselItems && carouselItems[id];

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleDirection = () => {
    navigate(`/RecipeDirection/${id}`, { state: { dish: dish } });
  };

  const handleDelete = async (collectionId) => {
    try {
      await databases.deleteDocument(
        "64773737337f23de254d",
        collectionId,
        dish.$id
      );
      navigate("/YourLibrary");
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleConfirmDelete = () => handleDelete("6479a9441b13f7a9ad4d");
  const handleConfirmDeleteCreatedRecipe = () => handleDelete("647b9e24d59661e7bfbe");

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-600">No recipe found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="px-4 py-3  flex items-center justify-between">
            <button 
              onClick={handleBackClick}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              onClick={handleConfirmDelete}
              className="p-2 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 className="w-6 h-6 text-red-500" onClick={handleConfirmDeleteCreatedRecipe} />
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-[40vh] md:h-[50vh] bg-gray-100">
          <img
            src={dish.picture}
            alt={dish.food_name || dish.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="px-4 py-6 bg-white min-h-[60vh] pb-32">
          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {dish.food_name || dish.name}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-4 mb-8">
            {/* <Link 
              // to="/MyProfile"
              className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700"
            >
              <ChefHat className="w-4 h-4" />
              <span>{dish.author || dish.username}</span>
            </Link> */}
            <span>{dish.author || dish.username}</span>
            {dish.type && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded-full">
                  {dish.type}
                </span>
              </div>
            )}
            
            {dish.level && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded-full">
                  {dish.level}
                </span>
              </div>
            )}
            
            {dish.servings && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{dish.servings} servings</span>
              </div>
            )}
          </div>

          {/* Description */}
          {dish.description && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed">{dish.description}</p>
            </div>
          )}

          {/* Ingredients */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">Ingredients</h2>
            <ul className="space-y-2">
              {dish.ingredients.map((ingredient, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-2 text-gray-600 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Directions Button */}
          <div className="sticky bottom-4 pt-4">
            <button
              onClick={handleDirection}
              className="w-full bg-orange-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              View Cooking Instructions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDish;