import Footer from "@/app/components/layout/Footer";
import SuggestedUsersContainer from "../../profile/container/SuggestedUsersContainer";
import TrendingTopicsContainer from "../container/TrendingTopicsContainer";
import { fetchPeopleYouMayKnow } from "@/app/services/connectionManagement";

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
