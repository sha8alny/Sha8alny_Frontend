"use client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { MapPin, Users, Calendar } from "lucide-react";
import { Button } from "@/app/components/ui/Button";

export function CompanyCardPresentation({
  companyUsername,
  logo = "/placeholder.svg?height=48&width=48",
  industry,
  description,
  location,
  foundingDate,
  numFollowers,
  isFollowed,
  onNavigateToCompany,
  onFollowClick,
}) {
  const truncateText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="border-t dark:border-gray-500 py-3 hover:bg-hover p-3 cursor-pointer">
      <div className="flex items-start gap-3">
        <Avatar
          className="w-12 h-12 cursor-pointer"
          onClick={onNavigateToCompany}
        >
          <AvatarImage src={logo} alt={companyUsername} />
          <AvatarFallback>
            {companyUsername.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3
              className="text-sm font-medium cursor-pointer hover:underline"
              onClick={onNavigateToCompany}
            >
              {companyUsername}
            </h3>
            <Badge
              variant="outline"
              className="text-[10px] text-text px-1.5 py-0"
            >
              {industry}
            </Badge>
          </div>
          <p className="text-gray-400 text-xs">
            {truncateText(description, 60)}
          </p>{" "}
          <div className="flex items-center gap-3 mt-1">
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {location}
            </p>
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <Users className="h-3 w-3" /> {numFollowers} Followers
            </p>
            <p className="text-gray-400 text-xs flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Founded: {foundingDate}
            </p>
          </div>
        </div>
        <Button
          size="sm"
          className="rounded-full text-xs h-7 px-3 bg-secondary text-background hover:bg-secondary/80 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onFollowClick();
          }}
        >
          {isFollowed ? "Following" : "Follow"}
        </Button>
      </div>
    </div>
  );
}
