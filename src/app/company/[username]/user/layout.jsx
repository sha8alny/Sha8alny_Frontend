"use client";
import SuggestedPagesContainer from "@/app/components/modules/company-page-user/container/SuggestedPagesContainer";
import ProfileHeaderContainer from "@/app/components/modules/company-page-user/container/ProfileHeaderContainer";
import Footer from "@/app/components/layout/Footer";
import { useParams } from "next/navigation";
export default function CompanyUserAdminLayout({children}){
    const { username } = useParams();
    return(
        <div>
            <div className="flex flex-1 font-sans">
                <div className="w-280 2xl:w-350 p-4">
                    <ProfileHeaderContainer username={username}/>
                    <main className="flex-1 overflow-auto mt-4">
                        {children}
                    </main>
                </div>
                <div className="p-4 w-100 2xl:w-150">
                    <SuggestedPagesContainer username={username} title="Pages people also viewed"/>
                    <Footer/>
                </div>
            </div>
        </div>
    );
}