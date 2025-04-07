"use client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { MapPin, Users, Calendar } from "lucide-react";
import { Button } from "@/app/components/ui/Button";
/**
 * @namespace search
 * @module search
 *
 * @description
 * The `CompanyCardPresentation` component is a presentational component that displays
 * a company's information in a card format. It includes the company's logo, username,
 * industry, description, location, founding date, number of followers, and a follow button.
 * It also provides interactivity for navigating to the company's page and toggling the follow state.
 *
 * @param {Object} props - The props object for the component.
 * @param {string} props.companyUsername - The username of the company.
 * @param {string} [props.logo="/placeholder.svg?height=48&width=48"] - The URL of the company's logo.
 * @param {string} props.industry - The industry the company belongs to.
 * @param {string} props.description - A brief description of the company.
 * @param {string} props.location - The location of the company.
 * @param {string} props.foundingDate - The founding date of the company.
 * @param {number} props.numFollowers - The number of followers the company has.
 * @param {boolean} props.isFollowed - Indicates whether the user is following the company.
 * @param {Function} props.onNavigateToCompany - Callback function triggered when navigating to the company's page.
 * @param {Function} props.onFollowClick - Callback function triggered when the follow button is clicked.
 */

function CompanyCardPresentation({
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
    <div onClick={onNavigateToCompany} className="border-t dark:border-gray-500 py-3 hover:bg-hover p-3 cursor-pointer  duration-200">
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
              <Calendar className="h-3 w-3" />
              Founded:{" "}
              {foundingDate
                ? new Date(foundingDate).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "N/D"}
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
export default CompanyCardPresentation;
