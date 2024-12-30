import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { databases, account } from "../services/appwriteConfig";
import BackArrow from "../components/BackClick/BackArrow";

function SavedRecipe() {
  const navigate = useNavigate();
  const { category } = useParams();
  const [checkedIngredients, setCheckedIngredients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      try {
        setIsLoading(true);
        const response = await databases.getDocument(
          "64773737337f23de254d",
          "647905e0a9f44dd4d1a4",
          category
        );
        setCategoryInfo(response);
      } catch (error) {
        setError("Failed to load category information");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryInfo();
  }, [category]);

  const handleDeleteClick = () => setShowModal(true);

  const handleConfirmDelete = async () => {
    try {
      await databases.deleteDocument(
        "64773737337f23de254d",
        "647905e0a9f44dd4d1a4",
        category
      );
      navigate("/Shopping");
    } catch (error) {
      setError("Failed to delete category");
      console.error(error);
    }
  };

  const handleCheckboxChange = (index) => {
    setCheckedIngredients(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg text-red-600">
        {error}
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Category not found
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <BackArrow onClick={() => navigate("/Shopping")} />
        <button 
          onClick={handleDeleteClick}
          className="p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <img src="/assets/delete.png" alt="Delete" className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Image */}
        <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
          <img
            src={categoryInfo.picture}
            alt={categoryInfo.category_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Category Info */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {categoryInfo.category_name}
          </h1>
          <p className="text-sm text-gray-500">
            {checkedIngredients.length}/{categoryInfo.ingredients.length} ingredients collected
          </p>
        </div>

        {/* Ingredients List */}
        <div className="bg-white rounded-xl shadow-sm p-6  pb-20">
          <h2 className="font-semibold text-gray-800 mb-4">Ingredients</h2>
          <div className="space-y-2">
            {categoryInfo.ingredients.map((ingredient, index) => (
              <div
                key={index}
                className={`flex items-center p-3 rounded-lg transition-all duration-200
                  ${checkedIngredients.includes(index) ? 'bg-gray-50' : ''}`}
              >
                <label className="flex items-center w-full cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedIngredients.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                    className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500 transition-all duration-200"
                  />
                  <span className={`ml-3 ${checkedIngredients.includes(index) 
                    ? 'text-gray-400 line-through' 
                    : 'text-gray-700'}`}>
                    {ingredient}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Delete Category</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedRecipe;