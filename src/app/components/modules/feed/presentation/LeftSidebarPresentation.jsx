import ProfileCard from "@/app/components/layout/ProfileCard";
import QuickAccess from "@/app/components/layout/QuickAccess";
import Stats from "@/app/components/layout/Stats";
import TryPremium from "@/app/components/layout/TryPremium";
import Container from "@/app/components/layout/Container";
import { LocationCity } from "@mui/icons-material";

function LeftSidebarPresentation({
  sideBar,
  navigateTo,
  trackedStats,
  determineStat,
}) {
  return (
    <aside className="w-full flex flex-col gap-2 drop-shadow-sm">
      <ProfileCard userInfo={sideBar} navigateTo={navigateTo} />
      <QuickAccess navigateTo={navigateTo} />
      {!sideBar?.isPremium && <TryPremium navigateTo={navigateTo} />}
      <Stats
        isPremium={sideBar?.isPremium}
        trackedStats={trackedStats}
        determineStat={determineStat}
      />
    </aside>
  );
}

function LeftSidebarPresentationSkeleton({ isLoading = true }) {
  return (
    <aside className="w-full flex flex-col gap-2">
      {/* Profile Card Skeleton */}
        <Container className="w-full dark:border dark:border-[#111] rounded-2xl shadow-lg">
        <div className="relative w-full flex">
          <div className="absolute top-0 left-0 w-full h-20 bg-gray-700 dark:bg-gray-500 rounded-t-xl"/>
          <div className="w-16 h-16 z-10 ml-4 bg-gray-500 dark:bg-gray-300 rounded-full border-2 border-gray-400 mt-10"/>
        </div>
        <div className="px-4 pt-1 flex flex-col pb-4">
          <div className={`${isLoading && "animate-pulse"} h-6 w-32 bg-primary/60 rounded mb-2`}/>
          <div className={`${isLoading && "animate-pulse"} mb-2 bg-primary/60 w-36 h-4 rounded`}/>
          <div className={`${isLoading && "animate-pulse"} w-60 h-3 rounded bg-primary/60`}/>
        </div>
          </Container>

        {/* Quick Access Skeleton */}
      <Container className="p-4 w-full border-[#111] border shadow-lg flex flex-col gap-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div className={`${isLoading && "animate-pulse"} bg-primary/60 h-4 w-3/4 rounded`} />
          </div>
        ))}
      </Container>

      {/* Stats Skeleton */}
      <Container className="flex flex-col w-full border-[#111] border shadow-sm p-4">
        <div className={`${isLoading && "animate-pulse"} bg-primary/60 h-6 w-3/4 rounded mb-4`}></div>
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center mb-2">
            <div className={`${isLoading && "animate-pulse"} bg-primary/60 h-5 w-[90%] rounded mr-2`}/>
          </div>
        ))}
      </Container>
    </aside>
  );
}

export { LeftSidebarPresentationSkeleton };

export default LeftSidebarPresentation;
