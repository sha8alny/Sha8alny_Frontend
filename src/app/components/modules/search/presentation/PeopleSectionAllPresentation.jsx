import ResultsCard from "@/app/components/modules/search/presentation/ResultCard";
import PersonIcon from '@mui/icons-material/Person';
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
  error
}) => {
  
  if (isError) {
    return (
      <ResultsCard 
        title="People" 
        icon={<PersonIcon sx={{ fontSize: "1.125rem" }} />}
        data-testid="people-error-card"
      >
        <p className="text-gray-400 text-sm">{error}</p>
      </ResultsCard>
    );
  }


    return (
    <ResultsCard
      title="People"
      isLoading={isLoading}
      flag={users?.length > 0}
      icon={<PersonIcon sx={{ fontSize: "1.125rem" }} />}
      viewMoreText={"View all people results"}
      onViewMore={onViewMore}
      data-testid="people-results-card"
    >
      {users?.length > 0 ? (
        users
          .slice(0, 3)
          .map((user, index) => (
            <PersonCardContainer
              key={user.id || index}
              username={user.username}
              name={user.name}
              avatarUrl={user.profilePicture}
              position={user.position}
              company={user.company}
              headline={user.headline}
              about={user.about}
              location={user.location}
              isConnected={user.isConnected}
              data-testid={`person-card-container-${user.id || index}`}
            />
          ))
      ) : (
        <p className="text-gray-400 text-sm">No people found.</p>
      )}
    </ResultsCard>
  );
};
export default PeopleSectionAllPresentation;