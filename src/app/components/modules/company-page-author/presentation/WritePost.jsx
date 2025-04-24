/**
 * @namespace company-page-author
 * @module company-page-author
 */
"use client";
import {
  AccessTimeOutlined,
  ImageOutlined,
  LocalOfferOutlined,
  PersonAddOutlined,
  VideocamOutlined,
} from "@mui/icons-material";
import { Maximize2 } from "lucide-react";

function WritePost({company, text, setText,onImageUpload,videoUpload, preview, triggerFileInput,imageInputRef, videoInputRef, onSubmit}) {
  return (
    <div className="text-text">
        <div className="bg-[var(--foreground)] border rounded-lg p-4">
            <div className="flex items-center gap-4">
                {company?.logo ? (
                        <img 
                            src={company?.logo} 
                            alt="company-logo" 
                            className="rounded-full w-14 h-14 object-cover" 
                        />
                    ) : (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                            <Maximize2 className="text-white" size={18} />
                        </div>
                    </div>
                    )
                }
                <textarea className="flex-grow rounded-lg p-2 border border-[var(--background)] " placeholder="Start a post" value={text} onChange={(e)=>setText(e.target.value)}></textarea>
            </div>
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
                    <div className="relative group" onClick={()=>triggerFileInput("image")} data-testid="upload-tags-button">
                        <LocalOfferOutlined className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-[var(--text)] text-xs transition-opacity duration-200 "> Upload tags</span>
                    </div>
                </div>

                <div htmlFor="upload-tags" className="relative group">
                    <div className="relative group" onClick={()=>triggerFileInput("image")} data-testid="upload-tags-button">
                        <AccessTimeOutlined className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-[var(--text)] text-xs transition-opacity duration-200 "> idk</span>
                    </div>
                </div>
                
                <div htmlFor="upload-tags" className="relative group">
                    <div className="relative group" onClick={()=>triggerFileInput("image")} data-testid="upload-tags-button">
                        <PersonAddOutlined className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-[var(--text)] text-xs transition-opacity duration-200 "> idk</span>
                    </div>
                </div>
                
                <button className={`bg-[var(--secondary)] rounded-full cursor-pointer py-1 px-4 mt-2 transition-opacity ${!text.trim() && !preview ? "opacity-50 cursor-not-allowed" : "" }`} onClick={onSubmit} disabled={!text.trim() && !preview}
                data-testid="post-button">
                    Post
                </button>
            </div>
            {/*Filters*/}
        </div>
        <div className="mt-4 w-full overflow-x-auto scrollbar-hide">
            <div className="flex justify-between space-x-2 min-w-max pb-2">
                <button className="border border-[var(--secondary)] text-[var(--secondary)] bg-[var(--foreground)] rounded-full cursor-pointer py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 whitespace-nowrap" data-testid="page-posts-button">
                    Page Posts
                </button>
                <button className="border border-[var(--secondary)] text-[var(--secondary)] bg-[var(--foreground)] rounded-full cursor-pointer py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 whitespace-nowrap"  data-testid="following-button">
                    Following
                </button>
                <button className="border border-[var(--secondary)] text-[var(--secondary)] bg-[var(--foreground)] rounded-full cursor-pointer py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 whitespace-nowrap" data-testid="employee-posts-button">
                    Employee Posts
                </button>
                <button className="border border-[var(--secondary)] text-[var(--secondary)] bg-[var(--foreground)] rounded-full cursor-pointer py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 whitespace-nowrap" data-testid="hashtags-button">
                    Hashtags
                </button>
            </div>
        </div>
    </div>
  );
}
export default WritePost;