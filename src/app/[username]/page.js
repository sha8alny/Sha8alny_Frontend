"use client";
import { useParams } from "next/navigation";
import SideBarContainer from "../components/modules/company-page-author/container/SideBarContainer";
import Analytics from "../components/modules/company-page-author/presentation/Analytics";
function CompanyPageAuthor() {
  const { username } = useParams();
  return (
    <div className="flex flex-row">
      <SideBarContainer username={username}/>
      <main className="w-145">
      </main>
      <Analytics className="justify-end"/>
    </div>
  );
}

export default CompanyPageAuthor;