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
