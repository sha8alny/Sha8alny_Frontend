import {
  Bell,
  Briefcase,
  BriefcaseBusiness,
  Home,
  LogOut,
  MessageCircle,
  Moon,
  Network,
  Search,
} from "lucide-react";
import Image from "next/image";

const Icons = [
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
  }
];

const Icon = ({ icon, current, setCurrent, router }) => {
  return (
    <div
      className={`flex flex-col gap-1 items-center justify-center p-1 px-3 hover:bg-foreground/20 cursor-pointer ${
        current === icon.pathName ? "border-b-2 border-primary text-primary font-semibold" : "text-background/80 dark:text-primary/60"
      }`}
    >
      <icon.icon
        className={`size-5 ${
          current === icon.pathName ? "fill-current text-primary" : ""
        }`}
      />
      <p className="text-xs">{icon.name}</p>
    </div>
  );
};

export default function NavbarPresentation({
  userInfo,
  toggleTheme,
  router,
  current,
  setCurrent,
  handleSelection,
}) {
  return (
    <nav className="w-full flex justify-center bg-gray-700 dark:bg-gray-700/20 drop-shadow-md sticky top-0 z-30 px-6">
      <section className="mr-auto w-full flex gap-2 items-center p-2">
        <div className="flex items-center gap-2 group hover:scale-110 cursor-pointer ease-in-out duration-300">
          <div className="bg-gradient-to-r from-secondary to-secondary/90 p-1.5 rounded-md group-hover:shadow-md transition-all duration-200">
            <span className="text-xl font-bold text-white">S</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-secondary to-secondary/90 bg-clip-text text-transparent transition-all duration-200">
            Shaغalny
          </span>
        </div>
        <div className="ml-4 relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-foreground px-4 py-2 rounded-full w-64 focus:outline-hidden focus:ring-2 focus:ring-secondary text-primary"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>
      </section>
      <section className="w-full flex gap-4 justify-center">
        {Icons.map((icon, index) => (
          <Icon
            router={router}
            setCurrent={setCurrent}
            current={current}
            key={index}
            icon={icon}
          />
        ))}
      </section>
      <section className="flex gap-3 p-3 text-background dark:text-primary items-center w-full">
        <button
          onClick={() => handleSelection("Profile", router)}
          className="flex items-center space-x-2 ml-auto"
        >
          <div className="relative rounded-full size-10">
            <Image
              src={
                userInfo.profilePicture || "https://picsum.photos/id/15/500/200"
              }
              alt="User Avatar"
              fill
              className="rounded-full"
            />
          </div>
          <div className="text-left">
            <div className="text-sm font-[525] hover:underline cursor-pointer">
              {userInfo.name}
            </div>
            <div className="text-xs text-muted">{userInfo.headline}</div>
          </div>
        </button>
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="ml-4 p-2 cursor-pointer rounded-lg hover:bg-foreground"
        >
          <Moon className="size-5" />
        </button>
        <button className="p-2 duration-300 ease-in-out hover:bg-foreground cursor-pointer rounded-lg">
          <LogOut className="size-5" />
        </button>
      </section>
    </nav>
  );
}
