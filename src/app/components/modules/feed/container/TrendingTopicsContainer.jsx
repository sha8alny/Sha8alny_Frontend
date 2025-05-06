"use client";
import { useQuery } from "@tanstack/react-query";
import TrendingTopicsPresentation, {
  TrendingTopicsPresentationSkeleton,
} from "../presentation/TrendingTopicsPresentation";
import { fetchTrendingTopics } from "@/app/services/post";
import { useRouter } from "next/navigation";

/**
 * TrendingTopicsContainer - Container component for trending hashtags/topics
 * 
 * This component is responsible for:
 * - Fetching trending topics data using React Query with appropriate caching
 * - Handling loading and error states with skeleton UI
 * - Formatting topic data for display (number formatting, text capitalization)
 * - Providing navigation functionality when topics are clicked
 * - Rendering the appropriate presentation component based on data state
 * 
 * The component implements the container pattern, separating data fetching and 
 * processing logic from the presentation layer.
 * 
 * @returns {JSX.Element} Trending topics component with appropriate loading/error states
 */
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

  /**
   * Handles navigation to search results page for a specific topic
   * @param {string} keyword - The topic keyword to search for
   */
  const navigateTo = (keyword) => {
    router.push(`/search/results?keyword=${encodeURIComponent(keyword)}&type=post`);
  };

  if (isLoading)
    return <TrendingTopicsPresentationSkeleton isLoading={isLoading} />;

  if (isError)
    return <TrendingTopicsPresentationSkeleton isLoading={isLoading} error={error}/>;

  /**
   * Formats large numbers to compact form with appropriate suffixes (k, m, b)
   * @param {number} num - The number to format
   * @returns {string|number} Formatted number with suffix or original number
   */
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

  /**
   * Process and format topic data for display
   * - Preserves the original keyword for navigation
   * - Formats count numbers for readability (e.g., 1000 -> 1k)
   * - Capitalizes the first letter of each word in keywords
   */
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
