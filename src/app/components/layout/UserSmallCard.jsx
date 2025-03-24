import { Plus, UserPlus } from "lucide-react";
import Image from "next/image";

export default function UserSmallCard({ userInfo, onClick }){
    return (
      <div className="flex gap-2 items-center">
        <div className="relative w-12 h-12 bg-gray-800 rounded-full border-2 border-gray-400">
          <Image
            src={userInfo.image}
            alt="User Avatar"
            fill
            className="rounded-full"
          />
        </div>
        <div className="text-left">
          <div className="flex gap-1">
            <button onClick={() => onClick(userInfo.username)} className="hover:underline hover:cursor-pointer truncate text-sm font-[525]">{userInfo.name}</button>
            <div className="text-xs self-center text-muted">•</div>
            <div className="text-xs self-center text-muted">
              {userInfo.relation}
            </div>
          </div>
          <div className="text-xs text-muted">{userInfo.job.length > 30 ? userInfo.job.substring(0,20) + "..." : userInfo.job}</div>
        </div>
        <div className="ml-auto">
          <button className="rounded-full flex items-center gap-2 border-2 border-secondary dark:border-text hover:cursor-pointer hover:text-black hover:bg-secondary hover:dark:bg-white ease-in-out duration-300 text-xs p-3 font-[550]">
            <UserPlus className="size-4" /> Connect
          </button>
        </div>
      </div>
    );
  };