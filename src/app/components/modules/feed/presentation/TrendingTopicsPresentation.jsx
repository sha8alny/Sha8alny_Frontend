import Container from "@/app/components/layout/Container";
import { TrendingUp } from "@mui/icons-material";

const TrendingTopicsPresentation = ({ trendingTopics }) => {
  return (
    <Container className="border-[#111] border shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp sx={{ fontSize: 30 }} className="mr-2" />
        Trending Topics
      </h2>
      <ul className="space-y-2">
        {trendingTopics.map((topic) => (
          <li key={topic.title}>
            <p className="font-semibold hover:underline cursor-pointer">
              #{topic.title}
            </p>
            <p className="text-muted text-xs">
              {topic.count} people talking about this
            </p>
          </li>
        ))}
      </ul>
    </Container>
  );
};

const TrendingTopicsPresentationSkeleton = ({isLoading}) => {
  return (
    <Container className="border-[#111] border shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp sx={{ fontSize: 30 }} className="mr-2" />
        Trending Topics
      </h2>
      <ul className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <li key={index} className="space-y-1">
            <div className={`${isLoading && "animate-pulse"} bg-primary/60 h-5 w-3/4 rounded`}></div>
            <div className={`${isLoading && "animate-pulse"} bg-primary/40 h-3 w-1/2 rounded`}></div>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export { TrendingTopicsPresentationSkeleton };

export default TrendingTopicsPresentation;
