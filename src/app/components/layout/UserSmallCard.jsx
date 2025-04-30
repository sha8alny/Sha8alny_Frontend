import {
  Cancel,
  ChatBubble,
  ChatBubbleOutline,
  Check,
  CheckCircle,
  Close,
  MoreHoriz,
  Pending,
  PersonAdd,
  PersonAddAlt1Outlined,
} from "@mui/icons-material";
import { Loader2, Plus, UserPlus } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { Button } from "../ui/Button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/Tooltip";
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
export default function UserSmallCard({
  userInfo,
  onClick,
  onButtonClick,
  isConnecting,
  isHandlingRequest,
}) {
  return (
    <div className="flex gap-1 sm:gap-2 items-center w-full px-1 py-1.5">
      <Avatar
        onClick={() => onClick(`/u/${userInfo?.username}`)}
        className="size-10 sm:size-12 cursor-pointer flex-shrink-0"
      >
        <AvatarImage
          src={userInfo?.profilePicture}
          alt={userInfo?.name || "User"}
        />
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
        <div className="text-xs text-muted truncate">{userInfo?.headline}</div>
      </div>
      <div className="ml-auto flex-shrink-0">
        <div className="flex gap-4" data-testid="other-profile-actions">
          {(userInfo?.connectionStatus === "requestReceived") && (
            <div className="flex gap-3">
              <Button
                size="icon"
                disabled={isHandlingRequest}
                className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                title="Accept"
                onClick={() => onButtonClick("ACCEPT")}
              >
                {isHandlingRequest ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check sx={{ fontSize: "1rem" }} />
                )}
              </Button>
              <Button
                size="icon"
                disabled={isHandlingRequest}
                className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                title="Accept"
                onClick={() => onButtonClick("ACCEPT")}
              >
                {isHandlingRequest ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Close sx={{ fontSize: "1rem" }} />
                )}
              </Button>
            </div>
          )}
          {userInfo?.connectionStatus !== "requestReceived" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    disabled={
                      userInfo?.connectionStatus === "pending" || isConnecting
                    }
                    className="disabled:text-background/60 disabled:bg-secondary/70 disabled:cursor-default rounded-full flex items-center justify-center bg-secondary text-background hover:bg-secondary/80 cursor-pointer w-8 h-8 ease-in-out duration-300 text-xs p-3 font-semibold"
                    onClick={() => onButtonClick()}
                    data-testid={
                      userInfo?.connectionStatus === "connected"
                        ? "message-button"
                        : userInfo?.connectionStatus === "pending"
                        ? "awaiting-response-button"
                        : "connect-button"
                    }
                  >
                    {isConnecting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : userInfo?.connectionStatus === "connected" ? (
                      <ChatBubbleOutline sx={{ fontSize: "1rem" }} />
                    ) : userInfo?.connectionStatus === "pending" ? (
                      <PersonAddAlt1Outlined sx={{ fontSize: "1rem" }} />
                    ) : (
                      <PersonAddAlt1Outlined sx={{ fontSize: "1rem" }} />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent className="bg-secondary/30 text-primary" side="top" align="center">
                  {userInfo?.connectionStatus === "connected" ? (
                    <span className="text-xs font-semibold">Message</span>
                  ) : userInfo?.connectionStatus === "pending" ? (
                    <span className="text-xs font-semibold">
                      Awaiting Response
                    </span>
                  ) : (
                    <span className="text-xs font-semibold">Connect</span>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </div>
  );
}
