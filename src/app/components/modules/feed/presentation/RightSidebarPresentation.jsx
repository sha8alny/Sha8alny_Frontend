import Footer from "@/app/components/layout/Footer";
import SuggestedUsersContainer from "../../profile/container/SuggestedUsersContainer";
import TrendingTopicsContainer from "../container/TrendingTopicsContainer";
import { fetchPeopleYouMayKnow } from "@/app/services/connectionManagement";

function RightSidebarPresentation({
  navigateTo,
  helperFunction,
}) {
  return (
    <aside className="w-full flex flex-col gap-2">
      <TrendingTopicsContainer />
      <SuggestedUsersContainer
        title="People You May Know"
        fetchFunction={fetchPeopleYouMayKnow}
        helperFunction={helperFunction}
        navigateTo={navigateTo}
      />
      <Footer />
    </aside>
  );
}

export default RightSidebarPresentation;
