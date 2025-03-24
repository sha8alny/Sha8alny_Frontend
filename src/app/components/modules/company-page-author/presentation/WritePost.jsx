"use client";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';

function WritePost({text, setText,onImageUpload, onVideoUpload, preview, triggerFileInput,imageInputRef,videoInputRef,onSubmit, logoPreview, openArticleModal}) {
  return (
    <div className="text-text">
        <div className="w-145 mt-5 border border-[var(--secondary)] rounded-lg p-4">
            <div className="flex items-center gap-4">
                {logoPreview ? (
                        <img 
                            src={logoPreview} 
                            alt="company-logo" 
                            className="rounded-full w-14 h-14 object-cover" 
                        />
                    ) : (
                        <ImageOutlinedIcon style={{ fontSize: "56px", color: "gray" }} />
                    )
                }
                <textarea className="flex-grow rounded-lg p-2 border border-[var(--foreground)] " placeholder="Start a post" value={text} onChange={(e)=>setText(e.target.value)}></textarea>
            </div>
            {/*Icons for writing a post*/}
            <div className="flex items-center gap-4 mt-4 justify-between">
                <div htmlFor="upload-file" className="relative group">
                    <div className="relative group" onClick={()=>triggerFileInput("image")}>
                        <ImageOutlinedIcon className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-white text-xs transition-opacity duration-200 "> Upload Image</span>
                    </div>
                    <input id="upload-file" data-testid="upload-file" type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" ref={imageInputRef} onChange={onImageUpload}/>
                </div>
                <div htmlFor="upload-video" className="relative group">
                    <div className="relative group" onClick={()=>triggerFileInput("video")}>
                        <SmartDisplayOutlinedIcon className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-white text-xs transition-opacity duration-200 "> Upload video</span>
                    </div>
                    <input id="upload-video" data-testid="upload-video"  type="file" className="hidden" accept="video/mp4, video/mov, video/avi" ref={videoInputRef} onChange={onVideoUpload}/>
                </div>
                <div className="relative group" onClick={openArticleModal} data-testid="write-post-modal">
                    <FeedOutlinedIcon className="cursor-pointer group"/>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-white text-xs transition-opacity duration-200 "> Write Article</span>
                </div>
                <button className={`bg-[var(--secondary)] text-[var(--background)] rounded-full cursor-pointer py-1 px-4 mt-2 transition-opacity ${!text.trim() && !preview ? "opacity-50 cursor-not-allowed" : "" }`} onClick={onSubmit} disabled={!text.trim() && !preview}>
                    Post
                </button>
            </div>
            {/*Filters*/}
        </div>
        <div className="mt-2 flex flex-row justify-between">
        <button className="border border-[var(--secondary)] text-[var(--secondary)] bg-[var(--foreground)] rounded-full cursor-pointer py-2 px-3  mt-2">Page Posts</button>
        <button className="border border-[var(--secondary)] text-[var(--secondary)] bg-[var(--foreground)] rounded-full cursor-pointer py-2 px-3  mt-2">Following</button>
        <button className="border border-[var(--secondary)] text-[var(--secondary)] bg-[var(--foreground)] rounded-full cursor-pointer py-2 px-3  mt-2">Employee Posts</button>
        <button className="border border-[var(--secondary)] text-[var(--secondary)] bg-[var(--foreground)] rounded-full cursor-pointer py-2 px-3  mt-2">Hashtags</button>
        </div>
    </div>
  );
}
export default WritePost;