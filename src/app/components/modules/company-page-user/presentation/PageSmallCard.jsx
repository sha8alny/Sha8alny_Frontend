import { Plus, UserPlus } from "lucide-react";
import Image from "next/image";
/**
 * @namespace layout
 * @module layout
 */
/**
 * A component that displays a small card with user information including profile image, name, relation, job title, and a connect button.
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Object} props.userInfo - The user information object
 * @param {string} props.userInfo.image - URL to the user's profile image
 * @param {string} props.userInfo.username - User's username
 * @param {string} props.userInfo.name - User's display name
 * @param {string} props.userInfo.relation - Relationship with the current user
 * @param {string} props.userInfo.job - User's job title (will be truncated if longer than 30 characters)
 * @param {Function} props.onClick - Callback function when the user name is clicked, receives username as parameter
 * @returns {JSX.Element} A user card with profile image, name, job, and connect button
 */
export default function PageSmallCard({ userInfo, onClick }){
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
          </div>
          <div className="text-xs text-muted">{userInfo.job.length > 30 ? userInfo.job.substring(0,20) + "..." : userInfo.job}</div>
        </div>
        <div className="ml-auto">
          <button className="rounded-full flex items-center gap-2 border-2 border-secondary dark:border-text hover:cursor-pointer hover:text-black hover:bg-secondary hover:dark:bg-white ease-in-out duration-300 text-xs p-3 font-[550]">
            <UserPlus className="size-4" /> Follow
          </button>
        </div>
      </div>
    );
  };