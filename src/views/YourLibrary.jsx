import React,{useState} from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ImageCarouselFrame from "../components/ImageCarouselFrame";
// import CarouselImageGallery from "../components/CarouselImageGallery";
import fullBookmarkIcon from "/public/assets/fullbookmark.png";

import { motion } from "framer-motion";
import starRating from "/assets/preference.png";
import CarouselISavedRecipe from "../components/CarouselImageGallery";

export default function YourLibrary() {
  const firstItem = CarouselISavedRecipe.CarouselISavedRecipe[0]; // Get the first item from the array

  const clickedItems = [];

  const [selectedItem, setSelelctedItem] = useState(null);
 
  const navigate = useNavigate();

  const handleImageClick = (item) => {
    setSelelctedItem(item);
    clickedItems.push(item);
    
    navigate("/ViewDish", { state: { selectedImage: item, array: CarouselISavedRecipe.CarouselISavedRecipe } });
    };
  return (
    <div className="overflow-scroll h-[90vh]">
      <div className="m-4 w-5/6  mx-auto  md:h-100vh ">
        <Header />
        <h1 className="text-xl">Saved Recipes</h1>
        <ImageCarouselFrame />
        <h1 className="text-xl">My Recipes</h1>

        <motion.div className="carousel overflow-scroll no-scrollbar m-auto h-80">
          <motion.div className="inner-carousel flex justify-start  ">

            {CarouselISavedRecipe.CarouselISavedRecipe.map((item, index) => (
              <motion.div className="item w-64 h-64" key={index}>
                {index === 0 ? ( // Render the link only for the first item
                          <Link to="/NewRecipe">

                    <div className="w-64 h-64 object-center p-4 pl-4 relative cursor-pointer top-0 ">
                      <div className="h-full bg-slate-400">
                        <img
                          src={item.imageURL}
                          className="rounded-md  w-10 h-10 flex items-center mx-auto absolute top-[40%] left-[40%] "
                          alt=""
                        />
                      </div>
                      <div className=" mt-2 ">
                        <h5 className="text-[14px]">{item.name}</h5>
                      </div>
                  
                    </div>
                    </Link>
                ) : (
             
                    <div>
                      {/* Render other items without the link */}
                      <div className="w-64 h-64 object-center p-4 pl-4 relative cursor-pointer top-0 ">
                        <button className="absolute right-5 ">
                          <img
                            src={fullBookmarkIcon}
                            className="w-5 my-2"
                            alt="bookmark"
                          />
                        </button>
                        <img
                          src={item.imageURL}
                          className="rounded-md h-full w-full  "
                          alt=""
                          onClick={() => {
                            handleImageClick(item);
                          }}
                        />
     <Link to="/ViewDish">
                        <div className=" mt-2 ">
                          <h5 className="text-[14px]">{item.name}</h5>
                          <p className="flex items-center text-[14px]">
                            <img
                              src={starRating}
                              className="w-4 f"
                              alt="rating"
                            />
                            : {item.rating}
                          </p>
                        </div>
                        </Link>
                      </div>
                    </div>
              
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
