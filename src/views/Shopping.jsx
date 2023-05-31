import ShoppingCategory from "../components/Shopping/ShoppingCategory";
import { Link } from "react-router-dom";

function Shopping() {
  return (
    <div className="overflow-scroll no-scrollbar h-[93vh]">
      <h1 className="font-semibold text-xl md:text-2xl text-center p-4">
        Shopping List
      </h1>
      <Link to="/addshoppingcategory">
        <img src="/public/assets/plus.png" alt="" className="w-8 h-8 mx-auto" />
      </Link>
      <ShoppingCategory />
    </div>
  );
}

export default Shopping;
