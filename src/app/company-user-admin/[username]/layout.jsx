"use client";
import Navbar from "@/app/components/layout/NavBar";
import SuggestedPagesContainer from "@/app/components/modules/company-page-user/container/SuggestedPagesContainer";
import ProfileHeaderContainer from "@/app/components/modules/company-page-user/container/ProfileHeaderContainer";
import Footer from "@/app/components/layout/Footer";
import { useParams } from "next/navigation";
export default function CompanyUserAdminLayout({children}){
    const { username } = useParams();
    return(
        <div>
            <div className="sticky top-0 z-50">
                <header>
                    <Navbar />
                </header>
            </div>
            <div className="flex flex-1 font-sans">
                <div className="w-full p-4">
                    <ProfileHeaderContainer userProfile={username}/>
                    <main className="flex-1 overflow-auto mt-4">
                        {children}
                    </main>
                </div>
                <div className="p-4">
                    <SuggestedPagesContainer title="Pages people also viewed"/>
                    <Footer/>
                </div>
            </div>
        </div>
    );
}