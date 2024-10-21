import {
  NotepadText,
  StickyNote,
  LifeBuoy,
  CircleUser,
  Users,
  Link as IconLink,
  CreditCard,
  KeyRound,
} from "lucide-react";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react"; // Import useState
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Example components for different tabs
const PostsComponent = () => <div>Posts Content</div>;
const UsersComponent = () => <div>Users Content</div>;
const AccountComponent = () => <div>Account Content</div>;
const ManualProductsComponent = () => <div>Manual Products Content</div>;
const ViewWebsiteComponent = () => <div>View Website Content</div>;
const PaymentHistoryComponent = () => <div>Payment History Content</div>;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const checkAuthorization = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/users/me",
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
    } catch (error) {
      // Redirect based on error
      if (axios.isAxiosError(error)) {
        if (error.response && error.response.status === 422) {
          navigate("/panel/admin/login/");
        } else if (error.response && error.response.status === 401) {
          navigate("/panel/admin/login/");
        } else {
          console.log(error);
          toast.error("Unknown error, check console");
        }
      }
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, []);

  // State to track which tab is selected
  const [selectedTab, setSelectedTab] = useState<string>("posts");

  // Function to render content based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "posts":
        return <PostsComponent />;
      case "users":
        return <UsersComponent />;
      case "account":
        return <AccountComponent />;
      case "manualProducts":
        return <ManualProductsComponent />;
      case "viewWebsite":
        return <ViewWebsiteComponent />;
      case "paymentHistory":
        return <PaymentHistoryComponent />;
      default:
        return <PostsComponent />; // Default to "Posts"
    }
  };

  return (
    <div className="bg-white font-sans">
      <div className="flex">
        <Sidebar>
          {/* Sidebar items with onClick handlers */}
          <SidebarItem
            icon={<NotepadText size={20} />}
            text="Posts"
            active={selectedTab === "posts"}
            onClick={() => setSelectedTab("posts")}
          />
          <SidebarItem
            icon={<Users size={20} />}
            text="Users"
            alert
            active={selectedTab === "users"}
            onClick={() => setSelectedTab("users")}
          />
          <SidebarItem
            icon={<CircleUser size={20} />}
            text="Account"
            active={selectedTab === "account"}
            onClick={() => setSelectedTab("account")}
          />
          <SidebarItem
            icon={<StickyNote size={20} />}
            text="Manual Products"
            active={selectedTab === "manualProducts"}
            onClick={() => setSelectedTab("manualProducts")}
          />
          <SidebarItem
            icon={<IconLink size={20} />}
            text="View Website"
            active={selectedTab === "viewWebsite"}
            onClick={() => setSelectedTab("viewWebsite")}
          />
          <SidebarItem
            icon={<CreditCard size={20} />}
            text="Payment History"
            active={selectedTab === "paymentHistory"}
            onClick={() => setSelectedTab("paymentHistory")}
          />
          <SidebarItem
            icon={<KeyRound size={20} />}
            text="Password Recovery"
            active={selectedTab === "PasswordRecovery"}
            onClick={() => setSelectedTab("PasswordRecovery")}
          />
          <hr className="my-3" />

          <Link to={"https://t.me/classssick"}>
            <SidebarItem icon={<LifeBuoy size={20} />} text="Contact Support" />
          </Link>
        </Sidebar>

        {/* Main content area */}
        <div className="flex-1">
          <Navbar />
          <div className="p-4">{renderContent()}</div>{" "}
          {/* Render the selected content */}
        </div>
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Dashboard;
