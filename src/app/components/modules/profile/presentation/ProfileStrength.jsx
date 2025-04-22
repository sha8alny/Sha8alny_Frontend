import Container from "@/app/components/layout/Container";
import { Shield } from "lucide-react";

/**
 * @namespace profile
 * @module profile
 */
/**
 * A component that displays a profile strength indicator with a progress bar and checklist.
 * 
 * @component
 * @param {Object} props
 * @param {Object} props.profileStrength - Object containing profile strength information
 * @param {string} props.profileStrength.color - CSS color class for the strength indicator
 * @param {number} props.profileStrength.strength - Percentage value (0-100) of profile completion
 * @param {string} props.profileStrength.label - Text label describing the profile strength level
 * @param {boolean} props.profileStrength.hasProfile - Indicates if user has added a profile photo
 * @param {boolean} props.profileStrength.hasAbout - Indicates if user has added an about section
 * @param {boolean} props.profileStrength.hasSkills - Indicates if user has added skills
 * @param {boolean} props.profileStrength.hasEducation - Indicates if user has added education
 * @param {boolean} props.profileStrength.hasExperience - Indicates if user has added experience
 * @param {boolean} props.profileStrength.hasConnections - Indicates if user has made connections
 * @returns {JSX.Element} A profile strength component with progress bar and checklist
 */
export default function ProfileStrength({ profileStrength }) {
  return (
    <Container className="border dark:border-[#111] shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Shield className="size-5 mr-2 fill-current" />
        Profile Strength
      </h2>
      <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${profileStrength?.color}`}
          style={{ width: `${profileStrength?.strength}%` }}
        />
      </div>
      <h6 className="text-sm mt-2 text-muted">
        Your profile's level is{" "}
        <span
          className={`${profileStrength?.color} font-semibold text-transparent bg-clip-text`}
        >
          {profileStrength?.label}
        </span>
        .
      </h6>
      <div className="mt-4 space-y-2">
        <div className="flex gap-2 items-center text-sm">
          <span
            className={`flex items-center justify-center w-5 h-5 text-xs text-white ${
              profileStrength?.hasProfile ? "bg-green-500" : "bg-red-500"
            } rounded-full`}
          >
            {profileStrength?.hasProfile ? "✓" : "×"}
          </span>
          <span>Add a profile photo</span>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <span
            className={`flex items-center justify-center w-5 h-5 text-xs text-white ${
              profileStrength?.hasAbout ? "bg-green-500" : "bg-red-500"
            } rounded-full`}
          >
            {profileStrength?.hasAbout ? "✓" : "×"}
          </span>
          <span>Add an about section</span>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <span
            className={`flex items-center justify-center w-5 h-5 text-xs text-white ${
              profileStrength?.hasSkills ? "bg-green-500" : "bg-red-500"
            } rounded-full`}
          >
            {profileStrength?.hasSkills ? "✓" : "×"}
          </span>
          <span>Add your skills</span>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <span
            className={`flex items-center justify-center w-5 h-5 text-xs text-white ${
              profileStrength?.hasEducation ? "bg-green-500" : "bg-red-500"
            } rounded-full`}
          >
            {profileStrength?.hasEducation ? "✓" : "×"}
          </span>
          <span>Add your education</span>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <span
            className={`flex items-center justify-center w-5 h-5 text-xs text-white ${
              profileStrength?.hasExperience ? "bg-green-500" : "bg-red-500"
            } rounded-full`}
          >
            {profileStrength?.hasExperience ? "✓" : "×"}
          </span>
          <span>Add your experience</span>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <span
            className={`flex items-center justify-center w-5 h-5 text-xs text-white ${
              profileStrength?.hasConnections ? "bg-green-500" : "bg-red-500"
            } rounded-full`}
          >
            {profileStrength?.hasConnections ? "✓" : "×"}
          </span>
          <span>Connect with others</span>
        </div>
      </div>
    </Container>
  );
}
