import CommentSectionContainer from "@/app/components/modules/feed/container/CommentSectionContainer";
import LeftSidebar from "@/app/components/modules/feed/container/LeftSidebar";
import PostContainer, {
  PostContent,
} from "@/app/components/modules/feed/container/PostContainer";
import ShareContainer from "@/app/components/modules/feed/container/ShareContainer";
import RightSidebarPresentation from "@/app/components/modules/feed/presentation/RightSidebarPresentation";

export async function generateMetadata({ params }) {
  const { username, postId } = await params;

  if (!postId) {
    return {
      title: "Shaغalny - Post",
      description: "This is a post page.",
    };
  }

  return {
    title: `Shaغalny`,
    description: `This is the post page for ${username}.`,
    openGraph: {
      title: `Shaغalny`,
      description: `This is the post page for ${username}.`,
    },
  };
}

export default async function Page({ params }) {
  const { postId } = await params;
  const mockPost = {
    postId: "post_12345",
    profilePicture: "https://picsum.photos/200/200?random=1",
    username: "john_doe",
    fullName: "John Doe",
    headline: "Software Engineer at TechCorp",
    time: "2025-04-03T12:32:35.498Z",
    text: "Excited to share my latest project on AI-powered chatbots! 🚀",
    media: [
      "https://picsum.photos/600/400?random=4",
    ],
    tags: [101, 202, 303],
    numReacts: 245,
    numShares: 67,
    numComments: 34,
    reaction: "Support",
    isSaved: true,
    isFollowed: true,
    isConnected: false,
    isCompany: false,
  };

  return (
    <div className="grid grid-cols-5 overflow-y-auto px-4 md:px-20 py-4">
      <div className="hidden md:block justify-self-center w-full">
        <LeftSidebar />
      </div>
      <div className="col-span-5 md:col-span-3">
        <PostContainer post={mockPost} />
      </div>
      <div className="hidden md:block min-w-max">
        <RightSidebarPresentation />
      </div>
    </div>
  );
}
