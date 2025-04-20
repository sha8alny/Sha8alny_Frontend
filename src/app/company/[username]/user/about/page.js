"use client";
import { useParams } from "next/navigation";
import AboutContainer from "@/app/components/modules/company-page-user/container/AboutContainer";
function AboutPage(){
    const { username } = useParams();
    return(
        <div>
            <AboutContainer username={username} />
        </div>
    );
}

export default AboutPage;