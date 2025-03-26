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

export function ProfileSkeleton() {}

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
}) {
  return (
    <div>
      <main className="flex gap-2 p-8 bg-foreground">
        <section className="flex-[3_1_0]">
          <ProfileHeader userProfile={userProfile} isMyProfile={isMyProfile}/>
          <About about={userProfile.about} isMyProfile={isMyProfile}/>
          <ExperienceContainer experience={userProfile.experience} />
          <EducationContainer education={userProfile.education} />
          <Skills skills={userProfile.skills} isMyProfile={isMyProfile} />
          <CertificationsContainer
            certifications={userProfile.certifications}
          />
        </section>
        <section className="flex-1 rounded-3xl space-y-2">
          {isMyProfile && (
            <>
              <ChangeURL username={userProfile.username} />
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
