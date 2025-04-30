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
    <div
      className="flex gap-1 sm:gap-2 items-center w-full px-1 py-1.5"
      data-testid="user-small-card-root"
    >
      <Avatar
        onClick={() => onClick(`/u/${userInfo?.username}`)}
        className="size-10 sm:size-12 cursor-pointer flex-shrink-0"
        data-testid="user-small-card-avatar"
      >
        <AvatarImage
          src={userInfo?.profilePicture}
          alt={userInfo?.name || "User"}
          data-testid="user-small-card-avatar-img"
        />
        <AvatarFallback data-testid="user-small-card-avatar-fallback">
          {userInfo?.name?.substring(0, 2).toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>
      <div
        className="text-left min-w-0 flex-grow"
        data-testid="user-small-card-body"
      >
        <div className="flex gap-1 flex-wrap sm:flex-nowrap items-center">
          <button
            onClick={() => onClick(`/u/${userInfo?.username}`)}
            className="hover:underline hover:cursor-pointer truncate text-sm font-[525] max-w-full"
            data-testid="user-small-card-name-btn"
          >
            {userInfo?.name}
          </button>
          <div
            className="text-xs self-center text-muted truncate"
            data-testid="user-small-card-dot"
          >
            •
          </div>
          <div
            className="text-xs self-center text-muted truncate"
            data-testid="user-small-card-relation"
          >
            {userInfo?.relation}
          </div>
        </div>
        <div
          className="text-xs text-muted truncate"
          data-testid="user-small-card-headline"
        >
          {userInfo?.headline}
        </div>
      </div>
      <div
        className="ml-auto flex-shrink-0"
        data-testid="user-small-card-actions"
      >
        <div className="flex gap-4" data-testid="other-profile-actions">
          {userInfo?.connectionStatus === "requestReceived" && (
            <div
              className="flex gap-3"
              data-testid="user-small-card-request-actions"
            >
              <Button
                size="icon"
                disabled={isHandlingRequest}
                className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                title="Accept"
                onClick={() => onButtonClick("ACCEPT")}
                data-testid="user-small-card-accept-btn"
              >
                {isHandlingRequest ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    data-testid="user-small-card-accept-loading"
                  />
                ) : (
                  <Check sx={{ fontSize: "1rem" }} />
                )}
              </Button>
              <Button
                size="icon"
                disabled={isHandlingRequest}
                className="h-8 w-8 rounded-full bg-red-500 hover:bg-red-600 text-white cursor-pointer"
                title="Decline"
                onClick={() => onButtonClick("DECLINE")}
                data-testid="user-small-card-decline-btn"
              >
                {isHandlingRequest ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    data-testid="user-small-card-decline-loading"
                  />
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
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        data-testid="user-small-card-connecting-spinner"
                      />
                    ) : userInfo?.connectionStatus === "connected" ? (
                      <ChatBubbleOutline
                        sx={{ fontSize: "1rem" }}
                        data-testid="user-small-card-message-icon"
                      />
                    ) : userInfo?.connectionStatus === "pending" ? (
                      <PersonAddAlt1Outlined
                        sx={{ fontSize: "1rem" }}
                        data-testid="user-small-card-awaiting-icon"
                      />
                    ) : (
                      <PersonAddAlt1Outlined
                        sx={{ fontSize: "1rem" }}
                        data-testid="user-small-card-connect-icon"
                      />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-secondary/30 text-primary"
                  side="top"
                  align="center"
                  data-testid="user-small-card-tooltip"
                >
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
