"use client";
import { useQuery } from "@tanstack/react-query";
import TrendingTopicsPresentation, {
  TrendingTopicsPresentationSkeleton,
} from "../presentation/TrendingTopicsPresentation";
import { fetchTrendingTopics } from "@/app/services/post";
import { useRouter } from "next/navigation";

function TrendingTopicsContainer() {
  const {
    data: trendingTopics,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["trendingTopics"],
    queryFn: () => fetchTrendingTopics(),
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const router = useRouter();

  const navigateTo = (keyword) => {
    router.push(`/search/results?keyword=${encodeURIComponent(keyword)}&type=post`);
  };

  if (isLoading)
    return <TrendingTopicsPresentationSkeleton isLoading={isLoading} />;

  if (isError)
    return <TrendingTopicsPresentationSkeleton isLoading={isLoading} error={error}/>;

  const roundNumber = (num) => {
    if (num >= 1000000000) {
      const value = num / 1000000000;
      const rounded = Math.round(value * 10) / 10;
      return `${rounded.toFixed(1).replace(/\.0$/, "")}b`;
    } else if (num >= 1000000) {
      const value = num / 1000000;
      const rounded = Math.round(value * 10) / 10;
      return `${rounded.toFixed(1).replace(/\.0$/, "")}m`;
    } else if (num >= 1000) {
      const value = num / 1000;
      const rounded = Math.round(value * 10) / 10;
      return `${rounded.toFixed(1).replace(/\.0$/, "")}k`;
    }
    return num;
  };

  const formattedTopics = trendingTopics?.map((topic) => {
    if (!topic) return topic;

    return {
      ...topic,
      unchangedKeyword: topic.keyword,
      count: roundNumber(topic.count),
      keyword: topic.keyword
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    };
  });

  return (
    <TrendingTopicsPresentation
      trendingTopics={formattedTopics}
      navigateTo={navigateTo}
    />
  );
}

export default TrendingTopicsContainer;
