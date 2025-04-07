"use client";
import { useRouter } from "next/navigation";
import Dashboard from "../presentation/Dashboard";

export default function DashboardContainer({username}){
    const router = useRouter();
    const goToPostsPage=()=>{
        router.push(`/company-admin/${username}/posts-page`);
    }
    return(
        <div>
            <Dashboard username={username} goToPostsPage={goToPostsPage}/>
        </div>
    );
}