"use client"
import { useState } from "react";
import { useParams } from "next/navigation";
import { useRef } from "react";
import { useEffect } from "react";
import SideBarContainer from "./SideBarContainer";
import Analytics from "../presentation/Analytics";
import EditPageContainer from "./EditPageContainer";
/**
 * EditContainer manages the layout and functionality for editing a company's profile.
 * It includes a sidebar, an edit form, and analytics. The component also handles logo uploads.
 *
 * @component
 * @returns {JSX.Element} The rendered EditContainer component.
 */

function EditContainer(){
    const [logoPreview, setLogoPreview] = useState(null);
    const logoInputRef = useRef(null);
    const { username } = useParams();
    const logoUpload = (e) => {
        const selectedFile=e.target.files[0];
        if (selectedFile){
            setLogoPreview(prev => URL.createObjectURL(selectedFile));
            console.log("Current logoPreview:", logoPreview);

        }
    };
    useEffect(() => {
        if (username) {
            setResolvedUsername(username);
        }
    }, [username]);

    return(
        <div className="flex">
            <SideBarContainer username={username} logoPreview={logoPreview} logoInputRef={logoInputRef} logoUpload={logoUpload} />
            <main className="">
                <EditPageContainer logoPreview={logoPreview}/>
            </main>
            <Analytics/>
        </div>
    );
}
export default EditContainer;