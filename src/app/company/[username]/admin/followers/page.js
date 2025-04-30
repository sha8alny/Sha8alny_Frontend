"use client";
import { useParams } from "next/navigation";
import FollowersListContainer from "@/app/components/modules/company-page-author/container/FollowersListContainer";

export default function FollowersCompanyPage(){
    const { username } = useParams();
    return(
        <div className="space-y-6">
            <FollowersListContainer username={username}/>
        </div>
    );
}