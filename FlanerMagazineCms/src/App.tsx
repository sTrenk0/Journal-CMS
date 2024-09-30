//@info libraries import
import { BrowserRouter, Routes, Route } from "react-router-dom";
//@info componet import
import "./App.css";
import FrontPage from "./pages/FrontPage/FrontPage";
import HomePage from "./pages/HomePage/HomePage";
import AboutUs from "./pages/AboutUs/AboutUs";
import Merch from "./pages/Merch/Merch";
import Contribute from "./pages/Contribute/Contribute";
import Contact from "./pages/Contact/Contact";
import AllPosts from "./pages/AllPosts/AllPosts.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="homepage" element={<FrontPage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="merchandise" element={<Merch />} />
          <Route path="contribute" element={<Contribute />} />
          <Route path="contact" element={<Contact />} />
          <Route path="allposts" element={<AllPosts/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
