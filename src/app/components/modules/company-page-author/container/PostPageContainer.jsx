"use client";
import { useState, useEffect } from "react";
import WritePostContainer from "./WritePostContainer";
import PostsContainer from "../../feed/container/PostsContainer";
import { createPost } from "@/app/services/post";
import { getCompany } from "@/app/services/companyManagement";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const router = useRouter();

  const handlePostMutation = useMutation({
    mutationFn: (params) => {
      const { newPost, username } = params;
      return createPost(newPost, username);
    },
    onSuccess: (createdPost, variables) => {
      console.log("Post created:", createdPost);
      router.push(`/company/${username}/admin/posts`);
      const { postJSON } = variables;
      console.log(username);
      console.log("Post JSON:", postJSON);
      const optimisticPost = {
        ...postJSON,
        postId: createdPost.postId,
        username: username,
        media: createdPost.media,
        time: new Date().toISOString(),
        tags: postJSON.tags.map((tag) => ({
          name: tag.name,
          userId: tag._id,
          profilePicture: tag.profilePicture,
          username: tag.username,
        })),
      }
      console.log("Optimistic Post:", optimisticPost);
      queryClient.setQueryData(["posts", username], (old) => {
        if (!old || !old.pages)
          return { pages: [[optimisticPost]], pageParams: [null] };

        return {
          ...old,
          pages: [
            [optimisticPost, ...(old.pages[0] || [])],
            ...old.pages.slice(1),
          ],
        };
      });
    },
    onError: (error) => {
      console.error("Failed to create post:", error);
    },
  });

  const handlePostSubmit = async (newPost, postJSON) => {
    handlePostMutation.mutate({
      newPost,
      username,
      postJSON,
    });
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
