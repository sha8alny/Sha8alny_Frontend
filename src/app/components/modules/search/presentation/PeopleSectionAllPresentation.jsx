import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import { User } from "lucide-react";
import  PersonCardContainer  from "../container/PersonCardContainer";
/**
 * @namespace search
 * @module search
 * 
 * @description
 * The `PeopleSectionAllPresentation` component is a presentation component that displays a list of user profiles
 * in a card format. It handles loading, error, and empty states, and allows for viewing more results.
 * 
 * @param {Object} props - The props object.
 * @param {Array} props.users - An array of user objects to display. Each user object should contain properties like `id`, `username`, `name`, `position`, `company`, `headline`, `about`, and `location`.
 * @param {boolean} props.isLoading - A flag indicating whether the data is currently loading.
 * @param {boolean} props.isError - A flag indicating whether there was an error loading the data.
 * @param {Function} props.onViewMore - A callback function triggered when the "View all people results" button is clicked.
 */

 const PeopleSectionAllPresentation = ({
  users,
  isLoading,
  isError,
  onViewMore,
}) => {
  if (isError) {
    return (
      <ResultsCard title="People" icon={<User className="h-4 w-4" />}>
        <p className="text-gray-400 text-sm">Error loading People.</p>
      </ResultsCard>
    );
  }
  return (
    <ResultsCard
      title="People"
      isLoading={isLoading}
      icon={<User className="h-4 w-4" />}
      viewMoreText={"View all people results"}
      onViewMore={onViewMore}
    >
      {users?.length > 0 ? (
        users
          .slice(0, 3)
          .map((user, index) => (
            <PersonCardContainer
              key={user.id || index}
              username={user.username}
              name={user.name}
              position={user.position}
              company={user.company}
              headline={user.headline}
              about={user.about}
              location={user.location}
              onConnect={() => console.log(`Connect with ${user.name}`)}
            />
          ))
      ) : (
        <p className="text-gray-400 text-sm">No people found.</p>
      )}
    </ResultsCard>
  );
};
export default PeopleSectionAllPresentation;