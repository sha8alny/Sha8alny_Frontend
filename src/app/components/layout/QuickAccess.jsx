import { Bookmark, Insights, Settings } from "@mui/icons-material";
import { ChartNoAxesCombined } from "lucide-react";
import Container from "./Container";

const QuickAccessIcons = [
  {
    icon: Bookmark,
    title: "My Items",
    path: "/my-items",
  },
  {
    icon: Insights,
    title: "Analytics",
    path: "/analytics",
  },
  {
    icon: Settings,
    title: "Settings",
    path: "/settings",
  },
];

const QuickAccess = ({ navigateTo }) => {
  return (
    <Container className="p-4 w-full dark:border-[#111] dark:border shadow-lg flex flex-col gap-2">
      {QuickAccessIcons.map((icon, index) => (
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
