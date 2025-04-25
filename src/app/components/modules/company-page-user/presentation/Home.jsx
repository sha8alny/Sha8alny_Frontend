import Container from "@/app/components/layout/Container";
import PostCard from "./PostCard";

/**
 * @namespace Home
 */


/**
 * Home component - Displays an overview of the company and a horizontal list of recent posts.
 *
 * @component
 * @param {Home.Props} props - The component props.
 * @param {Home.Company} props.company - The company object containing details like name, logo, description, and follower count.
 * @param {Array<Home.Post>} props.posts - An array of post objects to display.
 * @param {Function} props.goToAboutPage - Function to navigate to the about page.
 * @param {Function} props.goToPostsPage - Function to navigate to the posts page.
 * @returns {JSX.Element} The rendered Home component.
 */
/**
 * @namespace Home
 */

/**
 * @typedef {Object} Home.Company
 * @property {string} name - The name of the company.
 * @property {string} logo - The logo URL of the company.
 * @property {string} description - A brief description of the company.
 * @property {number} numFollowers - Number of followers the company has.
 */

/**
 * @typedef {Object} Home.Post
 * @property {string} time - The timestamp of the post.
 * @property {string} text - The text content of the post.
 * @property {string} media - The media URL associated with the post (optional).
 * @property {number} numLikes - Number of likes the post received.
 * @property {number} numCelebrates - Number of celebrate reactions the post received.
 * @property {number} numSupports - Number of support reactions the post received.
 * @property {number} numLoves - Number of love reactions the post received.
 * @property {number} numInsightfuls - Number of insightful reactions the post received.
 * @property {number} numFunnies - Number of funny reactions the post received.
 * @property {number} numComments - Number of comments on the post.
 * @property {number} numShares - Number of shares the post received.
 */

/**
 * @typedef {Object} Home.Props
 * @property {Home.Company} company - The company object containing details like name, logo, description, and follower count.
 * @property {Array<Home.Post>} posts - An array of post objects to display.
 * @property {Function} goToAboutPage - Function to navigate to the about page.
 * @property {Function} goToPostsPage - Function to navigate to the posts page.
 */


export default function Home({company,posts, goToAboutPage, goToPostsPage}) {

    const totalLikes = 
        (posts.numLikes || 0) +
        (posts.numCelebrates || 0) +
        (posts.numSupports || 0) +
        (posts.numLoves || 0) +
        (posts.numInsightfuls || 0) +
        (posts.numFunnies || 0);

    const Posts = posts?.map((post) => ({
        image: company?.logo,
        dateTime: post.time,
        postText: post.text,
        postMedia : post.media,
        company: company?.name,
        followers: company?.numFollowers,
        likes: totalLikes,
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
                            Posts.slice(0,4).map((post, i) => (
                            <div key={i} className="w-1/2 gap-4 max-w-[260px] flex-shrink-0">
                                <PostCard {...post} />
                            </div>
                            ))
                        ) : (
                            <p className="text-muted">No posts available.</p>
                        )}
                    </div>
                </div>
                <button onClick={goToPostsPage} className="w-full text-center border-t pt-3 text-text hover:text-white transition-colors cursor-pointer" data-testid="posts-button">
                    Show all posts →
                </button>
            </div>
        </Container>
        </>
    );
}

