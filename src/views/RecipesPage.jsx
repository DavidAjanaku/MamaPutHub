import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { databases, account } from "../services/appwriteConfig";
import { saveBookmark } from "../services/appwriteConfig";
import emptyBookmarkIcon from "/assets/emptybookmark.png";
import fullBookmarkIcon from "/assets/fullbookmark.png";
import Header from "../components/Header";
import Tags from "../components/Tags";

const RecipeSkeleton = () => {
  return (
    <div className="w-64 h-[22rem] p-4">
      <div className="relative">
        <div className="absolute right-5 top-2 z-10 bg-gray-200 rounded-full p-1 w-7 h-7 animate-pulse" />
        <div className="w-full h-64 bg-gray-200 rounded-md animate-pulse" />
        <div className="mt-4 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default function RecipesPage({ title }) {
  const [bookmarkStatus, setBookmarkStatus] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recipes, setRecipes] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTag, setActiveTag] = useState(null);
  const [originalRecipes, setOriginalRecipes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = account.get();
  const navigate = useNavigate();
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await databases.listDocuments(
          "64773737337f23de254d",
          "647b9e24d59661e7bfbe",
          []
        );
        const updatedRecipes = response.documents.map((recipe) => ({
          ...recipe,
          tags: getTagsForRecipe(recipe),
        }));
        setRecipes(updatedRecipes);
        setOriginalRecipes(updatedRecipes);
        setBookmarkStatus(Array(updatedRecipes.length).fill(false));
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleTagClick = (tag) => {
    setCurrentPage(1);
    setActiveTag(tag);
    const filteredRecipes = tag.name === "All" 
      ? originalRecipes 
      : originalRecipes.filter(recipe => recipe.tags.includes(tag.name));
    setRecipes(filteredRecipes);
  };

  const handleBookMarkClick = async (index) => {
    try {
      const recipe = recipes[index];
      const recipeDocument = await databases.getDocument(
        "64773737337f23de254d",
        "647b9e24d59661e7bfbe",
        recipe.$id
      );

      await saveBookmark({
        userId: (await userId).$id,
        level: recipe.level,
        type: recipe.type,
        description: recipe.description,
        food_name: recipe.name,
        time: recipe.time?.toString().slice(0, 17) ?? "",
        servings: recipe.servings,
        author: recipe.author,
        username: recipeDocument.username,
        steps: recipe.steps,
        rating: recipe.rating?.toString().slice(0, 11) ?? "",
        ingredients: recipe.ingredients,
        picture: recipe.picture,
      });

      setBookmarkStatus(prev => {
        const newStatus = [...prev];
        newStatus[index] = !newStatus[index];
        return newStatus;
      });
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const handleImageClick = (recipe, index) => {
    navigate(`/ViewDish/${index}`, {
      state: {
        selectedImage: recipe,
        array: isSearching ? searchResults : recipes,
      },
    });
  };

  const getTagsForRecipe = (recipe) => {
    const mealTypes = [
      "Breakfast", "Brunch", "Lunch", "Dinner", "Diary", "Snacks",
      "Appetizers", "Salad", "Soups", "Pasta and Noodles", "Dessert"
    ];
    return [...mealTypes.filter(type => recipe.type?.includes(type)), "All"];
  };
  const RecipeCard = ({ recipe, index }) => (
    <div className="md:w-64 w-full h-[22rem] p-4">
      <div className="relative">
        <button
          className="absolute right-5 top-2 z-10 bg-white rounded-full p-1"
          onClick={() => handleBookMarkClick(index)}
        >
          <img
            src={bookmarkStatus[index] ? fullBookmarkIcon : emptyBookmarkIcon}
            className="w-5 h-5"
            alt="bookmark"
          />
        </button>
        <img
          src={recipe.picture}
          className="w-full h-64 object-cover rounded-md cursor-pointer"
          alt={recipe.name}
          onClick={() => handleImageClick(recipe, index)}
        />
        <div className="mt-4">
          <h5 className="text-lg font-semibold truncate">{recipe.name}</h5>
          <p className="text-sm flex items-center">
            Rating: {recipe.rating ?? "N/A"}
          </p>
          <p className="text-sm">{recipe.type}</p>
          <p className="text-sm">
            {recipe.time ? recipe.time.toString().slice(0, 17) : ""}
          </p>
          <p className="text-sm">Servings: {recipe.servings}</p>
        </div>
      </div>
    </div>
  );

  const paginatedRecipes = recipes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-[90%] mx-auto h-[100vh] pb-32 overflow-scroll no-scrollbar">
      <Header onSearchResultsChange={setSearchResults} />
      <Tags activeTag={activeTag} onTagClick={handleTagClick} />

      <h1 className="text-4xl text-center font-extrabold mb-8">
        {title || "Recipe Page"}
      </h1>

      {showSuccessModal && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
          Recipe bookmarked successfully!
        </div>
      )}

      {searchResults.length > 0 && (
        <div>
          <div className="text-center font-medium text-lg text-[#B87C4C] mb-4">
            ({searchResults.length}) Recipes found
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {searchResults.map((recipe, index) => (
              <RecipeCard key={recipe.$id} recipe={recipe} index={index} />
            ))}
          </div>
          <div className="text-center font-medium text-lg mt-8">
            <h2>Explore More</h2>
          </div>
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-4">
        {isLoading ? (
          // Show skeleton loaders while loading
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <RecipeSkeleton key={index} />
          ))
        ) : (
          paginatedRecipes.map((recipe, index) => (
            <RecipeCard key={recipe.$id} recipe={recipe} index={index} />
          ))
        )}
      </div>

      <div className="flex justify-center gap-4 mt-8 mb-8">
        <button
          className={`px-4 py-2 rounded bg-[#B87C4C] text-white ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-[#A66B3B]"
          }`}
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => p - 1)}
        >
          Previous
        </button>
        <button
          className={`px-4 py-2 rounded bg-[#B87C4C] text-white ${
            currentPage === Math.ceil(recipes.length / itemsPerPage)
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#A66B3B]"
          }`}
          disabled={currentPage === Math.ceil(recipes.length / itemsPerPage)}
          onClick={() => setCurrentPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}