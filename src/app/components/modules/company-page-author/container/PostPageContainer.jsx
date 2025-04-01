"use client";
import { useState } from "react";
import WritePostContainer from "./WritePostContainer";
import { createPost } from "@/app/services/post";
import { Post } from "./PostContainer";

function PostPageContainer({ username, logo }) {
    const [posts, setPosts] = useState([]); 

    const handlePostSubmit = async (newPost) => {
        try {
            const createdPost = await createPost(newPost);
            if (createdPost) {
                setPosts((prevPosts) => [newPost, ...prevPosts]);
            }
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };

    return (
        <div>
            <WritePostContainer onPostSubmit={handlePostSubmit} logoPreview={logo} />
            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <Post username ={username} logoPreview={logo} key={post.id || `post-${index}`} cardInfo={{ ...post, username, logo, hasMedia: !!(post.image || post.video) }} />
                    ))
                ) : (
                    <p className="flex justify-center mt-2 text-gray-400">No posts available</p>
                )}
            </div>
        </div>
    );
}

export default PostPageContainer;
