"use client";
import { useState, useRef} from "react";
import { useEffect } from "react";
import SideBarContainer from "./SideBarContainer";
import PostContainer from "./PostContainer";
import WritePostContainer from "./WritePostContainer";
import Analytics from "../presentation/Analytics";
import { createPost } from "@/app/services/post";

/**
 * PostPageContainer Component
 * 
 * This component serves as the main container for the post page, integrating 
 * the sidebar, post creation, post display, and analytics.
 * 
 * @component
 * @returns {JSX.Element} - Rendered PostPageContainer component.
 */

/**
 * Handles post submission by calling the createPost service and updating the posts state.
 * 
 * @param {Object} newPost - The new post object to be created.
 */


function PostPageContainer({username, logo}){
    const [logoPreview, setLogoPreview] = useState(logo || null);
    const logoInputRef = useRef(null);
    const [posts, setPosts] = useState([]); 

    useEffect(() => {
        if (logo) {
            setLogoPreview(logo);
        }
    }, [logo]);

    const logoUpload = (e) => {
        const selectedFile=e.target.files[0];
        if (selectedFile){
            const newLogoURL = URL.createObjectURL(selectedFile); 
            setLogoPreview(newLogoURL);
        }
    };
    
    const handlePostSubmit = async (newPost) => {
        try {
            const createdPost = await createPost(newPost);
            if (createdPost) {
                setPosts((prevPosts) => [...(prevPosts || []), createdPost]);
            }
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };
    return(
        <div className="flex flex-row min-h-screen gap-x-24">
            <SideBarContainer username={username} logoPreview={logoPreview} logoInputRef={logoInputRef} logoUpload={logoUpload} />
            <main>
                <div>
                    <WritePostContainer onPostSubmit={handlePostSubmit} logoPreview={logoPreview}/>
                    <PostContainer username={username} followers="7,472,293" posts={posts} logoPreview={logoPreview}/>
                </div>
            </main>
            <Analytics/>
        </div>
    );
}
export default PostPageContainer;
