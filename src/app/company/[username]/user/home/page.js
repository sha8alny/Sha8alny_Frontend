"use client";
import { useParams } from "next/navigation";
import HomeContainer from "@/app/components/modules/company-page-user/container/HomeContainer";

export default function HomePage(){
    const { username } = useParams();
    return(
        <div>
            <HomeContainer username={username} />
        </div>
    );
}