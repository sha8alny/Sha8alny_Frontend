"use client";
import { useParams } from "next/navigation";
import SideBarContainer from "../../components/modules/company-page-author/container/SideBarContainer";
import Analytics from "../../components/modules/company-page-author/presentation/Analytics";
export default function CompanyPageAuthor() 
{
  const { slug } = useParams();
  return (
    <div className="flex flex-row">
      <SideBarContainer username={slug}/>
      <main className="w-145">
      </main>
      <Analytics className="justify-end"/>
    </div>
  );
}
