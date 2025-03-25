"use client";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import SideBarContainer from "../../components/modules/company-page-author/container/SideBarContainer";
import Analytics from "../../components/modules/company-page-author/presentation/Analytics";

export default function CompanyPageAuthor() 
{
  const { username } = useParams();
  const searchParams = useSearchParams();
  const logo = searchParams.get("logo");
  return (
    <div className="flex flex-row">
      <SideBarContainer username={username} logoPreview={logo}/>
      <main className="w-145">
      </main>
      <Analytics className="justify-end"/>
    </div>
  );
}
