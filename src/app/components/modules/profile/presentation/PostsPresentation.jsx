import { determineAge } from "@/app/services/post";
import PostPresentation, { PostPresentationSkeleton } from "./PostPresentation";

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

        {/* Carousel Indicators */}
        {!isLoading && !isError && posts?.length > 0 && (
          <div className="flex justify-center gap-1">
            {posts.map((_, index) => (
              <button
                key={`indicator-${index}`}
                className="h-2 w-2 rounded-full bg-primary/30 hover:bg-primary/60"
                onClick={() => carouselScroll(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 mt-4 gap-4">
        {isLoading &&
          Array(5)
            .fill(0)
            .map((_, index) => (
              <PostPresentationSkeleton key={index} isLoading={isLoading} />
            ))}
        {(isError || posts?.length === 0) && !isLoading && (
          <></>
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
