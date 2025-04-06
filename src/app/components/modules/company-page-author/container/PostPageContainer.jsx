"use client";
import { useState } from "react";
import WritePostContainer from "./WritePostContainer";
import { createPost } from "@/app/services/post";
import { getCompanyId } from "@/app/services/companyManagment";
import { Post } from "./PostContainer";

function PostPageContainer({ username, logo }) {
    const [posts, setPosts] = useState([]); 

    const handlePostSubmit = async (newPost) => {
        try {
            const {companyId} = await getCompanyId(username);
            const createdPost = await createPost(newPost, companyId);
            if (createdPost.message === "Post created successfully") {
                const createdPost = {
                    ...newPost, 
                    id: Date.now(), 
                    likes: 0, 
                    reposts: 0, 
                    comments: [], 
                    views: 0, 
                    logo: logo,
                };
                console.log("Post after adding logo:", createdPost); 
                setPosts((prevPosts) => [createdPost, ...prevPosts]);
            }
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };

    return (
        <div>
            <WritePostContainer onPostSubmit={handlePostSubmit} logo={logo} />
            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <Post username ={username} logo={logo} key={post.id || `post-${index}`} cardInfo={{ ...post, username, logo, hasMedia: !!(post.image || post.video),
                        description: post.text || "No content",}} />
                    ))
                ) : (
                    <p className="flex justify-center mt-2 text-gray-400">No posts available</p>
                )}
            </div>
        </div>
    );
}

export default PostPageContainer;
