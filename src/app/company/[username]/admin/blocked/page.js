"use client";
import { useParams } from "next/navigation";
import BlockedFollowersContainer from "@/app/components/modules/company-page-author/container/BlockedFollowersContainer";

export default function BlockedFollowersPage(){
    const { username } = useParams();
    return(
        <div className="space-y-6">
            <BlockedFollowersContainer companyUsername={username}/>
        </div>
    );
}