import { Bookmark, Settings } from "@mui/icons-material";
import { ChartNoAxesCombined } from "lucide-react";

const QuickAccessIcons = [
  {
    icon: Bookmark,
    className: "text-blue-500",
    title: "Saved Items",
    path: "/saved",
  },
  {
    icon: ChartNoAxesCombined,
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
    <div className="p-4 bg-[#1b1f23] w-full rounded-3xl border-[#111] border shadow-lg flex flex-col gap-2">
      {QuickAccessIcons.map((icon, index) => (
        <div key={index} className="flex gap-2 items-center">
          <icon.icon className={`size-4 ${icon.className ?? ""}`} />
          <button
            onClick={() => navigateTo(icon.path)}
            className="hover:underline text-sm font-semibold cursor-pointer"
          >
            {icon.title}
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuickAccess;
