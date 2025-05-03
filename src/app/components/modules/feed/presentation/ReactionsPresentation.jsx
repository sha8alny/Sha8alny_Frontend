import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";
import { Reactions } from "@/app/utils/Reactions";
import Link from "next/link";

const ReactionsSkeleton = () => {
  return (
    <div className="flex items-center gap-2 p-4">
      <Avatar className="h-10 w-10 bg-primary/60 animate-pulse"></Avatar>
      <div>
        <div className="h-4 w-36 bg-primary/60 animate-pulse rounded-2xl mb-2"></div>
        <div className="h-3 w-22 bg-primary/60 rounded-2xl"></div>
      </div>
    </div>
  );
};

export default function ReactionsPresentation({
  users,
  isLoading,
  isLoadingMore,
  isError,
  hasNextPage,
  loadMoreRef,
  numReactions,
  handleReactionChange,
  activeReactions,
  navigateTo,
}) {
  return (
    <Tabs defaultValue="all" className="w-full">
      <div className="border-b mb-1 pb-2 border-primary">
        <TabsList
          data-testid="reactions-tabs-list"
          className="h-12 bg-transparent w-full justify-start px-4 gap-4"
        >
          <TabsTrigger
            value="all"
            data-testid="reactions-tab-all"
            className="border-0 data-[state=active]:text-primary data-[state=active]:bg-primary/10 data-[state=active]:dark:text-primary text-primary shadow-xs drop-shadow-xs data-[state=active]:font-semibold"
            onClick={() => handleReactionChange("all")}
          >
            All{" "}
            <span className="ml-1.5 text-xs text-background bg-secondary px-1.5 py-0.5 rounded-full">
              {numReactions}
            </span>
          </TabsTrigger>

          {/* Dynamic reaction tabs */}
          {activeReactions.map((reaction) => {
            const Icon = Reactions[reaction.name]?.icon;

            return (
              <TabsTrigger
                key={reaction.name}
                data-testid={`reactions-tab-${reaction.name}`}
                value={reaction.name.toLowerCase()}
                className="border-0 data-[state=active]:text-primary data-[state=active]:bg-primary/10 data-[state=active]:dark:text-primary text-primary shadow-xs drop-shadow-xs data-[state=active]:font-semibold"
                onClick={() => handleReactionChange(reaction.name)}
              >
                <Icon size="1.5rem" className={`mr-1.5`} />{" "}
                <span className="ml-1.5 text-xs text-background bg-secondary px-1.5 py-0.5 rounded-full">
                  {reaction.count}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      {/* All reactions tab content */}
      <TabsContent
        data-testid="reactions-tab-content-all"
        value="all"
        className="mt-0"
      >
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 2 }, (_, index) => (
              <ReactionsSkeleton key={index} />
            ))
          ) : isError ? (
            <div className="text-center p-8 text-red-500">
              Failed to load reactions.
            </div>
          ) : users.length === 0 ? (
            <div className="text-center p-8 text-muted">No reactions yet.</div>
          ) : (
            <>
              {users.map((user, index) => (
                <UserCard
                  user={user}
                  key={user.username}
                  navigateTo={navigateTo}
                />
              ))}

              {isLoadingMore &&
                Array.from({ length: 2 }, (_, index) => (
                  <ReactionsSkeleton key={index} />
                ))}

              {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
            </>
          )}
        </div>
      </TabsContent>

      {/* Dynamic tab content for each reaction type */}
      {activeReactions.map((reaction) => (
        <TabsContent
          data-testid={`reactions-tab-content-${reaction.name}`}
          key={reaction.name}
          value={reaction.name.toLowerCase()}
          className="mt-0"
        >
          <div className="max-h-[60vh] overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 2 }, (_, index) => (
                <ReactionsSkeleton key={index} />
              ))
            ) : users.length === 0 ? (
              <div className="text-center p-8 text-muted">
                No {reaction.name} reactions yet.
              </div>
            ) : (
              <>
                {users.map((user, index) => (
                  <UserCard user={user} key={user.username} />
                ))}

                {isLoadingMore &&
                  Array.from({ length: 2 }, (_, index) => (
                    <ReactionsSkeleton key={index} />
                  ))}

                {hasNextPage && <div ref={loadMoreRef} className="h-10" />}
              </>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}

const UserCard = ({ user, navigateTo }) => {
  return (
    <div className="flex items-center gap-2 p-4 hover:bg-primary/5 rounded-md transition-colors">
      <Avatar
        onClick={() => navigateTo(`/u/${user?.username}`)}
        data-testid={`user-card-${user?.username}`}
        className="h-10 w-10 cursor-pointer"
      >
        <AvatarImage
          data-testid={`user-card-avatar-${user?.username}`}
          src={user?.profilePicture}
        />
        <AvatarFallback
          data-testid={`user-card-avatar-fallback-${user?.username}`}
          className="bg-primary/50"
        >
          {user.fullName?.charAt(0) || "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div
          data-testid={`user-card-name-${user?.username}`}
          className="flex items-center gap-1.5"
        >
          <Link
            href={`/u/${user?.username}`}
            className="text-primary font-semibold truncate hover:underline"
            data-testid={`user-card-name-${user?.username}`}
          >
            {user?.fullName}
          </Link>
          <span
            data-testid={`user-card-username-${user?.username}`}
            className="text-xs text-primary/40"
          >
            @{user?.username}
          </span>
        </div>
        <p
          data-testid={`user-card-headline-${user?.username}`}
          className="text-xs text-muted truncate"
        >
          {user?.headline || ""}
        </p>
      </div>
      <div
        data-testid={`user-card-reaction-${user?.username}`}
        className={`w-8 h-8 rounded-full flex items-center justify-center`}
      >
        <user.reaction size="1.3rem" />
      </div>
    </div>
  );
};
