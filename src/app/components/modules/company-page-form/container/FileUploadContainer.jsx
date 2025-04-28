"use client";
import { useState } from "react";
import { useEffect } from "react";
import FileUpload from "../presentation/FileUpload";

/**
 * @namespace company-page-form
 * @module company-page-form
 */
/**
 * FileUploadContainer handles the logic for uploading a file.
 * It updates the parent component's state with the selected file name.
 *
 * @component
 * @param {Object} props - Component props
 * @param {string} props.file - The name of the uploaded file
 * @param {Function} props.setFile - Function to update the file state in the parent component
 * @returns {JSX.Element} The rendered FileUploadContainer component
 */

export default function FileUploadContainer({file, setFile}){
    const [preview, setPreview]= useState(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
        }
    }, [file]);
    
    const fileUpload = (e) => {
        const selectedFile=e.target.files[0];
        if (selectedFile){
          setFile(selectedFile);
          setPreview(URL.createObjectURL(selectedFile))
        }
    };

    const removeFile = ()=>{
        setFile(null);
        setPreview(null);
    }

    return (
        <div>
            <FileUpload onChange={fileUpload} preview={preview} file={file} onRemove={removeFile}/>
        </div>
    );
}