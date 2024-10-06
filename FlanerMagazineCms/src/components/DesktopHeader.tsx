import { Link } from "react-router-dom";

function DesktopHeader() {
  return (
    <div className="MainPage font-palatino">
      <div className="header-container flex justify-center  ">
        <div className={`header`}>
          <div
            className="HeaderElement px-20 p-5"
            style={{ backgroundColor: "#4A8D5C" }}
          >
            <Link to="/about">Про нас</Link>
          </div>
          <div
            className="HeaderElement px-20 p-5"
            style={{ backgroundColor: "#8AA3B6" }}
          >
            <Link to="/allposts">Читати</Link>
          </div>
          <div
            className="HeaderElement px-20 p-5"
            style={{ backgroundColor: "#8E3A21" }}
          >
            <Link to="/merchandise">Мерч</Link>
          </div>
          <div
            className="HeaderElement px-20 p-5"
            style={{ backgroundColor: "#CAA150" }}
          >
            <Link to="/contribute">Як долучитися</Link>
          </div>
          <div
            className="HeaderElement px-20 p-5"
            style={{ backgroundColor: "#8E8E8E" }}
          >
            <Link to="/contact">Контакти</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesktopHeader;
