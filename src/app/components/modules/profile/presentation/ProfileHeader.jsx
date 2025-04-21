import Container from "@/app/components/layout/Container";
import Image from "next/image";
import ModHeader from "../container/ModHeader";
import ContactInfoPresentation from "./ContactInfoPresentation";
import Connections from "../container/Connections";
import { Maximize2 } from "lucide-react"; // Import maximize icon

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
export default function ProfileHeader({
  userProfile,
  onCopy,
  onEmail,
  copied,
  fullscreenImage,
  setHoverCover,
  setHoverProfile,
  openFullscreen,
  closeFullscreen,
}) {
  return (
    <>
      <Container className="dark:border-[#111] dark:border shadow-lg">
        <div className="w-full h-max rounded-xl">
          <div className="relative w-full flex">
            {/* Cover photo with hover effect */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gray-700 rounded-t-xl overflow-hidden">
              {userProfile?.coverPhoto && (
                <div 
                  className="group relative w-full h-full"
                  onMouseEnter={() => setHoverCover(true)}
                  onMouseLeave={() => setHoverCover(false)}
                  onClick={() => openFullscreen(userProfile.coverPhoto)}
                >
                  <Image
                    src={userProfile.coverPhoto}
                    fill
                    alt="Cover Photo"
                    className="rounded-t-xl object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className={`absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                      <Maximize2 className="text-white" size={20} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Profile picture with hover effect */}
            <div 
              className="relative size-48 z-10 ml-6 bg-gray-500 rounded-full border-8 border-foreground mt-10 overflow-hidden group"
              onMouseEnter={() => setHoverProfile(true)}
              onMouseLeave={() => setHoverProfile(false)}
              onClick={() => userProfile?.profilePicture && openFullscreen(userProfile.profilePicture)}
            >
              {userProfile?.profilePicture ? (
                <>
                  <Image
                    src={userProfile.profilePicture}
                    alt="User Avatar"
                    fill
                    className="rounded-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                      <Maximize2 className="text-white" size={18} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-semibold text-gray-100">
                  {userProfile?.name?.slice(0,2).toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="py-4 px-8 flex">
          <div>
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">{userProfile?.name}</h1>
              {!userProfile?.isMyProfile && (
                <h6 className="text-muted ml-2">•</h6>
              )}
              {!userProfile?.isMyProfile && (
                <span className="text-muted ml-2">{userProfile?.relation}</span>
              )}
            </div>
            <h2 className="text-muted font-medium">{userProfile?.headline}</h2>
            <p className="text-muted text-sm mt-2">{userProfile?.industry}</p>
            <div className="flex gap-2 items-center">
              <p className="text-muted text-sm">{userProfile?.location}</p>
              <h6 className="text-muted">•</h6>
              <ContactInfoPresentation
                userInfo={userProfile}
                onCopy={onCopy}
                onEmail={onEmail}
                copied={copied}
              />
            </div>
            <Connections userInfo={userProfile} />
          </div>
          <div className="flex ml-auto self-end">
            <ModHeader userInfo={userProfile} />
          </div>
        </div>
      </Container>

      {/* Enhanced Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fadeIn"
          onClick={closeFullscreen}
        >
          <div 
            className="relative max-w-[95vw] max-h-[95vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-12 right-0 text-white bg-black/60 rounded-full cursor-pointer p-2.5 hover:bg-black/20 transition-colors duration-200 shadow-lg"
              onClick={closeFullscreen}
              aria-label="Close fullscreen image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img 
              src={fullscreenImage} 
              alt="Full screen" 
              className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
