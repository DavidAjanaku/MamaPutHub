import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { databases, account, saveBookmark } from "../services/appwriteConfig";
import emptyBookmarkIcon from "/assets/emptybookmark.png";
import fullBookmarkIcon from "/assets/fullbookmark.png";

const ImageCarouselFrame = ({ title }) => {
  const [bookmarkStatus, setBookmarkStatus] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        setIsLoading(true);
        const response = await databases.listDocuments(
          "64773737337f23de254d",
          "647905d239ca167a89f1",
          []
        );
        setCarouselItems(response.documents);
        setBookmarkStatus(Array(response.documents.length).fill(false));
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarouselItems();
  }, []);

  const handleImageClick = (index) => {
    navigate(`/ViewDish/${index}`, {
      state: { dish: carouselItems[index], array: carouselItems },
    });
  };

  const handleBookMarkClick = async (index, e) => {
    e.stopPropagation();
    try {
      const recipe = carouselItems[index];
      const userId = await account.get();
      
      await saveBookmark({
        userId: userId.$id,
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

  const scroll = (direction) => {
    const container = document.querySelector('.carousel-container');
    const scrollAmount = 280; // Card width + gap
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min((carouselItems.length - 1) * scrollAmount, scrollPosition + scrollAmount);
    
    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  const RecipeCard = ({ item, index }) => (
    <div className="group relative flex-shrink-0 w-64 transition-transform duration-300 hover:scale-105">
      <div className="relative h-64 overflow-hidden rounded-xl bg-white shadow-md">
        <button 
          className="absolute right-3 top-3 z-10 p-2 transition-all duration-200 hover:scale-110"
          onClick={(e) => handleBookMarkClick(index, e)}
          aria-label={bookmarkStatus[index] ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <img
            src={bookmarkStatus[index] ? fullBookmarkIcon : emptyBookmarkIcon}
            className="w-6 h-6 drop-shadow-md"
            alt="bookmark"
          />
        </button>

        <div 
          className="relative h-48 cursor-pointer overflow-hidden"
          onClick={() => handleImageClick(index)}
        >
          <img
            src={item.picture}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            alt={item.name}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="p-3">
          <h3 className="font-medium text-gray-800 truncate">
            {item.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {item.type}
          </p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="h-72 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative">
      <h1 className="text-xl font-semibold mb-6">{title}</h1>

      <div className="relative group">
        <div className="carousel-container overflow-x-hidden">
          <div className="flex gap-4 transition-transform duration-300">
            {carouselItems.slice(0, 5).map((item, index) => (
              <RecipeCard key={index} item={item} index={index} />
            ))}
          </div>
        </div>

        {scrollPosition > 0 && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        )}

        {scrollPosition < (carouselItems.length - 1) * 280 && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 h-10 w-10 rounded-full bg-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5">
          <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <p className="text-sm font-medium text-gray-800">
              Recipe saved to your library!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarouselFrame;