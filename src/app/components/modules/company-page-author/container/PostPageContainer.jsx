"use client";
import { useState, useEffect } from "react";
import WritePostContainer from "./WritePostContainer";
import PostsContainer from "../../feed/container/PostsContainer";
import { createPost } from "@/app/services/post";
import { getCompany } from "@/app/services/companyManagement";
import { QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

/**
 * @namespace PostPageComponents
 */

/**
 * PostPageContainer component handles the post creation and display of posts for a given company.
 * It fetches company data, allows users to create new posts, and displays existing posts.
 * @component
 * @param {Object} props - The props for the PostPageContainer component.
 * @param {string} props.username - The username of the company.
 * @param {string} props.logo - The company logo URL.
 * 
 * @returns {JSX.Element} The rendered PostPageContainer component.
 */

export default function PostPageContainer({ username, logo }) {
  const [company, setCompany] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = new QueryClient();
  const router = useRouter();

  const handlePostSubmit = async (newPost) => {
    try {
      const createdPost = await createPost(newPost, username);
      console.log("Post created:", createdPost);
      router.push(`/company/${username}/admin/posts`);
      queryClient.invalidateQueries(["posts", username]);
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
