import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import {
  ChatBubbleOutline,
  MoreHoriz,
  PersonAddAlt1,
  PersonRemove,
} from "@mui/icons-material";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropDownMenu";

export default function ConnectionsPresentation({
  connections,
  isMyProfile,
  navigateTo,
  userInfo,
  isLoading,
  isFetchingNextPage,
  isError,
  observerTarget,
}) {
  return (
    <div className="max-h-96 overflow-y-auto text-primary">
      <h2 className="text-lg font-semibold pb-2 sticky top-0 bg-background z-40">
        {isMyProfile ? "Your" : `${userInfo?.name.split(" ")[0]}'s`} Connections
      </h2>
      {isLoading ? (
        Array(10)
          .fill(0)
          .map((_, index) => <ConnectionsSkeleton key={index} />)
      ) : isError ? (
        <p className="text-muted text-sm">Failed to load connections</p>
      ) : connections?.length > 0 ? (
        <ul className="space-y-3">
          {connections.map((connection) => (
            <ConnectionsCard
              key={connection?._id}
              connection={connection}
              navigateTo={navigateTo}
              isMyProfile={isMyProfile}
            />
          ))}
          <div ref={observerTarget} className="h-5">
            {isFetchingNextPage && <ConnectionsSkeleton />}
          </div>
        </ul>
      ) : (
        // Only show "No connections" when we've finished loading and there are none
        <p>No connections found</p>
      )}
    </div>
  );
}

const ConnectionsCard = ({ connection, navigateTo, isMyProfile }) => {
  return (
    <div className="flex items-center justify-between gap-3 p-2 border-b border-primary/20 pb-4 px-4">
      <div className="flex items-center gap-3">
        <Avatar
          className="size-10 cursor-pointer"
          onClick={() => navigateTo(connection?.username)}
        >
          <AvatarImage
            src={connection?.profilePicture}
            alt={connection?.name}
          />
          <AvatarFallback>
            {connection?.name?.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h3
              onClick={() => navigateTo(connection?.username)}
              className="text-sm font-semibold truncate cursor-pointer hover:underline"
            >
              {connection?.name}
            </h3>
            {!isMyProfile && <span className="text-muted ml-2">•</span>}
            {!isMyProfile && (
              <span className="text-muted ml-2">{connection?.relation}</span>
            )}
          </div>
          <p className="text-xs text-muted truncate">{connection?.headline}</p>
          {isMyProfile && (
            <p className="text-xs text-muted mt-1">{connection?.connectedAt}</p>
          )}
        </div>
      </div>
      {isMyProfile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="cursor-pointer p-2 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors">
              <MoreHoriz className="text-muted" sx={{ fontSize: "1rem" }} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-foreground text-primary border"
          >
            <DropdownMenuItem className="hover:bg-primary/20 flex items-center cursor-pointer">
              <ChatBubbleOutline className="mr-2" sx={{ fontSize: "1rem" }} />
              <span>Message</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary/20 cursor-pointer">
              <PersonRemove className="mr-2" sx={{ fontSize: "1rem" }} />
              <span>Remove connection</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-primary/20 cursor-pointer text-red-400 hover:text-red-400">
              <PersonAddAlt1 className="mr-2" sx={{ fontSize: "1rem" }} />
              <span>Block</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!isMyProfile && (
        <button className="cursor-pointer p-2 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors">
          <ChatBubbleOutline className="text-muted" sx={{ fontSize: "1rem" }} />
        </button>
      )}
    </div>
  );
};

const ConnectionsSkeleton = () => {
  return (
    <div className="flex items-center gap-3 p-2 border-b animate-pulse border-primary/20 pb-4 px-4">
      <Avatar className="size-10 bg-primary/20 animate-pulse">
        <AvatarImage src="" alt="" />
      </Avatar>
      <div className="w-full space-y-2">
        <div className="h-4 bg-primary/20 animate-pulse rounded-full w-1/2" />
        <div className="h-3 bg-primary/20 animate-pulse rounded-full w-1/3" />
      </div>
    </div>
  );
};
