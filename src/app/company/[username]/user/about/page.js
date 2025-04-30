"use client";
import { useParams } from "next/navigation";
import AboutContainer from "@/app/components/modules/company-page-user/container/AboutContainer";

export default function AboutPage(){
    const { username } = useParams();
    return(
        <div>
            <AboutContainer username={username} />
        </div>
    );
}
