import Container from "@/components/layout/container";
import Image from "next/image";

export default function ProfileHeader({ userProfile }) {
  return (
    <Container className="border-[#111] border shadow-lg">
      <div className="w-full h-max rounded-xl">
        <div className="relative w-full flex">
          <div className="absolute top-0 left-0 w-full h-40 bg-gray-700 rounded-t-xl">
            <Image
              src={
                userProfile.coverPhotoUrl ??
                "https://picsum.photos/id/11/600/400"
              }
              fill
              alt="Cover Photo"
              className="rounded-t-xl object-cover"
            />
          </div>
          <div className="relative size-48 z-10 ml-6 bg-gray-500 rounded-full border-8 border-background mt-10">
            <Image
              src={
                userProfile.profilePictureUrl ??
                "https://picsum.photos/id/11/600/400"
              }
              alt="User Avatar"
              fill
              className="rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="py-4 px-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">
            {userProfile.name}
          </h1>
          <h6 className="text-muted ml-2">•</h6>
          <span className="text-muted ml-2">
            {userProfile.relation ?? "1st"}
          </span>
        </div>
        <h2 className="text-muted text-lg">{userProfile.subtitle}</h2>
        <div className="flex gap-2 items-center">
          <p className="text-muted text-sm">{userProfile.location}</p>
          <h6 className="text-muted">•</h6>
          <button className="hover:underline text-secondary text-sm">
            Contact Info
          </button>
        </div>
        <button className="hover:underline text-secondary text-sm">
          {userProfile.connectionsCount >= 500
            ? "500+"
            : userProfile.connectionsCount}{" "}
          connections
        </button>
      </div>
    </Container>
  );
}
