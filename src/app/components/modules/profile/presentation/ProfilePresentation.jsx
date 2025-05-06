import Footer, { FooterSkeleton } from "@/app/components/layout/Footer";
import SuggestedUsersContainer from "../container/SuggestedUsersContainer";
import About from "./About";
import ProfileStrength from "./ProfileStrength";
import ProfileHeader, { ProfileHeaderSkeleton } from "./ProfileHeader";
import Skills from "./Skills";
import ChangeURL from "./ChangeURL";
import ExperienceContainer from "../container/ExperienceContainer";
import EducationContainer from "../container/EducationContainer";
import CertificationsContainer from "../container/CertificationsContainer";
import PostsContainer from "../container/PostsContainer";
import { SuggestedUsersSkeleton } from "@/app/components/layout/SuggestedUsers";
import Container from "@/app/components/layout/Container";

export function ProfileSkeleton() {
  return (
    <div>
      <main className="flex flex-col lg:flex-row gap-10 p-8 lg:px-32 bg-background">
        <section className="md:flex-[3_1_0]">
          <ProfileHeaderSkeleton />
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <GeneralSkeleton key={index} />
            ))}
        </section>
        <section className="hidden md:block flex-1 rounded-2xl space-y-2">
          <SuggestedUsersSkeleton isLoading />
          <SuggestedUsersSkeleton isLoading />
          <FooterSkeleton />
        </section>
      </main>
    </div>
  );
}

