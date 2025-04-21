import Container from "@/app/components/layout/Container";
import { TrendingUp } from "@mui/icons-material";

const TrendingTopicsPresentation = ({ trendingTopics, navigateTo }) => {
  return (
    <Container className="dark:border-[#111] border shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp sx={{ fontSize: "2rem" }} className="mr-2" />
        Trending Topics
      </h2>
      {/* Trending topics list */}
      {trendingTopics?.length === 0 && (
        <p className="text-muted text-sm">No trending topics available</p>
      )}
      {trendingTopics?.length > 0 && (
        <ul className="space-y-2">
          {trendingTopics.map((topic) => (
            <li key={topic?.keyword + topic?.count}>
              <p
                onClick={() => navigateTo(topic?.unchangedKeyword)}
                className="font-semibold hover:underline cursor-pointer"
              >
                #{topic?.keyword}
              </p>
              <p className="text-muted text-xs">
                {topic?.count} post(s) in the last 24 hours
              </p>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

const TrendingTopicsPresentationSkeleton = ({ isLoading, error }) => {
  return (
    <Container className="border-[#111] border shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <TrendingUp sx={{ fontSize: 30 }} className="mr-2" />
        Trending Topics
      </h2>
      {!isLoading && (
        <p className="text-muted text-center text-sm">
          {error.message}
        </p>
      )}
      {/* Trending topics list */}
      {isLoading && (
        <ul className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <li key={index} className="space-y-1">
              <div
                className={`${
                  isLoading && "animate-pulse"
                } bg-primary/60 h-5 w-3/4 rounded-full`}
              ></div>
              <div
                className={`${
                  isLoading && "animate-pulse"
                } bg-primary/40 h-3 w-1/2 rounded-full`}
              ></div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export { TrendingTopicsPresentationSkeleton };

export default TrendingTopicsPresentation;
