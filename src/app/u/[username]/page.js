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
    },
  };
}

export default async function Page({ params }) {
  const { username } = await params;
  return (
    <div className="overflow-y-auto">
      <ReactQueryProvider>
        <ProfileContainer username={username}/>
      </ReactQueryProvider>
    </div>
  );
}
