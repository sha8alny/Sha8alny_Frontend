"use client";
import { useParams } from "next/navigation";
import EditPageContainer from "../components/modules/company-page-author/container/EditPageContainer";
import Analytics from "../components/modules/company-page-author/presentation/Analytics";
import SideBarContainer from "../components/modules/company-page-author/container/SideBarContainer";

function EditCompanyPage(){
    const { username } = useParams();
    return(
        <div className="flex">
            <SideBarContainer username={username}/>
            <main className="">
                <EditPageContainer/>
            </main>
            <Analytics/>
        </div>
    );
}

export default EditCompanyPage;