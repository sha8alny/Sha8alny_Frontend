import Navbar from "@/app/components/layout/NavBar";
import { ProfileContainer } from "@/app/components/modules/profile/container/ProfileContainer";
import ReactQueryProvider from "@/app/providers/ReactQueryProvider";


export async function generateMetadata({ params }) {
  const { username } = await params;
  
  if (!username) {
    return {
      title: 'Profile Page',
      description: 'This is a profile page.',
    };
  }

  return {
    title: `Shaغalny - ${username}`,
    description: `This is the profile page for ${username}.`,
    openGraph: {
      title: `Shaغalny - ${username}`,
      description: `This is the profile page for ${username}.`,
      images: [
        {
          url: `https://lorempicsum.com/200`,
          width: 1200,
          height: 630,
          alt: `Profile image for ${username}`,
        },
      ],
    },
  };
}

export default async function Page({ params }) {
  const { username } = await params;
  return (
    <div className="w-screen h-screen overflow-auto">
      <ReactQueryProvider>
        <ProfileContainer username={username}/>
      </ReactQueryProvider>
    </div>
  );
}
