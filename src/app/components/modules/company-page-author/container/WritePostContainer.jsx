"use client";
import { useState, useRef} from "react";
import WritePost from "../presentation/WritePost";
import { Modal, Box, Button, Typography } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from "@tanstack/react-query";


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
    const [isModalOpen, setModalOpen] = useState(false);
    const [articleText, setArticleText] = useState("");
    const imageInputRef = useRef(null);
    const videoInputRef = useRef(null);
    
    const imageUpload = (e) => {
        const selectedFile=e.target.files[0];
        console.log("Image selected", e.target.files[0]);
        if (selectedFile && selectedFile.type.startsWith("image/")){
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const triggerFileInput = (fileType) => {
        if (fileType === "image") imageInputRef.current?.click();
    };

    const handleSubmit = async() => {
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
        console.log(formData);
        onPostSubmit(formData);
    };

    const handleArticle = () => {
        if (!articleText.trim()) return; 
        const newArticle = {
            text: articleText,
            media:null,
            timePosted: new Date().toISOString(),
            tags:[],
            keywords:[],
            isArticle: true,
        };
        onPostSubmit(newArticle); 
        setArticleText(""); 
        setModalOpen(false); 
    };
    return(
        <div className="max-w-2xl mx-auto mb-10">
            <WritePost company={company} text={text} setText={setText} onImageUpload={imageUpload} preview={preview} triggerFileInput={triggerFileInput}
            imageInputRef={imageInputRef} onSubmit={handleSubmit} 
            logo={logo} openArticleModal={() => setModalOpen(true)}/>
            <Modal open={isModalOpen} onClose={() => setModalOpen(false)}>
            <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    bgcolor: "var(--background)",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: "left"
                }}>
                <div className="text-text flex items-center justify-between border-b">
                    <Typography variant="h6" className="text-lg font-semibold">Write an article</Typography>
                    <Button  className="cursor-pointer" onClick={() => setModalOpen(false)} ><CloseIcon className="text-white"/></Button>
                </div>
                <div>
                    <textarea className="w-full border rounded-lg p-2 mt-2 text-white" placeholder="Start writing your article..." rows="5" value={articleText} onChange={(e) => setArticleText(e.target.value)}/>
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={() => setModalOpen(false)} variant="outlined" sx={{color: "var(--secondary)"}}>Cancel</Button>
                    <Button onClick={handleArticle} sx={{background: "var(--secondary)", ml:2}} variant="contained">
                        Publish
                    </Button>
                </div>

            </Box>
            </Modal>
        </div>
    );

}
export default WritePostContainer;