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
import UserAccount from "./DashboardCompoenents/UserAccount";
import ManualProduct from "./DashboardCompoenents/ManualProduct";
import User from "./DashboardCompoenents/User";
import Posts from "./DashboardCompoenents/Posts";
import PaymentHistory from "./DashboardCompoenents/PaymentHistory";

// Example components for different tabs
const PasswordRecovery = () => <div>Password Recovery Content</div>;

export interface MeUser {
  id: string;
  is_active: boolean;
  email: string;
  is_superuser: boolean;
}

const Dashboard: React.FC = () => {
  const [isadmin, setIsadmin] = useState<boolean>(true);
  const [user, setMeuser] = useState<MeUser | null>(null);
  const navigate = useNavigate();

  const checkAuthorization = async () => {
    try {
      const meUser = await axios.get(
        `https://f02c-159-100-101-189.ngrok-free.app/api/v1/admin/users/me`,
        {
          withCredentials: true,
        }
      );

      setMeuser(meUser.data);
      console.log(meUser);

      if (meUser.data.is_superuser) {
        setIsadmin(true);
      } else {
        setIsadmin(false);
      }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track which tab is selected
  const [selectedTab, setSelectedTab] = useState<string>("posts");

  // Function to render content based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case "posts":
        return <Posts />;
      case "users":
        return <User />;
      case "account":
        return <UserAccount user={user} />;
      case "manualProducts":
        return <ManualProduct />;
      case "paymentHistory":
        return <PaymentHistory />;
      case "PasswordRecovery":
        return <PasswordRecovery />;
      default:
        return <Posts />;
    }
  };

  return (
    <div className="bg-white font-sans">
      <div className="flex">
        <Sidebar>
          <SidebarItem
            icon={<NotepadText size={20} />}
            text="Posts"
            active={selectedTab === "posts"}
            onClick={() => setSelectedTab("posts")}
          />
          <SidebarItem
            icon={<Users size={20} />}
            text="Users"
            alert={!isadmin}
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
          <Link to={"/"}>
            <SidebarItem
              icon={<IconLink size={20} />}
              text="View Website"
              active={selectedTab === "viewWebsite"}
              onClick={() => setSelectedTab("viewWebsite")}
            />
          </Link>
          <SidebarItem
            icon={<CreditCard size={20} />}
            text="Payment History"
            active={selectedTab === "paymentHistory"}
            onClick={() => setSelectedTab("paymentHistory")}
          />
          <Link to={"/passwordrecovery"}>
            <SidebarItem
              icon={<KeyRound size={20} />}
              text="Password Recovery"
              active={selectedTab === "PasswordRecovery"}
              onClick={() => setSelectedTab("PasswordRecovery")}
            />
          </Link>
          <hr className="my-3" />

          <Link to={"https://t.me/classssick"}>
            <SidebarItem icon={<LifeBuoy size={20} />} text="Contact Support" />
          </Link>
        </Sidebar>

        <div className="flex-1">
          <Navbar user={user} />
          <div className="p-4">{renderContent()}</div>{" "}
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
