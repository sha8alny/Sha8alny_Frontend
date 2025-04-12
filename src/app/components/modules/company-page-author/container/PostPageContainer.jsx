"use client";
import { useState, useEffect } from "react";
import WritePostContainer from "./WritePostContainer";
import { createPost } from "@/app/services/post";
import { getCompanyId, getCompany} from "@/app/services/companyManagment";
import { Post } from "./PostContainer";
import PostContainer from "../../feed/container/PostContainer";

function PostPageContainer({ username, logo }) {

    const [posts, setPosts] = useState([]); 
    const [company, setCompany] = useState(null);
    const [error, setError] = useState(null);

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
                setPosts((prevPosts) => [createdPost, ...prevPosts]);
            }
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };

    useEffect(() => {
        const fetchCompany = async () => {
        try {
            const data = await getCompany(username);
            setCompany(data);
        } catch (err) {
            setError(err.message);
        }
        };
        if (username) fetchCompany();
    }, [username]);
    return (
        <div>
            <WritePostContainer company={company} onPostSubmit={handlePostSubmit} logo={logo} />
            <div className="space-y-6">
                {posts.length > 0 ? (
                    posts.map((post, index) => (
                        <PostContainer  key={post.id || `post-${index}`} 
                        post={{
                            ...post,
                            postId: post.id, // Ensure postId is included
                            text: post.text || "No content", // Default text if missing
                            media: post.media || [], // Default to an empty array if no media
                            reaction: post.reaction || null, // Default to null if no reaction
                            isSaved: post.isSaved || false, // Default to false if not saved
                            numLikes: post.numLikes || 0,
                            numCelebrates: post.numCelebrates || 0,
                            numLoves: post.numLoves || 0,
                            numSupports: post.numSupports || 0,
                            numFunnies: post.numFunnies || 0,
                            numInsightfuls: post.numInsightfuls || 0,
                            time: post.time || new Date().toISOString(), // Default to current time
                            connectionDegree: post.connectionDegree || 0, // Default to 0 if missing
                        }} />
                    ))
                ) : (
                    <p className="flex justify-center mt-2 text-gray-400">No posts available</p>
                )}
            </div>
        </div>
    );
}

export default PostPageContainer;
