"use client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { Briefcase, MapPin } from "lucide-react";

export function PersonCardPresentation({
  username,
  name,
  headline,
  location,
  avatarUrl,
  isConnected,
  onNavigateToProfile,
  onConnectClick,
}) {
  return (
    <div
      onClick={onNavigateToProfile}
      className="bg-foreground text-text border-t dark:border-gray-500 hover:bg-hover p-3 py-3 cursor-pointer"
    >
      <div className="flex items-start gap-3 rounded-lg ">
        <Avatar
          className="w-10 h-10 cursor-pointer"
          onClick={onNavigateToProfile}
        >
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3
              className="text-sm font-medium cursor-pointer hover:underline"
              onClick={onNavigateToProfile}
            >
              {name}
            </h3>
          </div>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <Briefcase className="h-3 w-3" /> {headline}
          </p>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {location}
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full text-xs h-7 px-3 bg-secondary text-background hover:bg-secondary/80 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onConnectClick();
          }}
        >
          {isConnected ? "Message" : "Connect"}
        </Button>
      </div>
    </div>
  );
}
