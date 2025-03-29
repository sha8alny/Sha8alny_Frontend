"use client"
import { useState } from "react";
import { useRef } from "react";
import SideBarContainer from "./SideBarContainer";
import Analytics from "../presentation/Analytics";
import EditPageContainer from "./EditPageContainer";
/**
 * @namespace company-page-author
 * @module company-page-author
 */
/**
 * EditContainer manages the layout and functionality for editing a company's profile.
 * It includes a sidebar, an edit form, and analytics. The component also handles logo uploads.
 *
 * @component
 * @returns {JSX.Element} The rendered EditContainer component.
 */

function EditContainer({username, logo}){
    const [logoPreview, setLogoPreview] = useState(logo ||null);
    const logoInputRef = useRef(null);
    const logoUpload = (e) => {
        const selectedFile=e.target.files[0];
        if (selectedFile){
            setLogoPreview(prev => URL.createObjectURL(selectedFile));
        }
    };

    return(
        <div className="flex">
            <SideBarContainer username={username} logoPreview={logoPreview} logoInputRef={logoInputRef} logoUpload={logoUpload} />
            <main className="">
                <EditPageContainer username={username} logoPreview={logoPreview}/>
            </main>
            <Analytics/>
        </div>
    );
}
export default EditContainer;