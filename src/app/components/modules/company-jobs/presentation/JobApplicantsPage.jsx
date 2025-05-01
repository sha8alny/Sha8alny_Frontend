"use client";
import ProfileCard from "../../../ui/ProfileCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ViewApplicationDetailsContainer from "../container/ViewApplicationDetailsContainer";
import { ArrowForwardIos, ArrowBackIos } from "@mui/icons-material";

/**
 * @namespace company-author
 * @module company-author
 */
/**
 * JobApplicantsPage component
 *
 * This component renders a page displaying the list of job applicants. It includes navigation buttons
 * to paginate through the applicants and a button to view detailed application information.
 *
 * @component
 * @param {Object} props - The properties object.
 * @param {Array} props.Applicants - The array of applicant objects to display.
 * @param {boolean} props.isLoading - The state indicating if the applicants are being fetched.
 * @param {Function} props.onBack - The function to call when the back button is clicked.
 * @param {Function} props.onNext - The function to call when the next button is clicked.
 * @param {Function} props.onPrev - The function to call when the previous button is clicked.
 * @param {boolean} props.hasMore - The state indicating if there are more applicants to fetch.
 * @param {number} props.currentPage - The current page number.
 * @param {string} props.jobId - The ID of the job for which applicants are being displayed.
 * @param {Function} props.onViewApplication - The function to call when viewing an applicant's details.
 * @param {Object} props.selectedApplicant - The currently selected applicant's details.
 * @param {Function} props.onCloseApplicationDetails - The function to call when closing the application details modal.
 *
 * @example
 * return (
 *   <JobApplicantsPage
 *     Applicants={Applicants}
 *     isLoading={isLoading}
 *     onBack={onBack}
 *     onNext={onNext}
 *     onPrev={onPrev}
 *     hasMore={hasMore}
 *     currentPage={currentPage}
 *     jobId={jobId}
 *     onViewApplication={onViewApplication}
 *     selectedApplicant={selectedApplicant}
 *     onCloseApplicationDetails={onCloseApplicationDetails}
 *   />
 * )
 */
const JobApplicantsPage = ({
  Applicants,
  isLoading,
  onBack,
  onNext,
  onPrev,
  hasMore,
  currentPage,
  jobId,
  onViewApplication,
  selectedApplicant,
  onCloseApplicationDetails,
}) => {
  console.log("Applicants", Applicants);
  console.log("applicant id", selectedApplicant);
return (
    <div className="bg-foreground flex-grow p-6 rounded-lg w-full relative grid grid-cols-1 gap-6">
        <div className="flex justify-end">
            <ArrowBackIcon
                data-testid="back-button"
                onClick={onBack}
                className="border border-secondary rounded-full hover:bg-background transition duration-300 text-text "
          sx={{
            color: "text",
          }}
          role="button"
          aria-label="ArrowBack"
        />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full w-full flex justify-center items-center min-h-[200px]">
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 border-2 border-t-transparent rounded-full animate-spin border-secondary" />
              <span className="text-primary">Loading...</span>
            </div>
          </div>
        ) : Applicants.length === 0 ? (
          <p className="text-text text-xl text-semibold text-center col-span-full">
            No Applicants yet
          </p>
        ) : (
          Applicants.map((Applicant, index) => (
            <ProfileCard
              key={`${Applicant.id}-${index}`}
              username={Applicant.username}
              name={Applicant.name}
              title={Applicant.headline}
              profilePic={Applicant.profilePicture}
              coverPic={Applicant.coverPhoto}
              numberOfConnections={Applicant.numberOfConnections}
              buttonText="View Application"
              buttonAction={() => onViewApplication(Applicant._id)}
              showButton={true}
              showRemoveButton={false}
              onRemove={() => {}}
            />
          ))
        )}
      </div>
      <div className="flex flex-wrap justify-center sm:justify-between items-center mt-2">
        {currentPage > 1 && (
          <ArrowBackIos
            data-testid="prev-button"
            role="button"
            aria-label="ArrowBackIos"
            onClick={onPrev}
            className="text-secondary"
          />
        )}
        {hasMore && !isLoading && (
          <ArrowForwardIos
            data-testid="next-button"
            role="button"
            aria-label="ArrowForwardIos"
            onClick={onNext}
            className=" text-secondary "
          />
        )}
        {/* {isLoading && Applicants.length > 0 && (
          <p className="text-text text-xl text-semibold text-center mt-4">
            Loading more...
          </p>
        )} */}
      </div>
      {selectedApplicant && (
        <ViewApplicationDetailsContainer
          key={selectedApplicant}
          applicantId={selectedApplicant}
          jobId={jobId}
          onClose={onCloseApplicationDetails}
        />
      )}
    </div>
  );
};

export default JobApplicantsPage;
