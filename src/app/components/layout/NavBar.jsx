"use client";
import { useTheme } from "@/app/context/ThemeContext";
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
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
  },
  {
    name: "Messages",
    pathName: "/messages",
    icon: MessageCircle,
  },
  {
    name: "Notifications",
    icon: Bell,
  },
];

const handleSelection = (name, router, setCurrent = null) => {
  if (setCurrent) setCurrent(name);
  switch (name) {
    case "Home":
      router.push("/");
      break;
    case "Network":
      // Handle Network click
      break;
    case "Briefcase":
      // Handle Briefcase click
      break;
    case "MessageCircle":
      // Handle MessageCircle click
      break;
    case "Bell":
      // Handle Bell click
      break;
    case "Profile":
      router.push("/profile");
      break;
    default:
      break;
  }
};

const Icon = ({ icon, current, setCurrent }) => {
  const router = useRouter();
  return (
    <div
      className={`flex p-1 ${
        current === icon.pathName ? "border-b-2 border-blue-500" : ""
      }`}
    >
      <button
        onClick={() => {
          handleSelection(icon.name, router, setCurrent);
        }}
        className={`flex flex-col justify-center items-center px-8 rounded-lg ${
          current === icon.pathName
            ? ""
            : "hover:bg-gray-400 text-gray-200 transition-colors"
        } cursor-pointer`}
      >
        <icon.icon
          className={`size-7 ${
            current === icon.pathName ? "fill-current text-blue-500" : ""
          }`}
        />
      </button>
      <p className="text-xs"></p>
    </div>
  );
};

export default function Navbar({ userInfo }) {
  const pathName = usePathname();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [current, setCurrent] = useState(pathName);
  return (
    <nav className="w-full flex justify-center bg-gray-700 px-6">
      <section className="mr-auto w-full flex gap-2 items-center p-2">
        <h1 className="text-blue-500 text-xl font-black">Shaغalny</h1>
        <div className="ml-4 relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 px-4 py-2 rounded-full w-64 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>
      </section>
      <section className="w-full flex gap-4 justify-center">
        {Icons.map((icon, index) => (
          <Icon
            setCurrent={setCurrent}
            current={current}
            key={index}
            icon={icon}
          />
        ))}
      </section>
      <section className="flex gap-3 p-3 items-center w-full">
        <button
          onClick={() => handleSelection("Profile", router)}
          className="flex items-center space-x-2 ml-auto"
        >
          <div className="relative rounded-full size-10">
            <Image
              src={"https://picsum.photos/id/15/500/200"}
              alt="User Avatar"
              fill
              className="rounded-full"
            />
          </div>
          <div className="text-left">
            <div className="text-sm font-[525]">Hussein Essam</div>
            <div className="text-xs text-gray-400">
              Ex-QA Intern @ Siemens DISW
            </div>
          </div>
        </button>
        {/* Theme Button */}
        <button
          onClick={toggleTheme}
          title="Toggle Theme"
          className="ml-4 p-2 rounded-lg hover:bg-gray-400"
        >
          <Moon className="size-5" />
        </button>
        <button className="p-2 duration-300 ease-in-out hover:bg-gray-400 rounded-lg">
          <LogOut className="size-5" />
        </button>
      </section>
    </nav>
  );
}