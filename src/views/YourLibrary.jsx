import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { databases, account, saveBookmark } from "../services/appwriteConfig";
import { BookmarkIcon, Plus, Loader2 } from "lucide-react";
import Header from "../components/Header";

const RecipeCard = ({ recipe, onClick, showBookmark = true }) => (
  <div className="w-full sm:w-64 h-auto sm:h-80 rounded-lg shadow-md bg-white transition-all hover:shadow-lg flex flex-col">
    <div className="relative h-48">
      {showBookmark && (
        <button className="absolute right-2 top-2 p-2 bg-white/80 rounded-full hover:bg-white">
          <BookmarkIcon className="w-5 h-5 text-orange-600" />
        </button>
      )}
      <img
        src={recipe.picture}
        className="h-full w-full object-cover rounded-t-lg cursor-pointer"
        alt={recipe.name || recipe.food_name}
        onClick={onClick}
      />
    </div>
    <div className="p-4 flex-1">
      <h5 className="font-semibold text-base mb-2 line-clamp-2">
        {recipe.name || recipe.food_name}
      </h5>
      <div className="flex flex-wrap gap-2">
        {recipe.level && (
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {recipe.level}
          </span>
        )}
        {recipe.rating && (
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {recipe.rating}★
          </span>
        )}
        {recipe.type && (
          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
            {recipe.type}
          </span>
        )}
      </div>
    </div>
  </div>
);

const LoadingCard = () => (
  <div className="w-full sm:w-64 h-80 rounded-lg shadow-md bg-white flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
  </div>
);

const RecipeSection = ({
  title,
  items,
  onItemClick,
  emptyMessage,
  children,
  isLoading
}) => (
  <div className="mb-8">
    <div className="mb-4">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </div>
    {isLoading ? (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {children}
          {[1, 2, 3].map((i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    ) : items?.length === 0 && emptyMessage ? (
      <p className="text-orange-600 italic p-4">{emptyMessage}</p>
    ) : (
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {children}
          {items?.map((item, index) => (
            <RecipeCard
              key={item.$id || index}
              recipe={item}
              onClick={() => onItemClick(item, index)}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

const CreateRecipeCard = () => (
  <Link to="/NewRecipe" className="block h-full">
    <div className="w-full sm:w-64 h-full min-h-[320px] sm:h-80 flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-all cursor-pointer border-2 border-dashed border-gray-300 rounded-lg">
      <div className="text-center p-4">
        <div className="rounded-full bg-white p-4 mb-4 mx-auto inline-block">
          <Plus className="w-8 h-8 text-orange-600" />
        </div>
        <h5 className="font-semibold text-gray-700">Create New Recipe</h5>
      </div>
    </div>
  </Link>
);

export default function YourLibrary() {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [createdRecipes, setCreatedRecipes] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [isLoadingCreated, setIsLoadingCreated] = useState(true);
  const navigate = useNavigate();

  const fetchRecipes = async (collectionId, userId, setter, setLoading) => {
    try {
      const response = await databases.listDocuments(
        "64773737337f23de254d",
        collectionId,
        []
      );
      const filteredRecipes = response.documents.filter(
        (recipe) => recipe.userId === userId
      );
      setter(filteredRecipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await account.get();
        setUserId(user.$id);
        fetchRecipes("6479a9441b13f7a9ad4d", user.$id, setSavedRecipes, setIsLoadingSaved);
        fetchRecipes("647b9e24d59661e7bfbe", user.$id, setCreatedRecipes, setIsLoadingCreated);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoadingSaved(false);
        setIsLoadingCreated(false);
      }
    };
    fetchUserData();
  }, []);

  const handleImageClick = (item, index, recipeArray) => {
    navigate(`/ViewDish/${index}`, {
      state: {
        selectedImage: item,
        array: recipeArray,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Header />
        
        <RecipeSection
          title="Saved Recipes"
          items={savedRecipes}
          onItemClick={(item, index) => handleImageClick(item, index, savedRecipes)}
          emptyMessage="You haven't saved any recipes yet."
          isLoading={isLoadingSaved}
        />

        <RecipeSection
          title="My Recipes"
          items={createdRecipes}
          onItemClick={(item, index) => handleImageClick(item, index, createdRecipes)}
          emptyMessage="You haven't created any recipes yet."
          isLoading={isLoadingCreated}
        >
          <CreateRecipeCard />
        </RecipeSection>
      </div>
    </div>
  );
}