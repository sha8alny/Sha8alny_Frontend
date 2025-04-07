import Image from "next/image";
import Container from "./Container";
import { LocationCity } from "@mui/icons-material";

export default function ProfileCard({ userInfo, navigateTo }) {
  return (
    <Container className="w-full border border-[#111] rounded-2xl shadow-lg">
      <div className="relative w-full flex">
        <div className="absolute top-0 left-0 w-full h-20 bg-gray-700 rounded-t-xl">
          <Image
            src={userInfo?.coverPhoto}
            fill
            alt="Cover Image"
            className="rounded-t-xl"
          />
        </div>
        <div className="relative w-16 h-16 z-10 ml-4 bg-gray-600 rounded-full border-2 border-gray-400 mt-10">
          <Image
            src={userInfo?.profilePicture}
            alt="User Avatar"
            fill
            className="rounded-full"
          />
        </div>
      </div>
      <div className="px-4 pt-1 flex flex-col pb-4">
        <button
          onClick={() => navigateTo(userInfo?.username)}
          className="text-lg text-start cursor-pointer hover:underline font-bold"
        >
          {userInfo?.name}
        </button>
        <p className="text-muted text-sm mb-2">{userInfo?.headline}</p>
        <div className="flex items-center gap-1">
          <LocationCity className="text-muted" sx={{ fontSize: 18 }} />
          <p className="text-muted text-xs">{userInfo?.location}</p>
        </div>
      </div>
    </Container>
  );
}
