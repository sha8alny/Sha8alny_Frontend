import { determineAge } from "@/app/services/post";
import PostPresentation, { PostPresentationSkeleton } from "./PostPresentation";


/**
 * @namespace profile
 * @module profile
 */
/**
 * PostsPresentation - Responsive grid/carousel display of user posts
 * 
 * This component renders a user's posts in:
 * - A horizontal scrollable carousel on mobile devices
 * - A responsive grid layout on desktop/tablet screens
 * 
 * It handles various states including loading, error, and empty posts list.
 * The component applies different layouts based on screen size and provides
 * carousel navigation indicators for mobile view.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.posts - Array of post objects to display
 * @param {boolean} props.isLoading - Whether posts are currently loading
 * @param {boolean} props.isError - Whether an error occurred while loading posts
 * @param {Function} props.navigateTo - Function to handle navigation
 * @param {Function} props.isVideo - Function to determine if a post media is a video
 * @param {Function} props.isDocument - Function to determine if a post media is a document
 * @param {Object} props.carouselRef - Ref object for the mobile carousel
 * @param {Function} props.carouselScroll - Function to handle carousel scrolling
 * @returns {JSX.Element} Responsive posts display
 */
export default function PostsPresentation({
  posts,
  isLoading,
  isError,
  navigateTo,
  isVideo,
  isDocument,
  carouselRef,
  carouselScroll,
}) {
  return (
    <>
      {/* Mobile Carousel */}
      <div className="md:hidden w-full relative mt-4">
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide"
          style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
        >
          {isLoading &&
            Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="snap-start shrink-0 w-[80%]">
                  <PostPresentationSkeleton isLoading={isLoading} />
                </div>
              ))}

          {!isLoading &&
            !isError &&
            posts?.length > 0 &&
            posts.map((post) => (
              <div key={post.postId} className="snap-start shrink-0 w-[80%]">
                <PostPresentation
                  post={{
                    ...post,
                    age: determineAge(post?.time),
                    numReacts:
                      post?.numLikes +
                      post?.numCelebrates +
                      post?.numLoves +
                      post?.numSupports +
                      post?.numFunnies +
                      post?.numInsightfuls,
                  }}
                  navigateTo={navigateTo}
                  isVideo={isVideo(post?.media[0])}
                  isDocument={isDocument(post?.media[0])}
                />
              </div>
            ))}

          {(isError || posts?.length === 0) && !isLoading && (
            <>
            </>
          )}
        </div>

        {/* Carousel Indicators - Small clickable dots for navigating the mobile carousel */}
        {!isLoading && !isError && posts?.length > 0 && (
          <div className="flex justify-center gap-1">
            {posts.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className="h-2 w-2 rounded-full bg-primary/30 hover:bg-primary/60"
                onClick={() => carouselScroll(index)}
                aria-label={`Go to post ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* 
        Desktop Grid Layout
        - Uses CSS Grid to create a responsive layout
        - Changes number of columns based on screen width:
          - md: 2 columns
          - xl: 4 columns
          - 2xl: 5 columns
        - Displays loading skeletons during loading state
      */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 flex-wrap mt-4 gap-4">
        {isLoading &&
          Array(5)
            .fill(0)
            .map((_, index) => (
              <PostPresentationSkeleton key={index} isLoading={isLoading} />
            ))}
        {(isError || posts?.length === 0) && !isLoading && (
          <>{/* Empty state or error message would go here */}</>
        )}
        {!isLoading &&
          !isError &&
          posts?.length > 0 &&
          posts.map((post) => (
            <PostPresentation
              key={post.postId}
              post={{
                ...post,
                age: determineAge(post?.time),
                numReacts:
                  post?.numLikes +
                  post?.numCelebrates +
                  post?.numLoves +
                  post?.numSupports +
                  post?.numFunnies +
                  post?.numInsightfuls,
              }}
              navigateTo={navigateTo}
              isVideo={isVideo(post?.media[0])}
              isDocument={isDocument(post?.media[0])}
            />
          ))}
      </div>
    </>
  );
}
