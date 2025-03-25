"use client";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import EditContainer from "@/app/components/modules/company-page-author/container/EditContainer";

function EditCompanyPage(){
    const { username } = useParams();
    const searchParams = useSearchParams();
    const logo = searchParams.get("logo");
    return(
        <div>
            <EditContainer username={username} logo={logo}/> 
        </div>
    );
}

export default EditCompanyPage;