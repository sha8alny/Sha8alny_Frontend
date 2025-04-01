import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import { User } from "lucide-react";
import  PersonCardContainer  from "../container/PersonCardContainer";

export const PeopleSectionAllPresentation = ({
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
