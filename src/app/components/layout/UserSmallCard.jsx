import { PersonAdd } from "@mui/icons-material";
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
export default function UserSmallCard({ userInfo, onClick }) {
  return (
    <div className="flex gap-2 items-start mb-2 flex-wrap xl:flex-nowrap ">
      <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-foreground rounded-full border dark:border-[#111] flex-shrink-0">
      <Image
          src={userInfo.image}
          alt="User Avatar"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="text-left flex-1 min-w-[140px]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-1">
          <button
            onClick={() => onClick(userInfo.username)}
            className="hover:underline hover:cursor-pointer truncate text-sm font-[525] max-w-[120px] sm:max-w-[160px]"
          >
            {userInfo.name}
          </button>
          <div className="text-xs self-center text-muted">•</div>
          <div className="text-xs self-center text-muted">
            {userInfo.relation}
          </div>
        </div>
        <div className="text-xs text-muted">
          {userInfo.job.length > 30
            ? userInfo.job.substring(0, 20) + "..."
            : userInfo.job}
        </div>
      </div>
      <div className="ml-auto">
      <div className="relative group w-fit mx-auto sm:mx-0">
        <button className="rounded-2xl flex items-center justify-center bg-secondary text-background hover:bg-secondary/80 cursor-pointer ease-in-out duration-300 text-xs p-3 sm:p-2">
          <PersonAdd sx={{ fontSize: "1rem" }} />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 mt-1 text-[10px] sm:text-xs text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Connect
        </span>
      </div>

      </div>
    </div>
  );
}
