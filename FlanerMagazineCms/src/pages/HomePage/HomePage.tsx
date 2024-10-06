import "./homepage.css";
import { Outlet, Link } from "react-router-dom";
import IMAGES from "../../assets/images";
import { useIsMobile } from "../../helpers/useIsMobile";
import DesktopHeader from "../../components/DesktopHeader";
import MobileHeader from "../../components/MobileHeader";

function HomePage() {
  const isMobile = useIsMobile();

  return (
    <>
      <div>
        {isMobile ? <MobileHeader /> : <DesktopHeader />}

        {/* header adapt */}

        <div className="logo flex justify-center mt-28">
          <img src={IMAGES.logo_big} alt="logo" className="GemLogo" />
        </div>
        <div>
          <div className="text-center font-normal text-3xl mt-20">
            <p>
              Часопис про Київ: про любов, людей, тварин, будинки, <br />
              машини, цеглу, асфальт, скло, траву, дерева, зміни, розвиток,{" "}
              <br /> мрії та багато іншого. А ще ми творимо свідому спільноту.
            </p>
          </div>
        </div>
        <div>
          <div className="flex justify-center mt-16">
            <div className="mt-7 bg-black p-5 px-20 rounded-[84px] ">
              <Link to="/post">
                <p className="BrButton">Новий випуск</p>{" "}
              </Link>
              ={" "}
            </div>
          </div>
        </div>
        <div className="OpenLogoContainer">
          <Link to="homepage">
            <img src={IMAGES.flaner} alt="flaner" className="OpenLogo" />
          </Link>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default HomePage;
