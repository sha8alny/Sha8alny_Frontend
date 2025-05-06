import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";

/**
 * SendMessagePresentation - Dialog content for sending direct messages
 * 
 * This component enables users to select a connection to send a message to:
 * - Displays a scrollable list of the user's connections
 * - Shows connection details (name, headline, relationship)
 * - Provides selection mechanism for choosing a recipient
 * - Includes loading states, infinite scrolling, and error handling
 * - Empty state when user has no connections
 * 
 * @param {Object} props - Component props
 * @param {Array} props.connections - Array of user's connections
 * @param {Object|null} props.userToSend - Currently selected connection
 * @param {Function} props.setUserToSend - State setter for selected connection
 * @param {boolean} props.isLoading - Whether connections are loading
 * @param {boolean} props.isFetchingNextPage - Whether additional connections are being fetched
 * @param {boolean} props.isError - Whether connection loading encountered an error
 * @param {Function} props.sendMessage - Handler for sending the message
 * @param {Object} props.observerTarget - Ref for infinite scrolling
 * @param {boolean} props.isSendingMessage - Whether message sending is in progress
 * @returns {JSX.Element} Message dialog content with connection selection
 */
export default function SendMessagePresentation({
  connections,
  userToSend,
  setUserToSend,
  isLoading,
  isFetchingNextPage,
  isError,
  sendMessage,
  observerTarget,
  isSendingMessage,
}) {
  return (
    <div
      className="max-h-96 overflow-y-auto text-primary"
      data-testid="connections-presentation-container"
    >
      <span className="flex justify-between items-center pb-2 sticky top-0 z-40 bg-background">
        <h2 className="text-lg font-semibold" data-testid="connections-heading">
          Your Connections
        </h2>
        <button
          className="text-sm text-primary hover:bg-secondary/80 duration-300 cursor-pointer disabled:cursor-default px-4 py-1 rounded-md disabled:bg-secondary/20 bg-secondary"
          disabled={!userToSend || isSendingMessage}
          onClick={() => sendMessage(userToSend.username)}
          data-testid="send"
        >
          <span className="flex items-center gap-2 font-semibold">
            {isSendingMessage ? (
              <div className="animate-spin h-4 w-4 border-2 border-t-transparent rounded-full border-primary" />
            ) : (
              "Send"
            )}
          </span>
        </button>
      </span>
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
            <UserCard
              key={connection?._id}
              connection={connection}
              userToSend={userToSend}
              setUserToSend={setUserToSend}
            />
          ))}
          <div
            ref={observerTarget}
            className="h-10 w-full"
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
          <p className="text-lg text-primary font-semibold mb-1">
            No connections found.
          </p>
          <p className="text-sm text-muted">
            You haven't connected with anyone yet.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * UserCard - Selectable card representing a connection
 * 
 * @param {Object} props - Component props
 * @param {Object} props.connection - Connection user data
 * @param {Object|null} props.userToSend - Currently selected connection
 * @param {Function} props.setUserToSend - State setter for selected connection
 * @returns {JSX.Element} Selectable connection card
 */
const UserCard = ({ connection, userToSend, setUserToSend }) => {
  return (
    <div
      className={`flex items-center justify-between gap-3 p-2 border-b border-primary/20 pb-4 px-4 hover:bg-primary/10 rounded-md cursor-pointer ${
        userToSend?._id === connection?._id ? "bg-secondary/70" : ""
      }`}
      onClick={() => setUserToSend(connection)}
      data-testid={`connection-card-${connection?._id}`}
    >
      <div className="flex items-center gap-3">
        <Avatar
          className="size-10 cursor-pointer"
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
              className="text-sm font-semibold truncate cursor-pointer hover:underline"
              data-testid={`connection-name-${connection?._id}`}
            >
              {connection?.name}
            </h3>
            <span className="text-muted">•</span>
            <span
              className="text-muted text-xs"
              data-testid={`connection-relation-${connection?._id}`}
            >
              {connection?.relation}
            </span>
          </div>
          <p
            className="text-xs text-left text-muted truncate"
            data-testid={`connection-headline-${connection?._id}`}
          >
            {connection?.headline}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * ConnectionsSkeleton - Loading placeholder for connections
 * 
 * @returns {JSX.Element} Animated loading skeleton for a connection
 */
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
