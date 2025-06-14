"use client";
import {
  AccessTimeOutlined,
  ImageOutlined,
  LocalOfferOutlined,
  PersonAddOutlined,
  VideocamOutlined,
} from "@mui/icons-material";
import { Close } from "@mui/icons-material";

/**
 * @namespace WritePost
 * @component
 * 
 * A component that provides a text input area for users to create and submit posts. It includes options to upload images, videos, and tags, as well as buttons for filtering posts based on different categories.
 */
/**
 * WritePost component - A user interface for writing a post, with features to upload media, add tags, and filter posts.
 *
 * @param {WritePost.Props} props - The component's props.
 * @param {Object} props.company - The company data, including logo and information about the company.
 * @param {string} props.text - The current content of the post.
 * @param {Function} props.setText - A function to update the content of the post.
 * @param {Function} props.onImageUpload - A function to handle the image upload.
 * @param {Function} props.videoUpload - A function to handle video upload.
 * @param {boolean} props.preview - A flag indicating whether the post has a preview media.
 * @param {Function} props.triggerFileInput - A function to trigger the file input for media.
 * @param {Object} props.imageInputRef - The ref for the image input.
 * @param {Object} props.videoInputRef - The ref for the video input.
 * @param {Function} props.onSubmit - A function to handle the submission of the post.
 * 
 * @returns {JSX.Element} The rendered WritePost component.
 */
/**
 * @typedef {Object} WritePost.Props
 * @property {Object} company - The company object containing details like the company logo.
 * @property {string} text - The current text value of the post.
 * @property {Function} setText - A function to update the post text.
 * @property {Function} onImageUpload - Function to handle image uploads.
 * @property {Function} videoUpload - Function to handle video uploads.
 * @property {boolean} preview - A flag indicating if there is a media preview.
 * @property {Function} triggerFileInput - Function to trigger the file input for media upload.
 * @property {Object} imageInputRef - A reference to the image input element.
 * @property {Object} videoInputRef - A reference to the video input element.
 * @property {Function} onSubmit - Function to handle the post submission.
 */

export default function WritePost({company, text, setText,onImageUpload,videoUpload, preview, triggerFileInput,imageInputRef, videoInputRef, onSubmit, handleRemoveMedia, fileType}) {
  return (
    <div className="text-text">
        <div className="bg-[var(--foreground)] border rounded-lg p-4">
            <div className="flex items-center gap-4">
                <img 
                    src={company?.logo || "/placeholder.svg"} 
                    alt="company-logo" 
                    className="rounded-full w-14 h-14 object-cover" 
                />
                <textarea className="flex-grow rounded-lg p-2 border border-[var(--background)] resize-none " placeholder="Start a post" value={text} onChange={(e)=>setText(e.target.value)}></textarea>
                {/* Media Preview */}
            </div>
            {preview && (
            <div className="mt-4 relative w-25 h-25">
                {/* Image or Video Preview */}
                {fileType === "image" ? (
                <img
                    src={preview}
                    alt="media-preview"
                    className="w-full h-full object-cover rounded-lg"
                />
                ) : fileType === "video" ? (
                <video
                    src={preview}
                    alt="video-preview"
                    className="w-full h-full object-cover rounded-lg"
                    controls
                />
                ) : null}

                <button
                onClick={handleRemoveMedia}
                className="absolute cursor-pointer top-0 right-0 bg-opacity-60 hover:bg-opacity-80 text-text rounded-full p-1 z-10"
                aria-label="Remove media"
                data-testid="remove-media-button"
                >
                <Close sx={{fontSize:"20px"}} />
                </button>
            </div>
            )}
            {/*Icons for writing a post*/}
            <div className="flex items-center gap-4 mt-4 justify-between">
                <div htmlFor="upload-image" className="relative group">
                    <div className="relative group" onClick={()=>triggerFileInput("image")} data-testid="upload-image-button">
                        <ImageOutlined className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-[var(--text)] text-xs transition-opacity duration-200 "> Upload Image</span>
                    </div>
                    <input id="upload-image" data-testid="upload-image" type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" ref={imageInputRef} onChange={onImageUpload}/>
                </div>

                <div htmlFor="upload-video" className="relative group">
                    <div className="relative group" onClick={()=>triggerFileInput("video")} data-testid="upload-video-button">
                        <VideocamOutlined className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-[var(--text)] text-xs transition-opacity duration-200 "> Upload video</span>
                    </div>
                    <input id="upload-video" data-testid="upload-video" type="file" className="hidden" 
                    accept="video/mp4, video/webm, video/mov, video/avi, video/wmv, video/mkv" ref={videoInputRef} onChange={videoUpload}/>
                </div>

                <div htmlFor="upload-tags" className="relative group">
                    <div className="relative group"  data-testid="upload-tags-button">
                        <LocalOfferOutlined className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-[var(--text)] text-xs transition-opacity duration-200 "> Upload tags</span>
                    </div>
                </div>

                <div htmlFor="upload-tags" className="relative group">
                    <div className="relative group" data-testid="upload-schedulePosts-button">
                        <AccessTimeOutlined className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-[var(--text)] text-xs transition-opacity duration-200 "> Scheduled posts</span>
                    </div>
                </div>
                <button className={`bg-[var(--secondary)] rounded-full cursor-pointer py-1 px-4 mt-2 transition-opacity ${!text.trim() && !preview ? "opacity-50 cursor-not-allowed" : "" }`} onClick={onSubmit} disabled={!text.trim() && !preview}
                data-testid="post-button">
                    Post
                </button>
            </div>
        </div>
    </div>
  );
}