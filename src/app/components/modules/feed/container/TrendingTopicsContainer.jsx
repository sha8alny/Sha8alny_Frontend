import TrendingTopicsPresentation, { TrendingTopicsPresentationSkeleton } from "../presentation/TrendingTopicsPresentation";

function TrendingTopicsContainer() {
  const trendingTopics = [
    {
      title: "Technology",
      count: "1.5k",
    },
    {
      title: "Programming",
      count: "1.2k",
    },
    {
      title: "Software",
      count: "1.1k",
    },
    {
      title: "Engineering",
      count: "1k",
    },
  ];
  const isLoading = false;
  const isError = false;

  if (isLoading) return <TrendingTopicsPresentationSkeleton isLoading={isLoading} />;

  if (isError || !trendingTopics) return <TrendingTopicsPresentationSkeleton isLoading={isLoading} />;

  return <TrendingTopicsPresentation trendingTopics={trendingTopics} />;
}

export default TrendingTopicsContainer;
