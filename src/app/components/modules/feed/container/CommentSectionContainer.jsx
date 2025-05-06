"use client";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  addComment,
  determineAge,
  getCommentReplies,
  getTags,
} from "@/app/services/post";
import { useMutation } from "@tanstack/react-query";
import CommentSectionPresentation from "../presentation/CommentSectionPresentation";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * CommentSectionContainer - Container component for post comment sections
 * 
 * Manages the complete comment section for a post, including:
 * - Fetching and displaying top-level comments with infinite scrolling
 * - Adding new comments with optimistic UI updates
 * - User tagging functionality with search and selection
 * - Error handling and validation
 * 
 * The component provides a comprehensive interface for users to view existing
 * comments and add their own, with real-time feedback and optimistic updates.
 * 
 * @param {Object} props - Component props
 * @param {string} props.username - Username of the post author
 * @param {string} props.postId - ID of the post to display comments for
 * @returns {JSX.Element} Comment section with input and comment list
 */
export default function CommentSectionContainer({ username, postId }) {
  // Comment input state
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  
  // Company context state
  const [companyUsername, setCompanyUsername] = useState(null);
  
  // User tagging state
  const [taggedUser, setTaggedUser] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [tagError, setTagError] = useState(null);

  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();

  // Commented out company detection code
  // useEffect(() => {
  //   if (pathname) {
  //     const companyRegex = /^\/company\/([^/]+)\/admin\/posts(\/.*)?$/;
  //     const match = pathname.match(companyRegex);
  //     if (match && match[1]) {
  //       setCompanyUsername(match[1]);
  //     }
  //   }
  // }, [pathname]);

  /**
   * Removes a tagged user from the list
   * @param {string} userIdToRemove - ID of the user to remove from tags
   */
  const handleRemoveTaggedUser = useCallback((userIdToRemove) => {
    setTaggedUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== userIdToRemove)
    );
    setTagError(null);
  }, []);

  /**
   * Adds a user to the tagged users list if not already tagged
   * and if the maximum tag limit hasn't been reached
   * 
   * @param {Object} user - User object to add to tags
   */
  const handleTagUserClick = useCallback(
    (user) => {
      if (taggedUsers.some((u) => u._id === user._id)) {
        return; // User already tagged
      }

      if (taggedUsers.length >= 5) {
        setTagError("You can tag a maximum of 5 users.");
        return;
      }

      setTaggedUsers((prev) => [...prev, user]);
      setTaggedUser("");
      setSearchResults([]);
    },
    [taggedUsers]
  );

  /**
   * Searches for users to tag based on query string
   * Filters out users that are already tagged
   * 
   * @param {string} query - Search query for finding users
   */
  const handleUserSearch = useCallback(
    async (query) => {
      if (!query || query.length < 2) {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await getTags(query);
        const filteredResults = results.filter(
          (user) =>
            !taggedUsers.some((taggedUser) => taggedUser._id === user._id)
        );
        setSearchResults(filteredResults || []);
      } catch (error) {
        console.error("Error searching for users:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [taggedUsers]
  );

  /**
   * Infinite query hook to fetch comments with pagination
   * Includes error handling for 404 responses and pagination control
   */
  const {
    data,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const result = await getCommentReplies(postId, null, pageParam);
        return { data: result, pageParam };
      } catch (error) {
        if (error.response?.status === 404) {
          return { data: [], pageParam, noMoreData: true };
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.noMoreData) {
        return undefined;
      }

      const data = lastPage.data;

      if (!data || !Array.isArray(data) || data.length === 0) {
        return undefined;
      }

      const perPage = 5;
      return data.length === perPage ? lastPage.pageParam + 1 : undefined;
    },
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 0,
    refetchInterval: false,
    gcTime: 0,
  });

  // Process fetched comments data
  const comments =
    data?.pages?.flatMap((page) =>
      Array.isArray(page.data) ? page.data : []
    ) || [];

  const isLoading = isLoadingComments && !isFetchingNextPage;
  const hasMore = hasNextPage && !isLoadingComments;

  /**
   * Track initial load state in session storage to handle refresh behavior
   */
  useEffect(() => {
    const initialLoad =
      typeof window !== "undefined" &&
      !sessionStorage.getItem(`loaded-comments-${postId}`);

    if (initialLoad) {
      sessionStorage.setItem(`loaded-comments-${postId}`, "true");
    }
  }, [postId]);

  /**
   * Load more comments when user scrolls to the end of the list
   */
  const loadMore = () => {
    if (hasMore) {
      fetchNextPage();
    }
  };

  /**
   * Mutation for adding a new comment to the post
   * Includes optimistic UI updates to immediately show the new comment
   * and update comment counts
   */
  const handleCommentMutation = useMutation({
    mutationFn: (params) =>
      addComment({
        postId: params.postId,
        commentId: params.commentId,
        text: params.comment,
        tags: taggedUsers.map((user) => user._id),
        companyUsername: companyUsername,
      }),
    onSuccess: (newComment) => {
      // Reset form state
      setError(null);
      const oldComment = comment;
      setComment("");
      setTaggedUsers([]);
      setTaggedUser("");
      setSearchResults([]);
      setIsSearching(false);
      setTagError(null);

      // Optimistically update the comments list
      queryClient.setQueryData(["comments", postId], (oldData) => {
        // Create optimistic comment object
        const commentObj = {
          commentId: newComment.commentId,
          text: oldComment.trim(),
          username: companyUsername
            ? companyUsername
            : queryClient.getQueryData(["sidebarInfo","notifications"])?.username || "user",
          profilePicture: companyUsername
            ? document.getElementById("company-logo")
            : queryClient.getQueryData(["sidebarInfo","notifications"])?.profilePicture || "",
          fullName: companyUsername
            ? document.getElementById("company-name")
            : queryClient.getQueryData(["sidebarInfo","notifications"])?.name || "User",
          time: new Date().toISOString(),
          numLikes: 0,
          numCelebrates: 0,
          numLoves: 0,
          numSupports: 0,
          numFunnies: 0,
          numInsightfuls: 0,
          tags: taggedUsers.map((user) => ({
            userId: user._id,
            username: user.username,
            profilePicture: user.profilePicture,
            name: user.name,
            connectionDegree: user.connectionDegree,
          })),
          numComments: 0,
          numReacts: 0,
          reaction: null,
          connectionDegree: 0,
          headline: companyUsername
            ? document.getElementById("company-industry")
            : queryClient.getQueryData(["sidebarInfo","notifications"])?.headline || "",
          isFollowed: false,
          age: determineAge(new Date()),
        };

        // Add to existing data or create new data structure
        if (!oldData || !oldData.pages || !oldData.pages[0]) {
          return {
            pages: [{ data: [commentObj] }],
            pageParams: [1],
          };
        }

        // Insert at beginning of comments list
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              data: Array.isArray(oldData.pages[0].data)
                ? [commentObj, ...oldData.pages[0].data]
                : [commentObj],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });

      // Update the post's comment count
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData || !oldData.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) =>
            Array.isArray(page)
              ? page.map((p) =>
                  p.postId === postId
                    ? { ...p, numComments: (p.numComments || 0) + 1 }
                    : p
                )
              : page
          ),
        };
      });
    },
    onError: (error) => {
      // Handle error and reset form
      setError(error.message);
      setComment("");
      setTaggedUsers([]);
      setTaggedUser("");
      setSearchResults([]);
      setIsSearching(false);
      setTagError(null);
    },
  });

  /**
   * Navigate to the full post view
   */
  const navigateTo = () => {
    router.push(`/u/${username}/post/${postId}`);
  };

  // Check if we're already on the post detail page
  const isPost = pathname.includes("/post/");

  /**
   * Handle keyboard events for submitting comments with Enter
   * @param {KeyboardEvent} e - Keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleComment();
    }
  };

  /**
   * Submit a new comment if validation passes
   */
  const handleComment = () => {
    if (!comment.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    handleCommentMutation.mutate({
      postId,
      commentId: null,
      comment: comment.trim(),
    });
  };

  return (
    <CommentSectionPresentation
      comments={comments}
      hasMore={hasMore}
      loadMore={loadMore}
      handleComment={handleComment}
      handleKeyPress={handleKeyPress}
      comment={comment}
      setComment={setComment}
      isSubmittingComment={handleCommentMutation.isPending}
      error={error}
      postId={postId}
      navigateTo={navigateTo}
      isPost={isPost}
      isLoading={isLoading}
      isLoadingComments={isFetchingNextPage}
      postUsername={username}
      taggedUser={taggedUser}
      setTaggedUser={setTaggedUser}
      taggedUsers={taggedUsers}
      setTaggedUsers={setTaggedUsers}
      handleTagUserClick={handleTagUserClick}
      handleRemoveTaggedUser={handleRemoveTaggedUser}
      handleUserSearch={handleUserSearch}
      isSearching={isSearching}
      searchResults={searchResults}
      tagError={tagError}
    />
  );
}
