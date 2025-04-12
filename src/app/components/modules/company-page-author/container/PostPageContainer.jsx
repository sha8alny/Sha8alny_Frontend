"use client";
import { useState, useEffect } from "react";
import WritePostContainer from "./WritePostContainer";
import { createPost } from "@/app/services/post";
import { getCompanyId, getCompany } from "@/app/services/companyManagement";
import { Post } from "./PostContainer";
import PostContainer from "../../feed/container/PostContainer";
import PostsContainer from "../../feed/container/PostsContainer";
import { QueryClient } from "@tanstack/react-query";

function PostPageContainer({ username, logo }) {
  const [posts, setPosts] = useState([]);
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);

  const handlePostSubmit = async (newPost) => {
    try {
      const { companyId } = await getCompanyId(username);
      const createdPost = await createPost(newPost, companyId);
      QueryClient.invalidateQueries(["posts", username]);
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
      <WritePostContainer
        company={company}
        onPostSubmit={handlePostSubmit}
        logo={logo}
      />
      <div className="space-y-6 mt-4">
        <PostsContainer companyUsername={username} />
      </div>
    </div>
  );
}

export default PostPageContainer;
