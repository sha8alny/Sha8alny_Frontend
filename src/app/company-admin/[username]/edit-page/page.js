"use client";
import { useParams } from "next/navigation";
import EditContainer from "@/app/components/modules/company-page-author/container/EditContainer";

function EditCompanyPage(){
    const { username } = useParams();
    return(
        <div className="space-y-6">
            <EditContainer username={username}/>
        </div>
    );
}

export default EditCompanyPage;