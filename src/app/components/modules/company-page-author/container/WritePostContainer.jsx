"use client";
import { useState, useRef} from "react";
import WritePost from "../presentation/WritePost";


/**
 * @namespace company-page-author
 * @module company-page-author
 */
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

function WritePostContainer({company, onPostSubmit, logo}){
    const [text, setText] = useState("");
    const [preview, setPreview]= useState(null);
    const [tags, setTags]= useState([]);
    const [taggedUsers, setTaggedUsers]= useState([]);
    const [images, setImages]= useState([]);
    const [videos, setVideos]= useState(null);
    const [error, setError]= useState(null);
    const [file, setFile]= useState(null);
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    
    const imageUpload = (e) => {
        const selectedFile=e.target.files[0];
        console.log("Image selected", e.target.files[0]);
        if (selectedFile && selectedFile.type.startsWith("image/")){
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setImages([selectedFile]);
        }
    };

    const videoUpload = (e) => {
        const selectedFile=e.target.files[0];
        console.log("video selected", e.target.files[0]);
        if (selectedFile && selectedFile.type.startsWith("video/")) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setVideos([selectedFile]);
        }
    }

    const triggerFileInput = (fileType) => {
        if (fileType === "image") imageInputRef.current?.click();
        if (fileType === "video") videoInputRef.current?.click();
    };

    const handleSubmit = async() => {
        console.log("Videos:", videos);
        if (text.trim() === "" && images.length === 0 && !videos) {
            setError("Please add text or media to your post.");
            return;
        }
        setError(null);
        const formData = new FormData();
        formData.append("text", text);
        formData.append("keywords", tags);
        formData.append("tags", taggedUsers);
        if (images.length > 0) {
        images.forEach((image) => {
            formData.append("media", image);
        });
        }
        if (videos) {
            formData.append("media", videos);
        }  
        onPostSubmit(formData);
    };
    return(
        <div className="max-w-2xl mx-auto mb-10">
            <WritePost company={company} text={text} setText={setText} onImageUpload={imageUpload} preview={preview} triggerFileInput={triggerFileInput}
            imageInputRef={imageInputRef}  videoUpload={videoUpload} videoInputRef={videoInputRef} onSubmit={handleSubmit} 
            logo={logo}/>
        </div>
    );

}
export default WritePostContainer;