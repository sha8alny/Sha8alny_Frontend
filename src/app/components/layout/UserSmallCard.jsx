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
 * @param {string} props.userInfo.job - User's job title (will be truncated if longer than 30 characters)
 * @param {Function} props.onClick - Callback function when the user name is clicked, receives username as parameter
 * @returns {JSX.Element} A user card with profile image, name, job, and connect button
 */
export default function UserSmallCard({ userInfo, onClick, onButtonClick }) {
  return (
    <div className="flex gap-2 items-center">
      <Avatar
        onClick={() => onClick(`/u/${userInfo?.username}`)}
        className="size-12 cursor-pointer"
      >
        <AvatarImage src={userInfo?.profilePicture} alt={userInfo?.name} />
        <AvatarFallback>
          {userInfo?.name?.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="text-left">
        <div className="flex gap-1">
          <button
            onClick={() => onClick(`/u/${userInfo?.username}`)}
            className="hover:underline hover:cursor-pointer truncate text-sm font-[525]"
          >
            {userInfo?.name}
          </button>
          <div className="text-xs self-center text-muted">•</div>
          <div className="text-xs self-center text-muted">
            {userInfo?.relation}
          </div>
        </div>
        <div className="text-xs text-muted">
          {userInfo?.headline?.length > 30
            ? userInfo?.headline?.substring(0, 20) + "..."
            : userInfo?.headline}
        </div>
      </div>
      <div className="ml-auto">
        <button className="rounded-2xl flex items-center gap-2 bg-secondary text-background hover:bg-secondary/80 cursor-pointer ease-in-out duration-300 text-xs p-3 font-[550]">
          <PersonAdd sx={{ fontSize: "1rem" }} /> Connect
        </button>
      </div>
    </div>
  );
}
