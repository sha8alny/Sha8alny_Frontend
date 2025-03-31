import ProfileCard from "@/app/components/layout/ProfileCard";
import QuickAccess from "@/app/components/layout/QuickAccess";
import TryPremium from "@/app/components/layout/TryPremium";

function SidebarPresentation({ sideBar, navigateTo }) {
  return (
    <aside>
      <ProfileCard userInfo={sideBar} navigateTo={navigateTo} />
      <QuickAccess navigateTo={navigateTo} />
      {!sideBar?.isPremium && <TryPremium />}
      
    </aside>
  );
}

function SidebarPresentationSkeleton({ isLoading }) {
  return (
    <div className="sidebar-skeleton">
      <div className="sidebar-skeleton-content">
        {isLoading ? "Loading..." : "No data available"}
      </div>
    </div>
  );
}

export { SidebarPresentationSkeleton };

export default SidebarPresentation;
