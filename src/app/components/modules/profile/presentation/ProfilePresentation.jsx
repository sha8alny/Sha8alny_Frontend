import Footer from "@/app/components/layout/Footer";
import SuggestedUsersContainer from "../container/SuggestedUsersContainer";
import About from "./About";
import ProfileStrength from "./ProfileStrength";
import ProfileHeader from "./ProfileHeader";
import Skills from "./Skills";
import ChangeURL from "./ChangeURL";
import ExperienceContainer from "../container/ExperienceContainer";
import EducationContainer from "../container/EducationContainer";
import CertificationsContainer from "../container/CertificationsContainer";
import PostsContainer from "../container/PostsContainer";

export function ProfileSkeleton() {}

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
          />
          <PostsContainer username={userProfile.username} />
          <About about={userProfile.about} isMyProfile={isMyProfile} />
          <ExperienceContainer experience={userProfile.experience} />
          <EducationContainer education={userProfile.education} />
          <CertificationsContainer
            certifications={userProfile.certifications}
          />
          <Skills skills={userProfile.skills} isMyProfile={isMyProfile} />
        </section>
        <section className="flex-1 hidden md:block rounded-3xl space-y-2">
          {isMyProfile && (
            <>
              <ChangeURL userInfo={userProfile} />
              <ProfileStrength profileStrength={profileStrength} />
            </>
          )}
          <SuggestedUsersContainer title="People Also Viewed" />
          <SuggestedUsersContainer title="People You May Know" />
          <Footer />
        </section>
      </main>
    </div>
  );
}
