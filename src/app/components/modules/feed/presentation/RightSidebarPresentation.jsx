import Footer from "@/app/components/layout/Footer";
import SuggestedUsersContainer from "../../profile/container/SuggestedUsersContainer";
import TrendingTopicsContainer from "../container/TrendingTopicsContainer";
import { fetchPeopleYouMayKnow } from "@/app/services/connectionManagement";

/**
 * RightSidebarPresentation - Right sidebar for feed pages with supplemental content
 * 
 * This component organizes and displays auxiliary content alongside the main feed:
 * - Trending topics section showing popular hashtags
 * - Connection suggestions to help build the user's network
 * - Footer with site information and links
 * 
 * Together these elements provide additional engagement opportunities
 * beyond the main content feed.
 * 
 * @param {Object} props - Component props
 * @param {Function} props.navigateTo - Navigation handler for routing
 * @returns {JSX.Element} Right sidebar with trending topics, suggestions, and footer
 */
function RightSidebarPresentation({ navigateTo }) {
  return (
    <aside
      className="w-full flex flex-col gap-2"
      data-testid="right-sidebar-root"
    >
      <TrendingTopicsContainer />
      <SuggestedUsersContainer
        title="People You May Know"
        fetchFunction={fetchPeopleYouMayKnow}
        navigateTo={navigateTo}
      />
      <Footer />
    </aside>
  );
}

export default RightSidebarPresentation;
