import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  Bell,
  Briefcase,
  BriefcaseBusiness,
  ChevronDown,
  Home,
  LogOut,
  MessageCircle,
  Moon,
  Network,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";
import Image from "next/image";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

const navIcons = [
  {
    name: "Home",
    pathName: "/",
    icon: Home,
  },
  {
    name: "Network",
    pathName: "/network",
    icon: Network,
  },
  {
    name: "Jobs",
    pathName: "/jobs",
    icon: Briefcase,
  },
  {
    name: "Business",
    pathName: "/business",
    icon: BriefcaseBusiness,
  },
];

export const NavBarPresentationSkeleton = (
  theme,
  isLoading,
  toggleTheme,
  currentPath,
  navigateTo
) => {
  return (
    <nav className="w-full flex justify-center bg-gray-900 dark:bg-[#1f252b] drop-shadow-md sticky top-0 z-30 px-6">
      <section className="hidden md:flex mr-auto w-full gap-2 items-center p-2">
        <div
          onClick={() => navigateTo("/")}
          className="flex items-center gap-2 group hover:scale-110 cursor-pointer ease-in-out duration-300"
        >
          <div className="bg-gradient-to-r from-secondary to-secondary/90 p-1.5 rounded-md group-hover:shadow-md transition-all duration-200">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-secondary to-secondary/90 bg-clip-text text-transparent transition-all duration-200">
            Shaغalny
          </span>
        </div>
        <div className="ml-4 relative hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            className="bg-foreground px-4 py-2 rounded-full w-64 focus:outline-hidden focus:ring-2 focus:ring-secondary text-primary"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>
      </section>
      <section className="w-full flex gap-4 justify-center">
        {navIcons.map((icon, index) => (
          <Icon
            key={index}
            icon={icon}
            currentPath={currentPath}
            navigateTo={navigateTo}
          />
        ))}
      </section>
      <section className="flex gap-3 p-3 text-background dark:text-primary justify-end items-center w-full ml-auto">
        <div className={`relative rounded-full bg-gray-400 ${isLoading ? animate-pulse : ""} size-9`}/>
        <div className={`w-40 h-full bg-gray-400 rounded-2xl ${isLoading ? animate-pulse : ""}`}/>
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="ml-4 p-2 cursor-pointer rounded-lg hover:bg-foreground/20 dark:hover:bg-foreground"
        >
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </button>
      </section>
    </nav>
  );
};

const Icon = ({ icon, currentPath, navigateTo }) => {
  return (
    <div
      onClick={() => navigateTo(icon.pathName)}
      className={`flex flex-col gap-1 items-center justify-center p-1 px-3 hover:bg-foreground/20 cursor-pointer ${
        currentPath === icon.pathName
          ? "border-b-2 border-secondary text-secondary font-semibold"
          : "text-background/80 dark:text-primary/60"
      }`}
    >
      <icon.icon
        className={`size-5 ${
          currentPath === icon.pathName ? "fill-current text-secondary" : ""
        }`}
      />
      <p className="text-xs">{icon.name}</p>
    </div>
  );
};

const IconWithBadge = ({ icon, currentPath, navigateTo, badge }) => {
  return (
    <div className="relative hidden md:block">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full cursor-pointer hover:bg-primary/90"
        aria-label={icon.name}
      >
        <icon.icon className="size-5 text-muted-foreground" />
      </Button>
      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-secondary text-[10px]">
        {icon.badge}
      </Badge>
    </div>
  );
};

export default function NavbarPresentation({
  userInfo,
  theme,
  toggleTheme,
  currentPath,
  navigateTo,
}) {
  return (
    <nav className="w-full flex justify-center bg-gray-900 dark:bg-[#1f252b] drop-shadow-md sticky top-0 z-30 px-6">
      <section className="hidden md:flex mr-auto w-full gap-2 items-center p-2">
        <div
          onClick={() => navigateTo("/")}
          className="flex items-center gap-2 group hover:scale-110 cursor-pointer ease-in-out duration-300"
        >
          <div className="bg-gradient-to-r from-secondary to-secondary/90 p-1.5 rounded-md group-hover:shadow-md transition-all duration-200">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-secondary to-secondary/90 bg-clip-text text-transparent transition-all duration-200">
            Shaغalny
          </span>
        </div>
        <div className="ml-4 relative hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            className="bg-foreground px-4 py-2 rounded-full w-64 focus:outline-hidden focus:ring-2 focus:ring-secondary text-primary"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>
      </section>
      <section className="w-full flex gap-4 justify-center">
        {navIcons.map((icon, index) => (
          <Icon
            key={index}
            icon={icon}
            currentPath={currentPath}
            navigateTo={navigateTo}
          />
        ))}
      </section>
      <section className="flex gap-3 p-3 text-background dark:text-primary justify-end items-center w-full ml-auto">
        {[
          { name: "Messages", icon: MessageCircle, badge: 3 },
          { name: "Notifications", icon: Bell, badge: 10 },
        ].map((icon, index) => (
          <IconWithBadge key={index} icon={icon} />
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="ml-4 flex items-center space-x-2"
          >
            <div className="relative rounded-full size-9">
              <Image
                src={
                  userInfo.profilePicture ||
                  "https://picsum.photos/id/15/500/200"
                }
                alt="User Avatar"
                fill
                className="rounded-full"
              />
            </div>
            <div className="text-left hidden md:block">
              <div className="text-sm flex items-center gap-1 font-[525] hover:underline cursor-pointer">
                {userInfo.name}
                <ChevronDown className="text-muted size-4" />
              </div>
              <div className="text-xs text-muted">{userInfo.headline}</div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              onClick={() => navigateTo(`/u/${userInfo?.username}`)}
            >
              <User className="size-4" />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigateTo("/settings")}>
              <Settings className="size-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigateTo("/logout")}>
              <LogOut className="size-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="ml-4 p-2 cursor-pointer rounded-lg hover:bg-foreground/20 dark:hover:bg-foreground"
        >
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </button>
      </section>
    </nav>
  );
}
