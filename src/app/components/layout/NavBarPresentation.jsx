import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  Login as LoginIcon,
  Notifications as Bell,
  Work as Briefcase,
  BusinessCenter as BriefcaseBusiness,
  ArrowDropDown as ChevronDown,
  Home,
  Logout as LogOut,
  Chat as MessageCircle,
  DarkMode as Moon,
  People as Network,
  Search,
  Settings,
  LightMode as Sun,
  Person as User,
  Menu as MenuIcon,
} from "@mui/icons-material";
import Image from "next/image";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropDownMenu";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/Sheet";

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

/**
 * @namespace layout
 * @module layout
 */

/**
 * Renders a navigation icon component that changes style based on the current path.
 *
 * @param {Object} props - The component props
 * @param {Object} props.icon - The icon object containing icon component, name, and pathName
 * @param {React.ComponentType} props.icon.icon - The icon component to render
 * @param {string} props.icon.name - The display name of the icon
 * @param {string} props.icon.pathName - The route path associated with this icon
 * @param {string} props.currentPath - The current active path in the application
 * @param {Function} props.navigateTo - Function to navigate to the specified path when icon is clicked
 * @returns {JSX.Element} A clickable icon with conditional styling based on active state
 */
const Icon = ({ icon, currentPath, navigateTo }) => {
  return (
    <div
      onClick={() => navigateTo(icon.pathName)}
      className={`flex flex-col gap-1 items-center justify-center p-1 px-3 hover:bg-primary/10 cursor-pointer ${
        currentPath === icon.pathName
          ? "border-b-2 border-secondary text-secondary font-semibold"
          : "text-primary/80"
      }`}
    >
      <icon.icon
        className={`${currentPath === icon.pathName ? "text-secondary" : ""}`}
        sx={{ fontSize: 20 }}
      />
      <p className="text-xs">{icon.name}</p>
    </div>
  );
};

/**
 * A component that renders an icon with a badge.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.icon - The icon object.
 * @param {Function} props.icon.icon - The icon component to render.
 * @param {string} props.icon.name - The name of the icon for accessibility.
 * @param {number|string} props.icon.badge - The badge content to display.
 * @param {string} props.currentPath - The current path of the application.
 * @param {Function} props.navigateTo - Function to navigate to a different route.
 * @param {number|string} props.badge - Alternative badge content (not used in current implementation).
 * @returns {JSX.Element} The rendered icon with badge component.
 */
const IconWithBadge = ({ icon, currentPath, navigateTo }) => {
  return (
    <div className="relative hidden md:block">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full cursor-pointer hover:bg-primary/10"
        aria-label={icon.name}
      >
        <icon.icon className="text-muted-foreground" sx={{ fontSize: 20 }} />
      </Button>
      <Badge className="absolute -top-1 -right-1 h-5 font-semibold w-5 flex items-center justify-center bg-secondary text-[10px]">
        {icon.number > 99 ? "99+" : icon.number}
      </Badge>
    </div>
  );
};

/**
 * Navigation bar component with responsive design that includes logo, search, navigation icons,
 * notifications, messages, user profile dropdown and theme toggle.
 *
 * @param {Object} props - Component props
 * @param {Object} props.userInfo - User information object containing profile details
 * @param {string} props.userInfo.name - User's display name
 * @param {string} props.userInfo.username - User's unique username
 * @param {string} props.userInfo.headline - User's headline or short bio
 * @param {string} props.userInfo.profilePicture - URL to user's profile picture
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {Function} props.toggleTheme - Function to toggle between light and dark themes
 * @param {string} props.currentPath - Current active route path
 * @param {Function} props.navigateTo - Navigation function that accepts route path as parameter
 * @returns {JSX.Element} Rendered navigation bar component
 */
