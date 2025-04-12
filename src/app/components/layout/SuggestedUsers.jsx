import { Users } from "lucide-react";
import UserSmallCard from "./UserSmallCard";
import Container from "./Container";

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
export default function SuggestedUsers({ users, title, onClick }) {
    return (
      <Container className="dark:border dark:border-[#111] flex flex-col gap-2 shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="size-5 mr-2 fill-current" />
          {title}
        </h2>
        {users.map((user, index) => (
          <UserSmallCard key={index} userInfo={user} onClick={onClick} />
        ))}
      </Container>
    );
};

/**
 * Skeleton loader for the SuggestedUsers component.
 * 
 * @component
 * @returns {JSX.Element} A container with placeholder elements for loading state
 */
export function SuggestedUsersSkeleton({ title, isLoading }) {
  return (
    <Container className="dark:border dark:border-[#111] flex flex-col gap-2 shadow-xs p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Users className="size-5 mr-2 fill-current" />
        {title}
      </h2>
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex gap-2 items-center py-1">
          <div className="relative w-12 h-12 rounded-full animate-pulse bg-primary/60"></div>
          <div className="text-left flex-1">
            <div className="flex gap-1 mb-1">
              <div className={`${isLoading && "animate-pulse"} bg-primary/60 h-4 w-20 rounded`}></div>
              <div className="text-xs self-center text-muted">•</div>
              <div className={`${isLoading && "animate-pulse"} bg-primary/60 h-3 w-14 rounded self-center`}></div>
            </div>
            <div className={`${isLoading && "animate-pulse"} bg-primary/40 h-3 w-28 rounded`}></div>
          </div>
          <div className="ml-auto">
            <div className={`${isLoading && "animate-pulse"} bg-primary/60 rounded-full h-9 w-24`}></div>
          </div>
        </div>
      ))}
    </Container>
  );
}