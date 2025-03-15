//////////// TEMPORARY NAVBAR //////////////
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/context/ThemeContext";
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import MessageIcon from '@mui/icons-material/Message';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("home");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setActiveTab(window.location.pathname.slice(1) || "home");
  }, []);

  const navItems = [
    { id: "home", icon: "home", href: "/" },
    { id: "network", icon: "network", href: "/network" },
    { id: "jobs", icon: "briefcase", href: "/jobs" },
    { id: "messages", icon: "message", href: "/messages" },
    { id: "notifications", icon: "bell", href: "/notifications" },
  ];

  return (
    <div className="bg-foreground text-text top-0 left-0 right-0">
      <div className="container mx-auto">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="text-xl font-bold">
            SHA<span className="text-blue-400">غ</span>ALNY
          </div>

          <nav className="flex">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-center p-3 mx-1 transition-colors relative ${
                  activeTab === item.id
                    ? "text-text"
                    : "text-text-400 hover:text-gray-200"
                }`}
              >
                {getIcon(item.icon)}
                {activeTab === item.id && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
                )}
              </Link>
            ))}
          </nav>

          <div className="w-[100px] flex justify-end">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-hover transition-colors"
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? (
                <Brightness7Icon className="h-6 w-6" />
              ) : (
                <Brightness4Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Icon components function
function getIcon(iconName) {
  switch (iconName) {
    case "home":
      return <HomeIcon className="h-6 w-6" />;
    case "network":
      return <PeopleIcon className="h-6 w-6" />;
    case "briefcase":
      return <WorkIcon className="h-6 w-6" />;
    case "message":
      return <MessageIcon className="h-6 w-6" />;
    case "bell":
      return <NotificationsIcon className="h-6 w-6" />;
    default:
      return null;
  }
}
