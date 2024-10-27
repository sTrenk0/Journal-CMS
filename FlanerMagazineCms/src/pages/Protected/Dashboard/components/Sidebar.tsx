import { ChevronFirst, ChevronLast, Lock } from "lucide-react";
import logo from "../assets/logo.png";
import {
  createContext,
  useContext,
  useState,
  FC,
  ReactNode,
  ReactElement,
} from "react";
// Define the shape of the context
interface SidebarContextType {
  expanded: boolean;
}

// Create the context with an initial value (it will be overwritten in the provider)
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Props for Sidebar component
interface SidebarProps {
  children: ReactNode;
}

// Sidebar Component
const Sidebar: FC<SidebarProps> = ({ children }) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <aside className="h-screen font-sans">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src={logo}
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
};

// Props for SidebarItem component
interface SidebarItemProps {
  icon: ReactElement;
  text: string;
  active?: boolean;
  alert?: boolean;
  onClick?: () => void; // Add onClick prop
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon,
  text,
  active = false,
  alert = false,
  onClick,
}) => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarItem must be used within a SidebarContext");
  }

  const { expanded } = context;

  return (
    <li
      onClick={onClick} // Attach the click handler
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
          : "hover:bg-indigo-50 text-gray-600"
      }`}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div className={`absolute right-2 ${expanded ? "" : "top-2"}`}>
          {" "}
          <Lock size={15} />{" "}
        </div>
      )}

      {!expanded && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
        >
          {text}
        </div>
      )}
    </li>
  );
};

export default Sidebar;
export { SidebarItem };
