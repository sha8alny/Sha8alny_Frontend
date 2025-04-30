import { Users } from "lucide-react";
import UserSmallCard from "./UserSmallCard";
import Container from "./Container";
import UserSmallCardContainer from "./UserSmallCardContainer";

/**
 * @namespace layout
 * @module layout
 */
/**
 * Renders a container with suggested users.
 *
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.users - An array of user objects to be displayed
 * @param {string} props.title - The title to display above the list of users
 * @param {Function} props.onClick - Click handler function for user cards
 * @returns {JSX.Element} A container with a title and a list of user cards
 */
export default function SuggestedUsers({
  users,
  title,
  onClick,
  onButtonClick,
}) {
  return (
    <Container
      className="border dark:border-[#111] flex flex-col gap-2 shadow-md p-4"
      testId="suggested-users-root"
    >
      <h2
        className="text-lg font-semibold mb-4 flex items-center"
        data-testid="suggested-users-title"
      >
        <Users
          className="size-5 mr-2 fill-current"
          data-testid="suggested-users-icon"
        />
        {title}
      </h2>
      {users.map((user, index) => (
        <UserSmallCardContainer
          key={index}
          userInfo={user}
          onClick={onClick}
          testId={`suggested-users-item-${user?.username || index}`}
        />
      ))}
    </Container>
  );
}

/**
 * Skeleton loader for the SuggestedUsers component.
 *
 * @component
 * @returns {JSX.Element} A container with placeholder elements for loading state
 */
export function SuggestedUsersSkeleton({ title, isLoading }) {
  return (
    <Container
      className="border dark:border-[#111] flex flex-col gap-2 shadow-xs p-4"
      data-testid="suggested-users-skeleton-root"
    >
      <h2
        className="text-lg font-semibold mb-4 flex items-center"
        data-testid="suggested-users-skeleton-title"
      >
        <Users
          className="size-5 mr-2 fill-current"
          data-testid="suggested-users-skeleton-icon"
        />
        {title}
      </h2>
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="flex gap-2 items-center py-1"
          data-testid={`suggested-users-skeleton-item-${index}`}
        >
          <div
            className="relative w-12 h-12 rounded-full animate-pulse bg-primary/60"
            data-testid="suggested-users-skeleton-avatar"
          ></div>
          <div className="text-left flex-1">
            <div className="flex gap-1 mb-1">
              <div
                className={`${
                  isLoading && "animate-pulse"
                } bg-primary/60 h-4 w-20 rounded`}
                data-testid="suggested-users-skeleton-name"
              ></div>
              <div className="text-xs self-center text-muted">•</div>
              <div
                className={`${
                  isLoading && "animate-pulse"
                } bg-primary/60 h-3 w-14 rounded self-center`}
                data-testid="suggested-users-skeleton-meta"
              ></div>
            </div>
            <div
              className={`${
                isLoading && "animate-pulse"
              } bg-primary/40 h-3 w-28 rounded`}
              data-testid="suggested-users-skeleton-headline"
            ></div>
          </div>
          <div className="ml-auto">
            <div
              className={`${
                isLoading && "animate-pulse"
              } bg-primary/60 rounded-full h-9 w-24`}
              data-testid="suggested-users-skeleton-btn"
            ></div>
          </div>
        </div>
      ))}
    </Container>
  );
}
