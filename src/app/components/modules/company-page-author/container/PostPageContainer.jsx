"use client";
import { useState, useEffect } from "react";
import WritePostContainer from "./WritePostContainer";
import PostsContainer from "../../feed/container/PostsContainer";
import { createPost } from "@/app/services/post";
import { getCompany } from "@/app/services/companyManagement";
import { QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

/**
 * PostPageContainer component handles the display of the write post form and the list of posts for a company.
 * It fetches the company details and allows the user to create a post, while also updating the list of posts.
 *
 * @param {Object} props - The props for the PostPageContainer component.
 * @param {string} props.username - The username of the company whose posts are being managed.
 * @param {string} props.logo - The logo URL of the company.
 * 
 * @returns {JSX.Element} The rendered PostPageContainer component.
 */

function PostPageContainer({ username, logo }) {
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
