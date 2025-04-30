import { Bookmark, Insights, Settings } from "@mui/icons-material";
import { useEffect, useState } from "react";
import Container from "./Container";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
const allQuickAccessIcons = [
  {
    icon: Bookmark,
    title: "My Items",
    path: "/my-items",
  },
  {
    icon: Settings,
    title: "Settings",
    path: "/settings",
  },
  {
    icon: AdminPanelSettingsIcon,
    title: "System Managment",
    path: "/admin/analytics",
    adminOnly: true,
  },
];

const QuickAccess = ({ navigateTo }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [quickAccessIcons, setQuickAccessIcons] = useState([]);

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
    
    const filteredIcons = allQuickAccessIcons.filter(
      icon => !icon.adminOnly || adminStatus
    );
    setQuickAccessIcons(filteredIcons);
  }, []);

  return (
    <Container className="p-4 w-full dark:border-[#111] border shadow-md flex flex-col gap-2">
      {quickAccessIcons.map((icon, index) => (
        <div key={index} className="flex gap-2 items-center">
          <icon.icon sx={{fontSize: "1.3rem"}} className={icon.className}/>
          <button
            onClick={() => navigateTo(icon.path)}
            className="hover:underline text-sm font-semibold cursor-pointer"
          >
            {icon.title}
          </button>
        </div>
      ))}
    </Container>
  );
};

export default QuickAccess;
