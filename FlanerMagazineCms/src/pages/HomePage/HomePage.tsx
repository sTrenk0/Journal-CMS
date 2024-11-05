import "./homepage.css";
import { Outlet, Link } from "react-router-dom";
import IMAGES from "../../assets/images";
import { useIsMobile } from "../../helpers/useIsMobile";
import DesktopHeader from "../../components/DesktopHeader";
import MobileHeader from "../../components/MobileHeader";
import { useState, useEffect } from "react";
import axios from "axios";

function HomePage() {
  const isMobile = useIsMobile();

  interface PreviewUrls {
    id: string;
    name: string;
    source_product_url: string;
    preview_urls: string[];
    is_active: boolean;
    description: string;
    price: number;
    created_at: string;
    updated_at: string;
  }

  const [data, setData] = useState<PreviewUrls[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastPostId, setLastPostId] = useState<string | null>(null); // State for last post ID

  useEffect(() => {
    // Fetching data from API using axios
    axios
      .get<PreviewUrls[]>("http://localhost:8000/api/v1/products/")
      .then((response) => {
        setData(response.data); // Store API data in state
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        setError("Failed to fetch data"); // Handle error
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Use another useEffect to set the lastPostId once data is loaded
  useEffect(() => {
    if (data.length > 0) {
      const lastPost = data[data.length - 1]; // Get the last post
      setLastPostId(lastPost.id); // Save the last post ID to state
      console.log(lastPostId); // Log last post ID
    }
  }, [data, lastPostId]); // Depend on data, so it only runs when data changes

  if (loading) {
    console.log("loading");
    return <div>Loading...</div>; // Loading indicator
  }

  if (error) {
    console.log(error);
    return <div>{error}</div>; // Error message
  }

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
              <Link to={"/post/" + lastPostId}>
                <p className="BrButton">Новий випуск</p>
              </Link>
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
