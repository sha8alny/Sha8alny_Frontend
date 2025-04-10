import LeftSidebar from "@/app/components/modules/feed/container/LeftSidebar";
import { PostContent } from "@/app/components/modules/feed/container/PostContainer";
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

  return (
    <div className="grid grid-cols-5 overflow-y-auto px-4 md:px-20 py-4">
      <div className="hidden md:block justify-self-center w-full">
        <LeftSidebar />
      </div>
      <div className="col-span-5 md:col-span-3">
        <PostContent postId={postId} />
      </div>
      <div className="hidden md:block min-w-max">
        <RightSidebarPresentation />
      </div>
    </div>
  );
}
