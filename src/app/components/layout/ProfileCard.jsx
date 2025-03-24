import { Building2 } from "lucide-react";
import Image from "next/image";


export default function ProfileCard({ userInfo }) {
    return (
      <div className="w-full h-max bg-[#1b1f23] border border-[#111111] text-white rounded-xl shadow-lg">
        <div className="relative w-full flex">
          <div className="absolute top-0 left-0 w-full h-20 bg-gray-700 rounded-t-xl">
            <Image
              src="https://picsum.photos/id/11/500/200"
              fill
              alt="Cover Image"
              className="rounded-t-xl"
            />
          </div>
          <div className="relative w-16 h-16 z-10 ml-4 bg-gray-800 rounded-full border-2 border-gray-400 mt-10">
            <Image
              src={userInfo.avatar || "https://picsum.photos/id/15/500/200"}
              alt="User Avatar"
              fill
              className="rounded-full"
            />
          </div>
        </div>
        <div className="px-4 pt-1 flex flex-col gap-1 pb-4">
          <h2 className="text-lg font-bold">{userInfo.name}</h2>
          <p className="text-gray-400 text-sm">{userInfo.job}</p>
          <p className="text-gray-500 text-xs">{userInfo.location}</p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Building2 className="h-4 w-4" />
            <p className="text-xs">{userInfo.workPlace}</p>
          </div>
        </div>
      </div>
    );
  };