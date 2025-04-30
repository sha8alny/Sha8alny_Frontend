"use client";
import CommentContainer from "@/app/components/modules/feed/container/CommentContainer";
import { CommentSkeleton } from "@/app/components/modules/feed/presentation/CommentPresentation";
import { getComment } from "@/app/services/post";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

export default function CommentPage({ params }) {
  const unwrappedParams = use(params);
  const { username, postId, commentId } = unwrappedParams;

  const {
    data: comment,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comment", commentId],
    queryFn: () => getComment(postId, commentId),
    refetchOnWindowFocus: false,
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center max-w-2xl mx-auto py-4">
        <CommentSkeleton />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center">
        <p className="text-red-500">Error loading comment</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center max-w-2xl mx-auto py-4">
      <CommentContainer
        postId={postId}
        comment={comment}
        nestCount={0}
        postUsername={username}
        isSingleComment={true}
      />
    </div>
  );
}