const GeneralSkeleton = () => {
  return (
    <Container
      className="border dark:border-[#111] shadow-lg mt-4 p-8 animate-pulse"
      data-testid="education-skeleton-container"
    >
      <div className="flex justify-between items-center mb-4">
        <div
          className="h-6 w-40 bg-primary/60 rounded-2xl"
          data-testid="education-skeleton-heading"
        />
      </div>

      <div className="space-y-8" data-testid="education-skeleton-list">
        {[...Array(2)].map((_, index) => (
          <div
            className="space-y-6"
            key={index}
            data-testid={`education-skeleton-item-${index}`}
          >
            <div className="flex gap-2">
              <div
                className="size-12 bg-primary/60 rounded-full flex-shrink-0"
                data-testid={`education-skeleton-icon-${index}`}
              />

              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between">
                  <div
                    className="h-6 w-3/5 bg-primary/60 rounded-2xl"
                    data-testid={`education-skeleton-school-${index}`}
                  />
                </div>

                <div
                  className="h-5 w-4/5 bg-primary/60 rounded-2xl"
                  data-testid={`education-skeleton-degree-${index}`}
                />

                <div
                  className="h-4 w-1/3 bg-primary/60 rounded-2xl"
                  data-testid={`education-skeleton-dates-${index}`}
                />

                <div
                  className="h-4 w-1/4 bg-primary/60 rounded-2xl"
                  data-testid={`education-skeleton-location-${index}`}
                />

                <div
                  className="h-16 w-full bg-primary/60 rounded-2xl mt-2"
                  data-testid={`education-skeleton-description-${index}`}
                />

                <div
                  className="flex gap-2 mt-2"
                  data-testid={`education-skeleton-skills-${index}`}
                >
                  {[...Array(2)].map((_, skillIndex) => (
                    <div
                      key={skillIndex}
                      className="h-6 w-16 bg-primary/60 rounded-full"
                      data-testid={`education-skeleton-skill-${index}-${skillIndex}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {index < 1 && (
              <div
                className="h-px w-full bg-primary/60"
                data-testid={`education-skeleton-separator-${index}`}
              />
            )}
          </div>
        ))}
      </div>
    </Container>
  );
};

/**
 * @namespace profile
 * @module profile
 */
/**
 * Renders the profile page presentation component
 * @param {Object} props - The component props
 * @param {Object} props.userProfile - The user profile data object containing user information
 * @param {string} props.userProfile.username - The username of the profile
 * @param {string} props.userProfile.about - The about section text
 * @param {Array} props.userProfile.experience - Array of user's experience entries
 * @param {Array} props.userProfile.education - Array of user's education entries
 * @param {Array} props.userProfile.skills - Array of user's skills
 * @param {Array} props.userProfile.certifications - Array of user's certifications
 * @param {number} props.profileStrength - The profile completion strength percentage
 * @param {boolean} props.isMyProfile - Flag indicating if the profile belongs to the current user
 * @returns {JSX.Element} Profile presentation component with user information sections
 */
export default function ProfilePresentation({
  userProfile,
  profileStrength,
  isMyProfile,
  onCopy,
  onEmail,
  copied,
  fullscreenImage,
  setHoverCover,
  setHoverProfile,
  openFullscreen,
  closeFullscreen,
  fetchPeopleAlsoViewed,
  fetchPeopleYouMayKnow,
  navigateTo,
  changeRelations,
  onReport,
  reportState,
  reportUserModalOpen,
  setReportUserModalOpen,
  reportType,
  setReportType,
  reportText,
  setReportText,
  blockUserModalOpen,
  setBlockUserModalOpen,
  removeConnectionModalOpen,
  setRemoveConnectionModalOpen,
  isReporting,
  isReportingError,
  onBlock,
  isBlocking,
  isBlockingError,
  onFollow,
  isHandlingFollow,
  isHandlingFollowError,
  onRemoveConnection,
  isRemovingConnection,
  isRemovingConnectionError,
  onSendMessageRequest,
  isSendingMessageRequest,
}) {
  return (
    <div>
      <main className="flex flex-col lg:flex-row gap-10 p-8 lg:px-32 bg-background">
        <section className="md:flex-[3_1_0]">
          <ProfileHeader
            onCopy={onCopy}
            onEmail={onEmail}
            copied={copied}
            userProfile={userProfile}
            isMyProfile={isMyProfile}
            fullscreenImage={fullscreenImage}
            setHoverCover={setHoverCover}
            setHoverProfile={setHoverProfile}
            openFullscreen={openFullscreen}
            closeFullscreen={closeFullscreen}
            onReport={onReport}
            reportState={reportState}
            reportUserModalOpen={reportUserModalOpen}
            setReportUserModalOpen={setReportUserModalOpen}
            reportType={reportType}
            setReportType={setReportType}
            reportText={reportText}
            blockUserModalOpen={blockUserModalOpen}
            setBlockUserModalOpen={setBlockUserModalOpen}
            removeConnectionModalOpen={removeConnectionModalOpen}
            setRemoveConnectionModalOpen={setRemoveConnectionModalOpen}
            setReportText={setReportText}
            isReporting={isReporting}
            isReportingError={isReportingError}
            navigateTo={navigateTo}
            onBlock={onBlock}
            isBlocking={isBlocking}
            isBlockingError={isBlockingError}
            onFollow={onFollow}
            isHandlingFollow={isHandlingFollow}
            isHandlingFollowError={isHandlingFollowError}
            onRemoveConnection={onRemoveConnection}
            isRemovingConnection={isRemovingConnection}
            isRemovingConnectionError={isRemovingConnectionError}
            onSendMessageRequest={onSendMessageRequest}
            isSendingMessageRequest={isSendingMessageRequest}
          />
          {!userProfile?.isBlocked && <PostsContainer username={userProfile.username} />}
          <About about={userProfile.about} isMyProfile={isMyProfile} />
          <ExperienceContainer experience={userProfile.experience} />
          <EducationContainer education={userProfile.education} />
          <CertificationsContainer
            certifications={userProfile.certifications}
          />
          <Skills skills={userProfile.skills} isMyProfile={isMyProfile} />
        </section>
        
        {/* 
          Sidebar Section - Right column of the profile page
          
          This section contains:
          1. Profile management tools (only visible on user's own profile)
          2. Network recommendations (people also viewed & people you may know)
          3. Footer with site information and links
          
          The sidebar is hidden on mobile devices and shown on medium screens and larger.
        */}
        <section className="hidden md:block flex-1 rounded-2xl space-y-2">
          {/* Profile management tools - Only visible to the profile owner */}
          {isMyProfile && (
            <>
              {/* URL customization component */}
              <ChangeURL userInfo={userProfile} />
              {/* Profile completion indicator */}
              <ProfileStrength profileStrength={profileStrength} />
            </>
          )}
          
          {/* 
            Network recommendations - Shows profiles similar users have viewed
            Helps users discover relevant professional connections
          */}
          <SuggestedUsersContainer
            title="People Also Viewed"
            username={userProfile?.username}
            fetchFunction={fetchPeopleAlsoViewed}
            navigateTo={navigateTo}
            helperFunction={changeRelations}
          />
          
          {/* 
            Connection suggestions - Shows potential connection recommendations
            Based on the user's network, industry, and other profile attributes
          */}
          <SuggestedUsersContainer
            title="People You May Know"
            username={userProfile?.username}
            fetchFunction={fetchPeopleYouMayKnow}
            navigateTo={navigateTo}
            helperFunction={changeRelations}
          />
          <Footer />
        </section>
      </main>
    </div>
  );
}
