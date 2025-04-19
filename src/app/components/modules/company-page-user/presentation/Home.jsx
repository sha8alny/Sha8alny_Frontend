import Container from "@/app/components/layout/Container";
import PostCard from "./PostCard";

/**
 * Home component - Displays an overview of the company and a horizontal list of recent posts.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.company - The company object containing details like name, logo, description, and follower count.
 * @param {string} props.company.name - The name of the company.
 * @param {string} props.company.logo - The logo URL of the company.
 * @param {string} props.company.description - A brief description of the company.
 * @param {number} props.company.numFollowers - Number of followers the company has.
 * @param {Array<Object>} props.posts - An array of post objects to display.
 * @param {string} props.posts[].time - The timestamp of the post.
 * @param {string} props.posts[].text - The text content of the post.
 * @param {number} props.posts[].numReacts - Number of likes the post received.
 * @param {number} props.posts[].numComments - Number of comments on the post.
 * @param {number} props.posts[].numShares - Number of shares the post received.
 * @param {Function} props.goToAboutPage - Function to navigate to the about page.
 * @param {Function} props.goToPostsPage - Function to navigate to the posts page.
 * @returns {JSX.Element} The rendered Home component.
 */
export default function Home({company,posts, goToAboutPage, goToPostsPage}) {
    const Posts = posts?.map((post) => ({
        image: company?.logo, // Replace with post.image if available
        dateTime: post.time,
        postText: post.text,
        company: company?.name,
        followers: company?.numFollowers,
        likes: post.numReacts,
        comments :post.numComments,
        shares: post.numShares,
    })) || [];
    return(
        <>
        <Container className="border-[#111] border shadow-lg">
            <div className="h-max rounded-xl p-6 space-y-2">
                <div>
                    <h1 className="text-xl font-bold">Overview</h1>
                    <p className="text-muted">{company?.description || "No description provided."}</p>
                </div>
                <button
                    onClick={goToAboutPage}
                    className="w-full text-center border-t pt-3 text-gray-300 hover:text-white transition-colors cursor-pointer" data-testid="about-button">
                    Show all details →
                </button>
            </div>
        </Container>
        <Container className="mt-4 border-[#111] border shadow-lg">
            <div className="h-max rounded-xl p-6 space-y-2">
                <div>
                    <h1 className="text-xl font-bold mb-2">Page posts</h1>
                    <div className="flex overflow-x-auto space-x-4 pr-2 scrollbar-transparent">
                        {Posts.length > 0 ? (
                            Posts.map((post, i) => (
                            <div key={i} className="w-1/2 gap-4 max-w-[260px] flex-shrink-0">
                                <PostCard {...post} />
                            </div>
                            ))
                        ) : (
                            <p className="text-muted">No posts available.</p>
                        )}
                    </div>
                </div>
                <button
                    onClick={goToPostsPage}
                    className="w-full text-center border-t pt-3 text-gray-300 hover:text-white transition-colors cursor-pointer" data-testid="posts-button"
                >
                    Show all posts →
                </button>
            </div>
        </Container>
        </>
    );
}

