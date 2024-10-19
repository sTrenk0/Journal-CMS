import { Link } from "react-router-dom";
import IMAGES from "../assets/images";

function MobileHeader() {
  return (
    <nav className="bg-transparent px-9 py-4 w-full z-10 mt-5">
      <div className="container mx-auto flex justify-center border-b-2 text-black border-black items-center">
        {/* Menu Links (Stay in one line) */}
        <ul className="flex space-x-6 items-center text-gray-800 mb-3 text-base font-bold">
          <li>
            <Link to="/allposts" className="hover:text-gray-600">
              <img src={IMAGES.lightgrey} alt="grey" className="mr-1 w-3 h-3" />
              Читати
            </Link>
          </li>
          <li>
            <Link to="/contribute" className="hover:text-gray-600">
              <img src={IMAGES.yellow} alt="grey" className="mr-1 w-3 h-3" />
              Долучитися
            </Link>
          </li>
          <li>
            <Link to="/merchandise" className="hover:text-gray-600">
              <img src={IMAGES.red} alt="grey" className="mr-1 w-3 h-3" />
              Мерч
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-600">
              <img src={IMAGES.grey} alt="grey" className="mr-1 w-3 h-3" />
              Контакти
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default MobileHeader;