export default function NavbarPresentation({
  userInfo,
  theme,
  toggleTheme,
  currentPath,
  navigateTo,
  open,
  setOpen,
}) {
  return (
    <nav className="w-full flex justify-center bg-foreground drop-shadow-lg sticky top-0 z-30 px-6">
      {/* Mobile Menu */}
      <div className="md:hidden flex items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary mr-2 cursor-pointer"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-r from-secondary to-secondary/90 p-1.5 rounded-md">
                    <span className="text-xl font-bold text-white">S</span>
                  </div>
                  <span className="text-xl font-black bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
                    SHA<span className="text-secondary">غ</span>ALNY
                  </span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4 h-[calc(100vh-120px)] overflow-y-auto">
              {/* User Profile Section for Mobile */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative rounded-full size-12">
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
                <div>
                  <p className="font-semibold text-primary">{userInfo.name}</p>
                  <p className="text-xs text-muted">{userInfo.headline}</p>
                </div>
              </div>

              {/* Navigation Links for Mobile */}
              {navIcons.map((icon, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`justify-start cursor-pointer gap-3 ${
                    currentPath === icon.pathName
                      ? "bg-secondary/10 text-secondary"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => {
                    navigateTo(icon.pathName);
                    setOpen(false);
                  }}
                >
                  <icon.icon sx={{ fontSize: 20 }} />
                  <span>{icon.name}</span>
                </Button>
              ))}

              {/* Messages & Notifications for Mobile */}
              <Button
                variant="ghost"
                className="justify-start gap-3 cursor-pointer hover:bg-primary/10"
                onClick={() => {
                  navigateTo("/messages");
                  setOpen(false);
                }}
              >
                <MessageCircle sx={{ fontSize: 20 }} />
                <span>Messages</span>
                <Badge className="ml-auto bg-secondary">
                  {userInfo?.messagesReceived > 99
                    ? "99+"
                    : userInfo?.messagesReceived}
                </Badge>
              </Button>

              <Button
                variant="ghost"
                className="justify-start gap-3 cursor-pointer hover:bg-primary/10"
                onClick={() => {
                  navigateTo("/notifications");
                  setOpen(false);
                }}
              >
                <Bell sx={{ fontSize: 20 }} />
                <span>Notifications</span>
                <Badge className="ml-auto bg-secondary">
                  {userInfo?.notificationsReceived > 99
                    ? "99+"
                    : userInfo?.notificationsReceived}
                </Badge>
              </Button>

              {/* Settings & Logout for Mobile */}
              <Button
                variant="ghost"
                className="justify-start gap-3 cursor-pointer hover:bg-primary/10"
                onClick={() => {
                  navigateTo("/settings");
                  setOpen(false);
                }}
              >
                <Settings sx={{ fontSize: 20 }} />
                <span>Settings</span>
              </Button>

              <Button
                variant="ghost"
                className="justify-start gap-3 cursor-pointer hover:bg-primary/10"
                onClick={() => {
                  navigateTo("/logout");
                  setOpen(false);
                }}
              >
                <LogOut sx={{ fontSize: 20 }} />
                <span>Log Out</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo Section - Visible on all screens */}
      <section className="flex mr-auto items-center p-2 w-full">
        <div
          onClick={() => navigateTo("/")}
          className="flex items-center gap-2 group hover:scale-110 cursor-pointer ease-in-out duration-300"
        >
          <div className="bg-gradient-to-r from-secondary to-secondary/90 p-1.5 rounded-md group-hover:shadow-md transition-all duration-200">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent transition-all duration-200">
            SHA<span className="text-secondary">غ</span>ALNY
          </span>
        </div>
        <div className="ml-4 relative hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            className="bg-foreground border border-primary/60 px-4 py-2 rounded-full w-64 focus:outline-hidden focus:ring-2 focus:ring-secondary text-primary"
            onKeyDown={(e) => {
              console.log("i searched")
              if (e.key === "Enter") {
                const query = e.target.value.trim();
                if (query) {
                  navigateTo(`/search/all?query=${encodeURIComponent(query)}`);
                }
              }
            }}
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-500"
            sx={{ fontSize: 20 }}
          />
        </div>
      </section>

      {/* Nav Icons - Hidden on mobile */}
      <section className="hidden md:flex w-full gap-4 justify-center">
        {navIcons.map((icon, index) => (
          <Icon
            key={index}
            icon={icon}
            currentPath={currentPath}
            navigateTo={navigateTo}
          />
        ))}
      </section>

      {/* User Profile Section */}
      <section className="flex gap-3 p-3 text-primary justify-end items-center w-full ml-auto">
        {/* Notification Icons - Hidden on mobile */}
        <div className="hidden md:flex gap-3">
          {[
            {
              name: "Messages",
              icon: MessageCircle,
              number: userInfo?.messagesReceived,
            },
            {
              name: "Notifications",
              icon: Bell,
              number: userInfo?.notificationsReceived,
            },
          ].map((icon, index) => (
            <IconWithBadge key={index} icon={icon} />
          ))}
        </div>

        {/* User Dropdown - Modified for responsiveness */}
        <DropdownMenu>
          <DropdownMenuTrigger className="ml-4 flex items-center space-x-2">
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
                <ChevronDown className="text-muted" sx={{ fontSize: 16 }} />
              </div>
              <div className="text-xs text-muted">{userInfo.headline}</div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem
              onClick={() => navigateTo(`/u/${userInfo?.username}`)}
            >
              <User sx={{ fontSize: 16 }} />
              <span>View Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigateTo("/settings")}>
              <Settings sx={{ fontSize: 16 }} />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigateTo("/logout")}>
              <LogOut sx={{ fontSize: 16 }} />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="ml-4 p-2 cursor-pointer rounded-lg hover:bg-primary/10"
        >
          {theme === "dark" ? (
            <Sun sx={{ fontSize: 20 }} />
          ) : (
            <Moon sx={{ fontSize: 20 }} />
          )}
        </button>
      </section>
    </nav>
  );
}

/**
 * A skeleton loading version of the navigation bar with responsive design
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.theme - Current theme ('dark' or 'light')
 * @param {boolean} props.isLoading - Whether the component is in loading state
 * @param {Function} props.toggleTheme - Function to toggle between dark and light themes
 * @param {string} props.currentPath - Current active route path
 * @param {Function} props.navigateTo - Navigation function that accepts a route path
 * @returns {JSX.Element} Rendered skeleton navigation bar component
 */
export const NavBarPresentationSkeleton = ({
  theme,
  isLoading,
  toggleTheme,
  currentPath,
  navigateTo,
  open,
  setOpen,
}) => {
  return (
    <nav className="w-full flex justify-center bg-foreground drop-shadow-md sticky top-0 z-30 px-6">
      {/* Mobile Menu - Skeleton */}
      <div className="md:hidden flex items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-primary mr-2 cursor-pointer"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-r from-secondary to-secondary/90 p-1.5 rounded-md">
                    <span className="text-xl font-bold text-white">S</span>
                  </div>
                  <span className="text-xl font-black bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent">
                    SHA<span className="text-secondary">غ</span>ALNY
                  </span>
                </div>
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4 h-[calc(100vh-120px)] overflow-y-auto">
              {/* Skeleton content items */}
              {/* User Profile Section Skeleton for Mobile */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className={`relative rounded-full bg-gray-400 ${
                    isLoading ? "animate-pulse" : ""
                  } size-12`}
                />
                <div className="space-y-2">
                  <div
                    className={`h-4 w-24 bg-gray-400 rounded-md ${
                      isLoading ? "animate-pulse" : ""
                    }`}
                  />
                  <div
                    className={`h-3 w-32 bg-gray-400 rounded-md ${
                      isLoading ? "animate-pulse" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Navigation Links Skeleton for Mobile */}
              {navIcons.map((icon, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className={`justify-start gap-3 cursor-pointer ${
                    currentPath === icon.pathName
                      ? "bg-secondary/10 text-secondary"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => {
                    navigateTo(icon.pathName);
                    setOpen(false);
                  }}
                >
                  <icon.icon sx={{ fontSize: 20 }} />
                  <span>{icon.name}</span>
                </Button>
              ))}

              {/* Messages & Notifications Skeleton for Mobile */}
              <Button variant="ghost" className="justify-start gap-3" disabled>
                <MessageCircle sx={{ fontSize: 20 }} />
                <span>Messages</span>
                <div
                  className={`ml-auto h-5 w-5 rounded-full bg-gray-400 ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                />
              </Button>

              <Button variant="ghost" className="justify-start gap-3" disabled>
                <Bell sx={{ fontSize: 20 }} />
                <span>Notifications</span>
                <div
                  className={`ml-auto h-5 w-5 rounded-full bg-gray-400 ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                />
              </Button>

              {/* Settings & Logout Skeleton */}
              <Button variant="ghost" className="justify-start gap-3" disabled>
                <Settings sx={{ fontSize: 20 }} />
                <span>Settings</span>
              </Button>

              <Button variant="ghost" className="justify-start gap-3" disabled>
                <LogOut sx={{ fontSize: 20 }} />
                <span>Log Out</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Logo Section - Visible on all screens */}
      <section className="flex w-full mr-auto items-center p-2">
        <div
          onClick={() => navigateTo("/")}
          className="flex items-center gap-2 group hover:scale-110 cursor-pointer ease-in-out duration-300"
        >
          <div className="bg-gradient-to-r from-secondary to-secondary/90 p-1.5 rounded-md group-hover:shadow-md transition-all duration-200">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <span className="text-xl font-black bg-gradient-to-r from-primary to-primary/90 bg-clip-text text-transparent transition-all duration-200">
            SHA<span className="text-secondary">غ</span>ALNY
          </span>
        </div>
        <div className="ml-4 relative hidden lg:block">
          <input
            type="text"
            placeholder="Search..."
            disabled={isLoading}
            className="bg-foreground border border-primary/60 px-4 py-2 rounded-full w-64 focus:outline-hidden focus:ring-2 focus:ring-secondary text-primary"
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-500"
            sx={{ fontSize: 20 }}
          />
        </div>
      </section>

      {/* Nav Icons - Hidden on mobile */}
      <section className="hidden md:flex w-full gap-4 justify-center">
        {navIcons.map((icon, index) => (
          <Icon
            key={index}
            icon={icon}
            currentPath={currentPath}
            navigateTo={navigateTo}
          />
        ))}
      </section>

      {/* User Profile Section */}
      <section className="flex gap-3 p-3 text-primary justify-end items-center w-full ml-auto">
        {/* Notification Icons Skeleton - Hidden on mobile */}
        {isLoading && (
          <div className="hidden md:flex gap-3">
            {[
              { name: "Messages", icon: MessageCircle },
              { name: "Notifications", icon: Bell },
            ].map((icon, index) => (
              <div key={index} className="relative hidden md:block">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled
                  className="rounded-full cursor-not-allowed opacity-70"
                  aria-label={icon.name}
                >
                  <icon.icon
                    className="text-muted-foreground"
                    sx={{ fontSize: 20 }}
                  />
                </Button>
                <div
                  className={`absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center bg-gray-400 ${
                    isLoading ? "animate-pulse" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        )}

        {/* User Avatar Skeleton */}
        {isLoading && (
          <div className="flex items-center ml-4 space-x-2">
            <div
              className={`relative rounded-full bg-gray-400 ${
                isLoading ? "animate-pulse" : ""
              } size-9`}
            />
            <div className="hidden md:block space-y-1">
              <div
                className={`h-4 w-24 bg-gray-400 rounded-md ${
                  isLoading ? "animate-pulse" : ""
                }`}
              />
              <div
                className={`h-3 w-32 bg-gray-400 rounded-md ${
                  isLoading ? "animate-pulse" : ""
                }`}
              />
            </div>
          </div>
        )}

        {!isLoading && (
          <button
            className="flex gap-2 items-center rounded-2xl bg-secondary/80 px-6 py-2 text-sm font-semibold text-background cursor-pointer duration-300 hover:bg-secondary/60 "
            onClick={() => navigateTo("/signin")}
          >
            <LoginIcon sx={{ fontSize: 20 }} />
            Login
          </button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="ml-4 p-2 cursor-pointer rounded-lg hover:bg-primary/10"
        >
          {theme === "dark" ? (
            <Sun sx={{ fontSize: 20 }} />
          ) : (
            <Moon sx={{ fontSize: 20 }} />
          )}
        </button>
      </section>
    </nav>
  );
};
