"use client";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { Briefcase, MapPin } from "lucide-react";
/**
 * @namespace search
 * @module search
 *
 * @description
 * The `PersonCardPresentation` component is a presentational component used to display a person's profile card.
 * It includes their avatar, name, headline, location, and a button to connect or message them.
 * The component is interactive, allowing navigation to the person's profile and handling connection actions.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.username - The username of the person.
 * @param {string} props.name - The full name of the person.
 * @param {string} props.headline - The headline or job title of the person.
 * @param {string} props.location - The location of the person.
 * @param {string} props.avatarUrl - The URL of the person's avatar image.
 * @param {boolean} props.isConnected - Indicates whether the user is already connected with the person.
 * @param {Function} props.onNavigateToProfile - Callback function triggered when navigating to the person's profile.
 * @param {Function} props.onConnectClick - Callback function triggered when the connect button is clicked.
 */

function PersonCardPresentation({
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
      className="bg-foreground text-text border-t dark:border-gray-500 hover:bg-hover p-3 py-3 cursor-pointer duration-200"
      data-testid={`person-card-${username}`}
    >
      <div className="flex items-start gap-3 rounded-lg ">
        <Avatar
          className="w-10 h-10 cursor-pointer"
          onClick={onNavigateToProfile}
          data-testid={`person-avatar-${username}`}
        >
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3
              className="text-sm font-medium cursor-pointer hover:underline"
              onClick={onNavigateToProfile}
              data-testid={`person-name-${username}`}
            >
              {name}
            </h3>
          </div>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <Briefcase className="h-3 w-3" /> {headline || "N/A"}
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
          data-testid={`person-connect-button-${username}`}
        >
          {isConnected == "accepted"
            ? "Message"
            : isConnected == "pending"
            ? "Pending"
            : isConnected == "rejected"
            ? "Connect"
            : "Connected"}
        </Button>
      </div>
    </div>
  );
}

export default PersonCardPresentation;
