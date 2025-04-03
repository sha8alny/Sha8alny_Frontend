"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { addComment, getCommentReplies } from "@/app/services/post";
import { useMutation } from "@tanstack/react-query";
import CommentSectionPresentation from "../presentation/CommentSectionPresentation";
import { useState } from "react";

export default function CommentSectionContainer({ postId }) {
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const {
    data,
    isLoading: isLoadingComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", postId],
    queryFn: ({ pageParam = 1 }) => getCommentReplies(postId, null, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
  });
  const comments = data?.pages?.flatMap((page) => page) || [];
  const isLoading = isLoadingComments || isFetchingNextPage;
  const hasMore = hasNextPage && !isLoadingComments;
  const loadMore = () => {
    if (hasMore) {
      fetchNextPage();
    }
  };

  const handleCommentMutation = useMutation({
    mutationFn: (postId, comment) => addComment(postId, null, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments"]);
      setComment("");
      setError(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const isSubmittingComment = handleCommentMutation.isLoading;

  const handleComment = () => {
    if (!comment) {
      setError("Comment cannot be empty");
      return;
    }
    handleCommentMutation.mutate(postId, comment);
  };

  const mockComments = [
    {
      commentId: "cmt123",
      profilePicture: "https://picsum.photos/seed/user1/200",
      username: "user1",
      fullName: "John Doe",
      headline: "Software Engineer at TechCorp",
      time: "2024-04-03T12:34:56Z",
      text: "Great post! Very insightful.",
      numReacts: 15,
      reaction: "Like",
      isFollowed: true,
      isConnected: false,
      replies: [
        {
          commentId: "rply101",
          profilePicture: "https://picsum.photos/seed/reply1/200",
          username: "replyUser1",
          fullName: "Sarah Lee",
          headline: "Software Developer",
          time: "2024-04-03T13:00:00Z",
          text: "Totally agree!",
          numReacts: 5,
          reaction: "Like",
          isFollowed: false,
          isConnected: true,
        },
      ],
    },
    {
      commentId: "cmt124",
      profilePicture: "https://picsum.photos/seed/user2/200",
      username: "user2",
      fullName: "Jane Smith",
      headline: "Marketing Specialist",
      time: "2024-04-03T13:20:45Z",
      text: "I completely agree with your point!",
      numReacts: 8,
      reaction: "Support",
      isFollowed: false,
      isConnected: true,
      replies: [],
    },
    {
      commentId: "cmt125",
      profilePicture: "https://picsum.photos/seed/user3/200",
      username: "user3",
      fullName: "Alice Johnson",
      headline: "Data Scientist",
      time: "2024-04-03T14:05:30Z",
      text: "This perspective is really interesting!",
      numReacts: 12,
      reaction: "Insightful",
      isFollowed: false,
      isConnected: false,
      replies: [
        {
          commentId: "rply102",
          profilePicture: "https://picsum.photos/seed/reply2/200",
          username: "replyUser2",
          fullName: "David White",
          headline: "AI Researcher",
          time: "2024-04-03T14:30:00Z",
          text: "Very intriguing perspective! Thanks for sharing.",
          numReacts: 3,
          isFollowed: true,
          isConnected: false,
          replies: [
            {
              commentId: "rply103",
              profilePicture: "https://picsum.photos/seed/reply3/200",
              username: "replyUser3",
              fullName: "Chris Evans",
              headline: "Graphic Designer",
              time: "2024-04-03T15:00:00Z",
              text: "I agree, it's a fresh take!",
              numReacts: 2,
              isFollowed: false,
              isConnected: true,
            }
          ]
        },
      ],
    },
    {
      commentId: "cmt126",
      profilePicture: "https://picsum.photos/seed/user4/200",
      username: "user4",
      fullName: "Michael Brown",
      headline: "Entrepreneur",
      time: "2024-04-03T15:10:22Z",
      text: "Love this! So inspiring.",
      numReacts: 20,
      reaction: "Love",
      isFollowed: true,
      isConnected: true,
      replies: [],
    },
    {
      commentId: "cmt127",
      profilePicture: "https://picsum.photos/seed/user5/200",
      username: "user5",
      fullName: "Emily Davis",
      headline: "UX Designer",
      time: "2024-04-03T16:45:10Z",
      text: "Haha, this is hilarious! 😂",
      numReacts: 10,
      reaction: "Funny",
      isFollowed: false,
      isConnected: true,
      replies: [
        {
          commentId: "rply103",
          profilePicture: "https://picsum.photos/seed/reply3/200",
          username: "replyUser3",
          fullName: "Chris Evans",
          headline: "Graphic Designer",
          time: "2024-04-03T17:00:00Z",
          text: "Right?! I laughed so hard!",
          numReacts: 7,
          reaction: "Funny",
          isFollowed: false,
          isConnected: true,
        },
      ],
    },
  ];

  return (
    <CommentSectionPresentation
      comments={mockComments}
      isLoading={isLoading}
      hasMore={hasMore}
      loadMore={loadMore}
      handleComment={handleComment}
      comment={comment}
      setComment={setComment}
      isSubmittingComment={isSubmittingComment}
      error={error}
    />
  );
}
