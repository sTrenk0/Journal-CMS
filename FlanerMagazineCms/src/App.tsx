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
import Post from "./pages/Post/Post.tsx";
import NotFound from "./pages/NotFound/404.tsx";
import LoginForm from "./components/Login/Login.tsx";
import Dashboard from "./pages/Protected/Dashboard/Dashboard.tsx";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess.tsx";
import PasswordRecovery from "./pages/PasswordRecovery/PasswordRecovery.tsx";

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
          <Route path="allposts" element={<AllPosts />} />
          <Route path="post/:id" element={<Post />} />
          <Route path="404" element={<NotFound />} />
          <Route path="panel/admin/login" element={<LoginForm />} />
          <Route path="panel/admin/" element={<Dashboard />} />
          <Route path="/paymentsuccess" element={<PaymentSuccess />} />
          <Route path="/passwordrecovery" element={<PasswordRecovery />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
