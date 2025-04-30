import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import {
  BlockOutlined,
  ChatBubbleOutline,
  MoreHoriz,
  PersonAddAlt1,
  PersonRemove,
} from "@mui/icons-material";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropDownMenu";
import Dialog from "@/app/components/ui/DialogMod";
import GeneralDeletePresentation from "@/app/components/layout/GeneralDelete";
import { ConnectionsCardContainer } from "../container/Connections";
import Link from "next/link";

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
    <div
      className="max-h-96 overflow-y-auto text-primary"
      data-testid="connections-presentation-container"
    >
      <h2
        className="text-lg font-semibold pb-2 sticky top-0 bg-background z-40"
        data-testid="connections-heading"
      >
        {isMyProfile ? "Your" : `${userInfo?.name.split(" ")[0]}'s`} Connections
      </h2>
      {isLoading ? (
        <div data-testid="connections-loading">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <ConnectionsSkeleton key={index} />
            ))}
        </div>
      ) : isError ? (
        <p className="text-muted text-sm" data-testid="connections-error">
          Failed to load connections
        </p>
      ) : connections?.length > 0 ? (
        <ul className="space-y-3" data-testid="connections-list">
          {connections.map((connection) => (
            <ConnectionsCardContainer
              key={connection?._id}
              connection={connection}
              navigateTo={navigateTo}
              isMyProfile={isMyProfile}
            />
          ))}
          <div
            ref={observerTarget}
            className="h-5"
            data-testid="connections-observer-target"
          >
            {isFetchingNextPage && <ConnectionsSkeleton />}
          </div>
        </ul>
      ) : (
        <div
          className="flex flex-col items-center justify-center py-12 text-center text-muted"
          data-testid="no-connections-message"
        >
          <p className="text-lg text-primary font-semibold mb-1">No connections found.</p>
          <p className="text-sm text-muted">
            {isMyProfile
              ? "You haven't connected with anyone yet."
              : `${
                  userInfo?.name?.split(" ")[0] || "This user"
                } hasn't connected with anyone yet.`}
          </p>
          {isMyProfile && (
            <button className="mt-4 bg-secondary rounded-md p-3 px-6 text-background font-semibold hover:bg-secondary/80 duration-200">
              <Link href="/network">
                Connect With People
              </Link>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export const ConnectionsCard = ({
  connection,
  navigateTo,
  isMyProfile,
  blockModalOpen,
  setBlockModalOpen,
  removeConnectionModalOpen,
  setRemoveConnectionModalOpen,
  onRemove,
  onBlock,
  isBlocking,
  isBlockingError,
  isRemoving,
  isRemovingError,
}) => {
  return (
    <div
      className="flex items-center justify-between gap-3 p-2 border-b border-primary/20 pb-4 px-4"
      data-testid={`connection-card-${connection?._id}`}
    >
      <div className="flex items-center gap-3">
        <Avatar
          className="size-10 cursor-pointer"
          onClick={() => navigateTo(`/u/${connection?.username}`)}
          data-testid={`connection-avatar-${connection?._id}`}
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
              onClick={() => navigateTo(`/u/${connection?.username}`)}
              className="text-sm font-semibold truncate cursor-pointer hover:underline"
              data-testid={`connection-name-${connection?._id}`}
            >
              {connection?.name}
            </h3>
            {!isMyProfile && <span className="text-muted ml-2">•</span>}
            {!isMyProfile && (
              <span
                className="text-muted ml-2"
                data-testid={`connection-relation-${connection?._id}`}
              >
                {connection?.relation}
              </span>
            )}
          </div>
          <p
            className="text-xs text-left text-muted truncate"
            data-testid={`connection-headline-${connection?._id}`}
          >
            {connection?.headline}
          </p>
          {isMyProfile && (
            <p
              className="text-xs text-muted mt-1"
              data-testid={`connection-connectedAt-${connection?._id}`}
            >
              {connection?.connectedAt}
            </p>
          )}
        </div>
      </div>
      {isMyProfile && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="cursor-pointer p-2 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors"
              data-testid={`connection-options-trigger-${connection?._id}`}
            >
              <MoreHoriz className="text-muted" sx={{ fontSize: "1rem" }} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-foreground text-primary border"
            data-testid={`connection-options-content-${connection?._id}`}
          >
            <DropdownMenuItem
              className="hover:bg-primary/20 flex items-center cursor-pointer"
              onClick={() =>
                navigateTo(`/messages?username=${connection?.username}`)
              }
              data-testid={`connection-message-option-${connection?._id}`}
            >
              <ChatBubbleOutline className="mr-2" sx={{ fontSize: "1rem" }} />
              <span>Message</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-primary/20 cursor-pointer"
              data-testid={`connection-remove-option-${connection?._id}`}
              onClick={() => setRemoveConnectionModalOpen(true)}
            >
              <PersonRemove className="mr-2" sx={{ fontSize: "1rem" }} />
              <span>Remove connection</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-primary/20 cursor-pointer text-red-400 hover:text-red-400"
              data-testid={`connection-block-option-${connection?._id}`}
              onClick={() => setBlockModalOpen(true)}
            >
              <PersonAddAlt1 className="mr-2" sx={{ fontSize: "1rem" }} />
              <span>Block</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {!isMyProfile && (
        <button
          onClick={() =>
            navigateTo(`/messages?username=${connection?.username}`)
          }
          className="cursor-pointer p-2 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors"
          data-testid={`connection-message-button-${connection?._id}`}
        >
          <ChatBubbleOutline className="text-muted" sx={{ fontSize: "1rem" }} />
        </button>
      )}
      <Dialog
        open={removeConnectionModalOpen}
        onOpenChange={setRemoveConnectionModalOpen}
        buttonClass="hidden"
        AlertContent={
          <GeneralDeletePresentation
            onConfirmDelete={onRemove}
            isLoading={isRemoving}
            isError={isRemovingError}
            error="Failed to remove connection"
            onOpenChange={setRemoveConnectionModalOpen}
            itemType="Connection"
            loadingText="Removing connection..."
            errorTitle="Error"
            errorMessage="Failed to remove connection"
            confirmTitle={`Remove ${connection?.name}`}
            confirmMessage="Are you sure you want to remove this connection?"
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
            Icon={PersonRemove}
          />
        }
      />
      <Dialog
        open={blockModalOpen}
        onOpenChange={setBlockModalOpen}
        buttonClass="hidden"
        AlertContent={
          <GeneralDeletePresentation
            onConfirmDelete={onBlock}
            isLoading={isBlocking}
            isError={isBlockingError}
            error="Failed to block user"
            onOpenChange={setBlockModalOpen}
            itemType="User"
            loadingText="Blocking user..."
            errorTitle="Error"
            errorMessage="Failed to block user"
            confirmTitle={`Block ${connection?.name}`}
            confirmMessage="Are you sure you want to block this user?"
            confirmButtonText="Block"
            cancelButtonText="Cancel"
            Icon={BlockOutlined}
          />
        }
      />
    </div>
  );
};

const ConnectionsSkeleton = () => {
  return (
    <div
      className="flex items-center gap-3 p-2 border-b animate-pulse border-primary/20 pb-4 px-4"
      data-testid="connection-skeleton"
    >
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
