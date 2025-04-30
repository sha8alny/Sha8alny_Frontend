import Image from "next/image";
import Container from "./Container";
import { LocationCity, Work } from "@mui/icons-material";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

export default function ProfileCard({ userInfo, navigateTo }) {
  return (
    <Container
      className="w-full border dark:border-[#111] rounded-2xl shadow-md"
      testId="profile-card-root"
    >
      <div className="relative w-full flex" data-testid="profile-card-header">
        <div
          className="absolute top-0 left-0 w-full h-20 bg-gray-700 rounded-t-xl"
          data-testid="profile-card-cover"
        >
          <Image
            src={userInfo?.coverPhoto}
            fill
            alt="Cover Image"
            className="rounded-t-xl object-cover"
            data-testid="profile-card-cover-img"
          />
        </div>
        <Avatar
          className="relative size-16 z-10 ml-4 rounded-full border-2 border-foreground mt-10 cursor-pointer"
          onClick={() => navigateTo(`/u/${userInfo?.username}`)}
          data-testid="profile-card-avatar"
        >
          <AvatarImage
            src={userInfo?.profilePicture}
            alt={userInfo?.name}
            data-testid="profile-card-avatar-img"
          />
          <AvatarFallback data-testid="profile-card-avatar-fallback">
            {userInfo?.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div
        className="px-4 pt-1 flex flex-col pb-4"
        data-testid="profile-card-body"
      >
        <button
          onClick={() => navigateTo(`/u/${userInfo?.username}`)}
          className="text-lg text-start cursor-pointer hover:underline font-bold"
          data-testid="profile-card-name-btn"
        >
          {userInfo?.name}
        </button>
        <p
          className="text-muted text-sm mb-2"
          data-testid="profile-card-headline"
        >
          {userInfo?.headline}
        </p>
        <div
          className="flex items-center gap-1"
          data-testid="profile-card-location"
        >
          <LocationCity
            className="text-muted"
            sx={{ fontSize: "1rem" }}
            data-testid="profile-card-location-icon"
          />
          <p
            className="text-muted text-xs"
            data-testid="profile-card-location-text"
          >
            {userInfo?.location}
          </p>
        </div>
      </div>
    </Container>
  );
}
