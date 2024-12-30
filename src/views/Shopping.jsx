import ShoppingCategory from "../components/Shopping/ShoppingCategory";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

function Shopping() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-bold text-2xl md:text-3xl text-gray-800">
            Shopping Lists
          </h1>
          <Link 
            to="/addshoppingcategory"
            className="transition-transform hover:scale-105"
          >
            <PlusCircle className="w-8 h-8 text-emerald-600 hover:text-emerald-700" />
          </Link>
        </div>
        <div className="mb-16">
          <ShoppingCategory />
        </div>
      </div>
    </div>
  );
}
export default Shopping;
