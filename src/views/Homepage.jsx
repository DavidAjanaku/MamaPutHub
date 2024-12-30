import React, { useState, useEffect } from "react";
import { shuffle } from "lodash";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import ImageCarouselFrame from "../components/ImageCarouselFrame";
import WelcomeFrame from "../components/WelcomeFrame";
import { account, databases, saveBookmark } from "../services/appwriteConfig";
import emptyBookmarkIcon from "/assets/emptybookmark.png";
import fullBookmarkIcon from "/assets/fullbookmark.png";

const Homepage = () => {
  const [carouselItems, setCarouselItems] = useState([]);
  const [bookmarkStatus, setBookmarkStatus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const navigate = useNavigate();
  const userId = account.get();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await databases.listDocuments(
          "64773737337f23de254d",
          "647b9e24d59661e7bfbe",
          []
        );
        const randomizedItems = shuffle(response.documents);
        setCarouselItems(randomizedItems);
        setBookmarkStatus(Array(response.documents.length).fill(false));
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleScroll = (e) => {
    const container = e.target;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  const scroll = (direction) => {
    const container = document.querySelector('.recipe-carousel');
    if (container) {
      const scrollAmount = direction === 'left' ? -container.offsetWidth : container.offsetWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleImageClick = (index) => {
    navigate(`/ViewDish/${index}`, {
      state: { dish: carouselItems[index], array: carouselItems },
    });
  };

  const handleBookMarkClick = async (index, e) => {
    e.stopPropagation();
    try {
      const recipe = carouselItems[index];
      const currentUserId = (await userId).$id;

      await saveBookmark({
        userId: currentUserId,
        level: recipe.level,
        type: recipe.type,
        name: recipe.name,
        servings: recipe.servings,
        username: recipe.username,
        steps: recipe.steps,
        description: recipe.description,
        ingredients: recipe.ingredients,
        picture: recipe.picture,
      });

      setBookmarkStatus(prev => {
        const updated = [...prev];
        updated[index] = !updated[index];
        return updated;
      });

      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error("Error saving recipe:", error);
    }
  };

  const RecipeCard = ({ item, index }) => (
  <div className="group relative w-80 h-96 transition-transform duration-300 hover:scale-105">
      <button 
        className="absolute right-4 sm:right-6 top-4 sm:top-6 z-10 p-2 transition-all duration-200 hover:scale-110 bg-white/80 rounded-full backdrop-blur-sm"
        onClick={(e) => handleBookMarkClick(index, e)}
        aria-label={bookmarkStatus[index] ? "Remove from bookmarks" : "Add to bookmarks"}
      >
        <img
          src={bookmarkStatus[index] ? fullBookmarkIcon : emptyBookmarkIcon}
          className="w-4 sm:w-5 h-4 sm:h-5"
          alt="bookmark"
        />
      </button>
      
      <div 
        className="relative h-64 w-64 cursor-pointer overflow-hidden rounded-xl shadow-md bg-white"
        onClick={() => handleImageClick(index)}
      >
        <div className="relative h-36 sm:h-40">
          <img
            src={item.picture}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={item.name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        <div className="p-3 sm:p-4">
          <h5 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
            {item.name}
          </h5>
          <div className="flex items-center justify-between mt-1 sm:mt-2">
            <span className="text-xs sm:text-sm px-2 py-1 bg-gray-100 rounded-full text-gray-600">
              {item.type}
            </span>
            {item.rating && (
              <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                ⭐️ {item.rating}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <WelcomeFrame />
        
        <div className="mb-8 sm:mb-12">
          <ImageCarouselFrame title="What do you want to eat today?" />
        </div>

        <section className="mb-16 sm:mb-24">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Featured Recipes
            </h2>
            <Link 
              to="/RecipesPage" 
              className="text-sm sm:text-base text-blue-500 hover:text-blue-600 transition-colors"
            >
              View All →
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-48 sm:h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="relative group">
              <div 
                className="recipe-carousel flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide -mx-4 px-4"
                onScroll={handleScroll}
              >
                {carouselItems.slice(0, 5).map((item, index) => (
                  <RecipeCard key={index} item={item} index={index} />
                ))}
              </div>

              <div className="hidden sm:block">
                {canScrollLeft && (
                  <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-600" />
                  </button>
                )}

                {canScrollRight && (
                  <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {showModal && (
          <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 animate-in slide-in-from-bottom-5">
            <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <p className="text-sm sm:text-base font-medium text-gray-800">
                Recipe saved to your library!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;