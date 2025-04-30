import { PersonAdd } from "@mui/icons-material";
import { Plus, UserPlus } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
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
 * @param {string} props.userInfo.headline - User's job title
 * @param {Function} props.onClick - Callback function when the user name is clicked, receives username as parameter
 * @param {Function} props.onButtonClick - Callback function when the follow/connect button is clicked
 * @returns {JSX.Element} A user card with profile image, name, job, and connect button
 */
export default function UserSmallCard({ userInfo, onClick, onButtonClick }) {
  const handleButtonClick = () => {
    if (onButtonClick) onButtonClick(userInfo);
  };

  return (
    <div className="flex gap-1 sm:gap-2 items-center w-full px-1 py-1.5">
      <Avatar
        onClick={() => onClick(`/u/${userInfo?.username}`)}
        className="size-10 sm:size-12 cursor-pointer flex-shrink-0"
      >
        <AvatarImage src={userInfo?.profilePicture} alt={userInfo?.name || "User"} />
        <AvatarFallback>
          {userInfo?.name?.substring(0, 2).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="text-left min-w-0 flex-grow">
        <div className="flex gap-1 flex-wrap sm:flex-nowrap items-center">
          <button
            onClick={() => onClick(`/u/${userInfo?.username}`)}
            className="hover:underline hover:cursor-pointer truncate text-sm font-[525] max-w-full"
          >
            {userInfo?.name}
          </button>
          <div className="text-xs self-center text-muted truncate">•</div>
          <div className="text-xs self-center text-muted truncate">
            {userInfo?.relation}
          </div>
        </div>
        <div className="text-xs text-muted truncate">
          {userInfo?.headline}
        </div>
      </div>
      <div className="ml-auto flex-shrink-0">
        <button 
          onClick={handleButtonClick}
          aria-label={userInfo?.connectionStatus === "pending" ? "Following" : "Follow"} 
          className="rounded-2xl flex items-center justify-center bg-secondary text-background hover:bg-secondary/80 cursor-pointer ease-in-out duration-300 text-xs p-2 sm:px-3"
        >
          <PersonAdd sx={{ fontSize: "1rem" }} />
          <span className="hidden sm:block ml-2 mr-1 whitespace-nowrap">
            {userInfo?.connectionStatus === "pending" ? "Following" : "Connect"}
          </span>
        </button>
      </div>
    </div>
  );
}
