import Container from "@/app/components/layout/Container";
import Image from "next/image";
import ModHeader from "../container/ModHeader";

/**
 * @namespace profile
 * @module profile
 */
/**
 * Renders the header section of a user's profile
 * @param {Object} props - Component props
 * @param {Object} props.userProfile - User profile information
 * @param {string} props.userProfile.name - User's full name
 * @param {string} props.userProfile.headline - User's headline/title
 * @param {string} props.userProfile.location - User's location
 * @param {number} props.userProfile.connectionsCount - Number of user's connections
 * @param {string} [props.userProfile.relation] - Relationship to current user (e.g. "1st")
 * @param {string} [props.userProfile.coverPhoto] - URL of user's cover photo
 * @param {string} [props.userProfile.profilePicture] - URL of user's profile picture
 * @returns {JSX.Element} Profile header component with user info and images
 */
export default function ProfileHeader({ userProfile }) {
  return (
    <Container className="border-[#111] border shadow-lg">
      <div className="w-full h-max rounded-xl">
        <div className="relative w-full flex">
          <div className="absolute top-0 left-0 w-full h-40 bg-gray-700 rounded-t-xl">
            <Image
              src={
                userProfile.coverPhoto ?? "https://picsum.photos/id/11/600/400"
              }
              fill
              alt="Cover Photo"
              className="rounded-t-xl object-cover"
            />
          </div>
          <div className="relative size-48 z-10 ml-6 bg-gray-500 rounded-full border-8 border-foreground mt-10">
            <Image
              src={
                userProfile.profilePicture ??
                "https://picsum.photos/id/11/600/400"
              }
              alt="User Avatar"
              fill
              className="rounded-full"
            />
          </div>
        </div>
      </div>
      <div className="py-4 px-8 flex">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">{userProfile.name}</h1>
            {!(userProfile?.isMyProfile) && <h6 className="text-muted ml-2">•</h6>}
            {!(userProfile?.isMyProfile) && (
              <span className="text-muted ml-2">{userProfile?.relation}</span>
            )}
          </div>
          <h2 className="text-muted font-medium">{userProfile.headline}</h2>
          <div className="flex gap-2 items-center">
            <p className="text-muted text-sm">{userProfile.location}</p>
            <h6 className="text-muted">•</h6>
            <button className="hover:underline cursor-pointer text-secondary text-sm">
              Contact Info
            </button>
          </div>
          <button className="hover:underline cursor-pointer text-secondary self-start text-sm">
            {userProfile.connectionsCount >= 500
              ? "500+"
              : userProfile.connectionsCount}{" "}
            connections
          </button>
        </div>
        <div className="flex ml-auto self-end">
          <ModHeader userInfo={userProfile} />
        </div>
      </div>
    </Container>
  );
}
