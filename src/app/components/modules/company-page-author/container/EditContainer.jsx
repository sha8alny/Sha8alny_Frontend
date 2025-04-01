"use client"
import { useState } from "react";
import { useRef } from "react";
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

function EditContainer({username}){
    return(
        <div> 
            <EditPageContainer username={username} />
        </div>
    );
}
export default EditContainer;