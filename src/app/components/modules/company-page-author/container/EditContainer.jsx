"use client"
import EditPageContainer from "./EditPageContainer";

/**
 * @namespace EditContainerComponents
 */

/**
 * EditContainer component serves as a wrapper around the EditPageContainer, passing down the username prop.
 * It allows users to edit their company details by displaying the EditPageContainer component.
 * @component
 * @param {Object} props - The props for the EditContainer component.
 * @param {string} props.username - The username of the company whose details are to be edited.
 * 
 * @returns {JSX.Element} The rendered EditContainer component, which wraps EditPageContainer.
 */

export default function EditContainer({username }){
    return(
        <div> 
            <EditPageContainer username={username} />
        </div>
    );
}