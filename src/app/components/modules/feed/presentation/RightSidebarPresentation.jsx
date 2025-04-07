import Footer from "@/app/components/layout/Footer";
import SuggestedUsersContainer from "../../profile/container/SuggestedUsersContainer";
import TrendingTopicsContainer from "../container/TrendingTopicsContainer";

function RightSidebarPresentation() {
  return (
    <aside className="w-full flex flex-col gap-2">
      <TrendingTopicsContainer />
      <SuggestedUsersContainer title="People You May Know" />
      <Footer />
    </aside>
  );
}

export default RightSidebarPresentation;