import { useQuery } from "@tanstack/react-query";
import TrendingTopicsPresentation, { TrendingTopicsPresentationSkeleton } from "../presentation/TrendingTopicsPresentation";
import { fetchTrendingTopics } from "@/app/services/post";

function TrendingTopicsContainer() {
  const {
    data: trendingTopics,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trendingTopics"],
    queryFn: () => fetchTrendingTopics(),
    retry: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  
  if (isLoading) return <TrendingTopicsPresentationSkeleton isLoading={isLoading} />;
  
  if (isError || !trendingTopics) return <TrendingTopicsPresentationSkeleton isLoading={isLoading} />;

  const roundNumber = (num) => {
    if (num > 1000) {
      return `${Math.round(num / 1000)}k`;
    } else if (num > 1000000) {
      return `${Math.round(num / 1000000)}m`;
    } else if (num > 1000000000) {
      return `${Math.round(num / 1000000000)}b`;
    }
    return num;
  }

  const formattedTopics = trendingTopics?.map(topic => {
    if (!topic) return topic;
    
    return {
      ...topic,
      count: roundNumber(topic.count),
      keyword: topic.keyword
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    };
  });

  return <TrendingTopicsPresentation trendingTopics={formattedTopics} />;
}

export default TrendingTopicsContainer;
