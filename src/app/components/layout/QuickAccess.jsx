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
    <Container
      className="p-4 w-full dark:border-[#111] border shadow-md flex flex-col gap-2"
      testId="quick-access-root"
    >
      {QuickAccessIcons.map((icon, index) => (
        <div
          key={index}
          className="flex gap-2 items-center"
          data-testid={`quick-access-item-${icon.title
            .replace(/\s+/g, "-")
            .toLowerCase()}`}
        >
          <icon.icon
            sx={{ fontSize: "1.3rem" }}
            className={icon.className}
            data-testid={`quick-access-icon-${icon.title
              .replace(/\s+/g, "-")
              .toLowerCase()}`}
          />
          <button
            onClick={() => navigateTo(icon.path)}
            className="hover:underline text-sm font-semibold cursor-pointer"
            data-testid={`quick-access-btn-${icon.title
              .replace(/\s+/g, "-")
              .toLowerCase()}`}
          >
            {icon.title}
          </button>
        </div>
      ))}
    </Container>
  );
};

export default QuickAccess;
