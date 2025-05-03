import Container from "@/app/components/layout/Container";
import { TrendingUp } from "@mui/icons-material";

const TrendingTopicsPresentation = ({ trendingTopics, navigateTo }) => {
  return (
    <Container
      className="dark:border-[#111] border shadow-lg p-4"
      data-testid="trending-topics-root"
    >
      <h2
        className="text-lg font-semibold mb-4 flex items-center"
        data-testid="trending-topics-title"
      >
        <TrendingUp
          sx={{ fontSize: "2rem" }}
          className="mr-2"
          data-testid="trending-topics-icon"
        />
        Trending Topics
      </h2>
      {/* Trending topics list */}
      {trendingTopics?.length === 0 && (
        <p className="text-muted text-sm" data-testid="trending-topics-empty">
          No trending topics available
        </p>
      )}
      {trendingTopics?.length > 0 && (
        <ul className="space-y-2" data-testid="trending-topics-list">
          {trendingTopics.map((topic) => (
            <li
              key={topic?.keyword + topic?.count}
              data-testid="trending-topics-item"
            >
              <p
                onClick={() => navigateTo(topic?.unchangedKeyword)}
                className="font-semibold truncate hover:underline cursor-pointer"
                data-testid="trending-topics-keyword"
              >
                #{topic?.keyword}
              </p>
              <p
                className="text-muted text-xs"
                data-testid="trending-topics-count"
              >
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
    <Container
      className="dark:border-[#111] border shadow-sm p-4"
      data-testid="trending-topics-skeleton-root"
    >
      <h2
        className="text-lg font-semibold mb-4 flex items-center"
        data-testid="trending-topics-skeleton-title"
      >
        <TrendingUp
          sx={{ fontSize: 30 }}
          className="mr-2"
          data-testid="trending-topics-skeleton-icon"
        />
        Trending Topics
      </h2>
      {!isLoading && (
        <p
          className="text-muted text-center text-sm"
          data-testid="trending-topics-skeleton-error"
        >
          {error.message}
        </p>
      )}
      {/* Trending topics list */}
      {isLoading && (
        <ul className="space-y-3" data-testid="trending-topics-skeleton-list">
          {[...Array(4)].map((_, index) => (
            <li
              key={index}
              className="space-y-1"
              data-testid="trending-topics-skeleton-item"
            >
              <div
                className={`${
                  isLoading && "animate-pulse"
                } bg-primary/60 h-5 w-3/4 rounded-full`}
                data-testid="trending-topics-skeleton-keyword"
              ></div>
              <div
                className={`${
                  isLoading && "animate-pulse"
                } bg-primary/40 h-3 w-1/2 rounded-full`}
                data-testid="trending-topics-skeleton-count"
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
