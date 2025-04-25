import Image from "next/image";
import Container from "./Container";
import { LocationCity, Work } from "@mui/icons-material";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";

export default function ProfileCard({ userInfo, navigateTo }) {
  return (
    <Container className="w-full border dark:border-[#111] rounded-2xl shadow-md">
      <div className="relative w-full flex">
        <div className="absolute top-0 left-0 w-full h-20 bg-gray-700 rounded-t-xl">
          <Image
            src={userInfo?.coverPhoto}
            fill
            alt="Cover Image"
            className="rounded-t-xl object-cover"
          />
        </div>
        <Avatar
          className="relative size-16 z-10 ml-4 rounded-full border-2 border-foreground mt-10 cursor-pointer"
          onClick={() => navigateTo(`/u/${userInfo?.username}`)}
        >
          <AvatarImage src={userInfo?.profilePicture} alt={userInfo?.name} />
          <AvatarFallback>
            {userInfo?.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="px-4 pt-1 flex flex-col pb-4">
        <button
          onClick={() => navigateTo(`/u/${userInfo?.username}`)}
          className="text-lg text-start cursor-pointer hover:underline font-bold"
        >
          {userInfo?.name}
        </button>
        <p className="text-muted text-sm mb-2">{userInfo?.headline}</p>
        <div className="flex items-center gap-1">
          <LocationCity className="text-muted" sx={{ fontSize: "1rem" }} />
          <p className="text-muted text-xs">{userInfo?.location}</p>
        </div>
      </div>
    </Container>
  );
}
