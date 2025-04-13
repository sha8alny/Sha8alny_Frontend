"use client";
import PostsContainer from "@/app/components/modules/feed/container/PostsContainer";
import { useParams } from "next/navigation";

export default function Posts() {
  const { username } = useParams();
  return <PostsContainer companyUsername={username}/>;
}
