"use client";
import { useState, useEffect } from "react";
import WritePostContainer from "./WritePostContainer";
import PostsContainer from "../../feed/container/PostsContainer";
import { createPost } from "@/app/services/post";
import { getCompanyId, getCompany } from "@/app/services/companyManagement";
import { QueryClient } from "@tanstack/react-query";

function PostPageContainer({ username, logo }) {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = new QueryClient();

  const handlePostSubmit = async (newPost) => {
    try {
      const createdPost = await createPost(newPost, username);
      queryClient.invalidateQueries(["posts", username]);
      window.location.reload();
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
