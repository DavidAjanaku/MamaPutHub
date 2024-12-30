import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { account, databases, storage } from "../services/appwriteConfig.js";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, Upload, Plus, X, Save } from "lucide-react";

const AddShoppingCategory = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [ingredientList, setIngredientList] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBackClick = () => {
    navigate("/Shopping");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCategory = async (event) => {
    try {
      setIsSubmitting(true);
      const fileInput = document.getElementById('imageUpload');
      const file = fileInput.files[0];
      const fileId = uuidv4();

      const newImage = await storage.createFile("647e6735532e8f214235", fileId, file);
      const imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/647e6735532e8f214235/files/${fileId}/view?project=64676cf547e8830694b8&mode=admin`;

      const newCategory = {
        userId: (await account.get()).$id,
        category_name: categoryName,
        picture: imageUrl,
        color: selectedColor,
        ingredients: ingredientList.filter(ingredient => ingredient.trim() !== ""),
      };

      const documentId = uuidv4();
      await databases.createDocument(
        "64773737337f23de254d",
        "647905e0a9f44dd4d1a4",
        documentId,
        newCategory,
      );

      navigate("/shopping");
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 flex items-center">
          <button 
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800 ml-4">
            Add Shopping Category
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Enter category name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image
            </label>
            <div className="relative">
              <input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload image</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="colorSelect" className="block text-sm font-medium text-gray-700 mb-2">
              Color Theme
            </label>
            <select
              id="colorSelect"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            >
              <option value="">Select a color</option>
              <option value="pastel-blue">Pastel Blue</option>
              <option value="laurel-green">Laurel Green</option>
              <option value="copper-orange">Copper Orange</option>
              <option value="pastel-pink">Pastel Pink</option>
              <option value="lemon-meringue">Lemon Meringue</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ingredients
            </label>
            <div className="space-y-3">
              {ingredientList.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => {
                      const updatedList = [...ingredientList];
                      updatedList[index] = e.target.value;
                      setIngredientList(updatedList);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="Enter ingredient"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updatedList = ingredientList.filter((_, i) => i !== index);
                      setIngredientList(updatedList);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setIngredientList([...ingredientList, ""])}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Ingredient
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveCategory}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddShoppingCategory;