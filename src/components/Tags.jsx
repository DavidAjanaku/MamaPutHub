import React from "react";

export const tags = [
  { name: "Breakfast", selected: false },
  { name: "Brunch", selected: false },
  { name: "Lunch", selected: false },
  { name: "Diary", selected: false },
  { name: "Dinner", selected: false },
  { name: "Snacks", selected: false },
  { name: "Appetizers", selected: false },
  { name: "Salad", selected: false },
  { name: "Soups", selected: false },
  { name: "Pasta and Noodles", selected: false },
  { name: "Dessert", selected: false },
  { name: "All", selected: false },
];

export default function Tags({ activeTag, onTagClick }) {
  const handleTagClick = (tag) => {
    onTagClick(tag);
  };

  return (
    <div className="relative w-full">
      <div className="flex w-full overflow-x-auto pb-4 scrollbar-hide md:justify-center">
        <div className="flex gap-2 px-4 md:px-0">
          {tags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className={`
                relative px-4 py-2 text-sm font-medium rounded-full
                transition-all duration-200 ease-in-out
                hover:scale-105 active:scale-95
                ${
                  activeTag === tag
                    ? "bg-[#B87C4C] text-white shadow-lg hover:bg-[#A66B3B]"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:text-blue-500"
                }
                focus:outline-none focus:ring-2 focus:ring-[#A66B3B] focus:ring-offset-2
              `}
            >
              <span className="whitespace-nowrap">{tag.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Fade indicators for scroll */}
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
    </div>
  );
}