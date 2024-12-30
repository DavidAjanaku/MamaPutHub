import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { databases, account } from "../../services/appwriteConfig.js";

function ShoppingCategory() {
  const [createdShoppings, setCreatedShoppings] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShoppingCategories = async () => {
      try {
        const response = await account.get();
        const userId = response.$id;
        setUserId(userId);
        filterShoppingCategoriesByUserId(userId);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchShoppingCategories();
  }, []);

  const filterShoppingCategoriesByUserId = async (userId) => {
    try {
      const response = await databases.listDocuments(
        "64773737337f23de254d",
        "647905e0a9f44dd4d1a4",
        []
      );
      const filteredCategories = response.documents.filter(
        (category) => category.userId === userId
      );
      setCreatedShoppings(filteredCategories);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {createdShoppings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 italic text-lg">
            Create your first shopping list to get started
          </p>
        </div>
      ) : (
        createdShoppings.map((category) => (
          <div
            key={category.$id}
            className={`bg-white shadow-md rounded-xl overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            <div className="flex items-center p-4">
              <div className="flex-shrink-0">
                <img
                  src={category.picture}
                  alt={category.category_name}
                  className="w-16 h-16 md:w-20 md:h-20 rounded-lg object-cover shadow-sm"
                />
              </div>
              
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold text-lg md:text-xl text-gray-800 mb-1">
                  {category.category_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.ingredients.length} {category.ingredients.length === 1 ? 'ingredient' : 'ingredients'}
                </p>
              </div>

              <Link 
                to={`/SavedRecipe/${category.$id}`}
                className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors duration-200"
              >
                <ChevronRight className="w-6 h-6 text-gray-400" />
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ShoppingCategory;