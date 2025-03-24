"use client";
import { useState, useRef} from "react";
import WritePost from "../presentation/WritePost";


/**
 * A container component for handling post creation, including text input and image upload.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onPostSubmit - Callback function to handle post submission
 * @param {string} props.logoPreview - URL of the logo preview image
 * @returns {JSX.Element} The WritePostContainer component
 */

/** @state {string} text - The text content of the post */
/** @state {string|null} preview - URL for the image preview */
/** @state {string|null} file - Name of the selected file */
/** @ref {Object} fileInputRef - Reference to the hidden file input element */

/**
 * Handles file selection and sets preview image.
 * 
 * @param {Event} e - The file input change event
 */

/**
 * Triggers the hidden file input when the user clicks on the upload button.
 */

/**
 * Handles post submission. Prevents empty posts from being submitted.
 */

function WritePostContainer({onPostSubmit, logoPreview}){
    const [text, setText] = useState(""); // State for post text
    const [preview, setPreview]= useState(null);
    const [file, setFile]= useState(null);
    const fileInputRef = useRef(null);
    
    const fileUpload = (e) => {
        const selectedFile=e.target.files[0];
        if (selectedFile){
            setFile(selectedFile.name);
            setPreview(URL.createObjectURL(selectedFile))
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = () => {
        if (!text.trim() && !file) return; 
        const newPost = {
            text,
            imageUrl: preview,
        };
        onPostSubmit(newPost); 
        setText("");
        setPreview(null);
        setFile(null);
    };
    return(
        <div>
            <WritePost text={text} setText={setText} onChange={fileUpload} preview={preview} triggerFileInput={triggerFileInput}
            fileInputRef={fileInputRef} onSubmit={handleSubmit} logoPreview={logoPreview}/>
        </div>
    );

}
export default WritePostContainer;