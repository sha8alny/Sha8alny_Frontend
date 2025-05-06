import Container from "@/app/components/layout/Container";
import Image from "next/image";
import ModHeader from "../container/ModHeader";
import ContactInfoPresentation from "./ContactInfoPresentation";
import Connections from "../container/Connections";
import { Maximize2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropDownMenu";
import {
  BlockOutlined,
  FlagOutlined,
  MessageOutlined,
  MoreHoriz,
  PersonAddAlt1,
  PersonRemoveAlt1,
} from "@mui/icons-material";
import Dialog from "@/app/components/ui/DialogMod";
import GeneralDeletePresentation from "@/app/components/layout/GeneralDelete";
import ReportPresentation from "../../feed/presentation/ReportPresentation";

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
  onReport,
  reportState,
  reportUserModalOpen,
  setReportUserModalOpen,
  reportType,
  setReportType,
  reportText,
  setReportText,
  blockUserModalOpen,
  setBlockUserModalOpen,
  removeConnectionModalOpen,
  setRemoveConnectionModalOpen,
  navigateTo,
  onBlock,
  isBlocking,
  isBlockingError,
  onFollow,
  isHandlingFollow,
  isHandlingFollowError,
  onRemoveConnection,
  isRemovingConnection,
  isRemovingConnectionError,
  onSendMessageRequest,
  isSendingMessageRequest,
}) {
  return (
    <>
      <Container
        className="dark:border-[#111] border shadow-lg"
        data-testid="profile-header-container"
      >
        <div className="w-full h-max rounded-xl">
          <div className="relative w-full flex">
            {/* Cover photo with hover effect */}
            <div
              className="absolute top-0 left-0 w-full h-40 bg-gray-700 rounded-t-xl overflow-hidden"
              data-testid="profile-cover-photo-section"
            >
              {userProfile?.coverPhoto && (
                <div
                  className="group relative w-full h-full"
                  onMouseEnter={() => setHoverCover(true)}
                  onMouseLeave={() => setHoverCover(false)}
                  onClick={() => openFullscreen(userProfile.coverPhoto)}
                  data-testid="profile-cover-photo-clickable"
                >
                  <Image
                    src={userProfile.coverPhoto}
                    fill
                    alt="Cover Photo"
                    className="rounded-t-xl object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    data-testid="profile-cover-photo-image"
                  />
                  <div
                    className={`absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    data-testid="profile-cover-photo-overlay"
                  >
                    <div
                      className="bg-black/50 p-2 rounded-full backdrop-blur-sm"
                      data-testid="profile-cover-photo-maximize-icon"
                    >
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
              onClick={() =>
                userProfile?.profilePicture &&
                openFullscreen(userProfile.profilePicture)
              }
              data-testid="profile-picture-section"
            >
              {userProfile?.profilePicture ? (
                <>
                  <Image
                    src={userProfile.profilePicture}
                    alt="User Avatar"
                    fill
                    className="rounded-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    data-testid="profile-picture-image"
                  />
                  <div
                    className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    data-testid="profile-picture-overlay"
                  >
                    <div
                      className="bg-black/50 p-2 rounded-full backdrop-blur-sm"
                      data-testid="profile-picture-maximize-icon"
                    >
                      <Maximize2 className="text-white" size={18} />
                    </div>
                  </div>
                </>
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-4xl font-semibold text-gray-100"
                  data-testid="profile-picture-fallback"
                >
                  {userProfile?.name?.slice(0, 2).toUpperCase() || "U"}
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="py-4 px-8 flex flex-col md:flex-row"
          data-testid="profile-info-section"
        >
          <div className="w-full">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold" data-testid="profile-name">
                  {userProfile?.name}
                </h1>
                {!userProfile?.isMyProfile && (
                  <h6 className="text-muted ml-2">•</h6>
                )}
                {!userProfile?.isMyProfile && (
                  <span
                    className="text-muted ml-2"
                    data-testid="profile-relation"
                  >
                    {userProfile?.relation}
                  </span>
                )}
              </div>
              {!userProfile?.isMyProfile && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="cursor-pointer p-2 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors"
                      data-testid={`connection-options-trigger-${userProfile?.username}`}
                    >
                      <MoreHoriz
                        className="text-muted"
                        sx={{ fontSize: "1rem" }}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-foreground text-primary border"
                    data-testid={`connection-options-content-${userProfile?.username}`}
                  >
                    <DropdownMenuItem
                      className="hover:bg-primary/20 cursor-pointer"
                      data-testid={`connection-follow-option-${userProfile?.username}`}
                      onClick={onFollow}
                    >
                      {isHandlingFollow && (
                        <div
                          className="size-4 border-2 border-t-transparent border-primary/80 rounded-full animate-spin mr-2"
                          data-testid={`connection-follow-spinner-${userProfile?.username}`}
                        />
                      )}
                      {isHandlingFollowError && (
                        <span
                          className="text-red-500 mr-2"
                          data-testid={`connection-follow-error-${userProfile?.username}`}
                        >
                          Error
                        </span>
                      )}
                      {!isHandlingFollow && !isHandlingFollowError && (
                        <>
                          {userProfile?.isFollowing ? (
                            <PersonRemoveAlt1
                              className="mr-2"
                              data-testid={`connection-unfollow-icon-${userProfile?.username}`}
                              sx={{ fontSize: "1rem" }}
                            />
                          ) : (
                            <PersonAddAlt1
                              className="mr-2"
                              data-testid={`connection-follow-icon-${userProfile?.username}`}
                              sx={{ fontSize: "1rem" }}
                            />
                          )}
                          <span
                            data-testid={`connection-follow-text-${userProfile?.username}`}
                          >
                            {userProfile?.isFollowing ? "Unfollow" : "Follow"}
                          </span>
                        </>
                      )}
                    </DropdownMenuItem>
                    {!userProfile.isBlocked && <DropdownMenuItem
                      className="hover:bg-primary/20 cursor-pointer"
                      data-testid={`connection-message-option-${userProfile?.username}`}
                      disabled={isSendingMessageRequest}
                      onClick={() =>
                        userProfile?.connectionStatus === "connected"
                          ? navigateTo(
                              `/messages?username=${userProfile?.username}`
                            )
                          : onSendMessageRequest()
                      }
                    >
                      <MessageOutlined
                        className="mr-2"
                        sx={{ fontSize: "1rem" }}
                      />
                      {isSendingMessageRequest ? (
                        <span>Sending...</span>
                      ) : (
                        <span>Message</span>
                      )}
                    </DropdownMenuItem>}
                    <DropdownMenuItem
                      className="hover:bg-primary/20 cursor-pointer"
                      data-testid={`connection-report-option-${userProfile?.username}`}
                      onClick={() => setReportUserModalOpen(true)}
                    >
                      <FlagOutlined
                        className="mr-2"
                        sx={{ fontSize: "1rem" }}
                      />
                      <span>Report</span>
                    </DropdownMenuItem>
                    {userProfile?.connectionStatus === "connected" && (
                      <DropdownMenuItem
                        className="hover:bg-primary/20 cursor-pointer"
                        data-testid={`connection-remove-option-${userProfile?.username}`}
                        onClick={() => setRemoveConnectionModalOpen(true)}
                      >
                        <PersonRemoveAlt1
                          className="mr-2"
                          sx={{ fontSize: "1rem" }}
                        />
                        <span>Remove Connection</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="hover:bg-primary/20 cursor-pointer font-black text-red-400 hover:text-red-400"
                      data-testid={`connection-block-option-${userProfile?.username}`}
                      onClick={() => setBlockUserModalOpen(true)}
                    >
                      {!userProfile?.isBlocked ? (
                        <PersonRemoveAlt1
                          data-testid={`connection-block-icon-${userProfile?.username}`}
                          className="mr-2"
                          sx={{ fontSize: "1rem" }}
                        />
                      ) : (
                        <PersonAddAlt1
                          data-testid={`connection-unblock-icon-${userProfile?.username}`}
                          className="mr-2"
                          sx={{ fontSize: "1rem" }}
                        />
                      )}
                      <span>
                        {userProfile?.isBlocked ? "Unblock" : "Block"}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <h2
              className="text-muted font-medium"
              data-testid="profile-headline"
            >
              {userProfile?.headline}
            </h2>
            <p
              className="text-muted text-sm mt-2"
              data-testid="profile-industry"
            >
              {userProfile?.industry}
            </p>
            <div className="flex gap-2 items-center">
              <p className="text-muted text-sm" data-testid="profile-location">
                {userProfile?.location}
              </p>
              {!userProfile?.isBlocked && (<h6 className="text-muted">•</h6>)}
              <div data-testid="profile-contact-info">
                {!userProfile?.isBlocked && (
                  <ContactInfoPresentation
                    userInfo={userProfile}
                    onCopy={onCopy}
                    onEmail={onEmail}
                    copied={copied}
                  />
                )}
              </div>
            </div>
            <div
              className="w-full md:justify-between flex md:flex-row flex-col"
              data-testid="profile-connections"
            >
              <div>
                {!userProfile?.isBlocked && (
                  <Connections userInfo={userProfile} />
                )}
              </div>
              <div
                className="flex flex-wrap mt-4 md:mt-0 md:ml-auto md:self-end"
                data-testid="profile-mod-header"
              >
                {!userProfile?.isBlocked && (
                  <ModHeader userInfo={userProfile} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Dialog
        open={removeConnectionModalOpen}
        onOpenChange={setRemoveConnectionModalOpen}
        buttonClass="hidden"
        AlertContent={
          <GeneralDeletePresentation
            onConfirmDelete={onRemoveConnection}
            isLoading={isRemovingConnection}
            isError={isRemovingConnectionError}
            error={false}
            onOpenChange={setRemoveConnectionModalOpen}
            itemType="Connection"
            loadingText="Removing connection..."
            errorTitle="Error"
            errorMessage="Failed to remove connection"
            confirmTitle="Remove Connection"
            confirmMessage="This action cannot be undone. Are you sure you want to remove this connection?"
            confirmButtonText="Remove"
            cancelButtonText="Cancel"
          />
        }
      />

      {/* Report User Modal */}
      <Dialog
        open={reportUserModalOpen}
        onOpenChange={setReportUserModalOpen}
        buttonClass="hidden"
        AlertContent={
          <ReportPresentation
            type="user"
            reportState={reportState}
            reportText={reportText}
            setReportText={setReportText}
            reportType={reportType}
            setReportType={setReportType}
            onReport={onReport}
          />
        }
      />
      {/* Block User Modal */}
      <Dialog
        open={blockUserModalOpen}
        onOpenChange={setBlockUserModalOpen}
        buttonClass="hidden"
        AlertContent={
          <GeneralDeletePresentation
            onConfirmDelete={onBlock}
            isLoading={isBlocking}
            isError={isBlockingError}
            error={
              userProfile?.isBlocked
                ? "Failed to unblock user."
                : "Failed to block user."
            }
            onOpenChange={setBlockUserModalOpen}
            itemType="User"
            loadingText={
              userProfile?.isBlocked ? "Unblocking user..." : "Blocking user..."
            }
            errorTitle="Error"
            errorMessage={
              userProfile?.isBlocked
                ? "Failed to unblock user."
                : "Failed to block user."
            }
            confirmTitle={`${userProfile.isBlocked ? "Unblock" : "Block"} ${userProfile?.name}`}
            confirmMessage={
              userProfile?.isBlocked
                ? "Are you sure you want to unblock this user?"
                : "Are you sure you want to block this user?"
            }
            confirmButtonText={userProfile?.isBlocked ? "Unblock" : "Block"}
            cancelButtonText="Cancel"
            Icon={userProfile?.isBlocked ? PersonAddAlt1 : BlockOutlined}
          />
        }
      />

      {/* 
        Enhanced Fullscreen Image Modal
        
        A modal component that displays profile or cover photos in fullscreen mode.
        Features:
        - Animated entrance/exit with fade and scale effects
        - Click outside to dismiss
        - Dedicated close button for accessibility
        - Prevents event propagation on image click
        - Responsive sizing with max dimensions based on viewport
        
        The modal is only rendered when fullscreenImage state contains an image URL.
      */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fadeIn"
          onClick={closeFullscreen}
          data-testid="fullscreen-image-modal"
          aria-modal="true"
          role="dialog"
          aria-label="Fullscreen image viewer"
        >
          <div
            className="relative max-w-[95vw] max-h-[95vh] animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
            data-testid="fullscreen-image-container"
          >
            <button
              className="absolute -top-12 right-0 text-white dark:text-black dark:bg-white dark:hover:bg-white/70 bg-black/60 rounded-full cursor-pointer p-2.5 hover:bg-black/20 transition-colors duration-200 shadow-lg"
              onClick={closeFullscreen}
              aria-label="Close fullscreen image"
              data-testid="fullscreen-image-close-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <img
              src={fullscreenImage}
              alt="Full screen"
              className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
              data-testid="fullscreen-image"
            />
          </div>
        </div>
      )}
    </>
  );
}

/**
 * ProfileHeaderSkeleton - Loading placeholder for the profile header section
 * 
 * This component renders a skeleton UI while the profile data is being loaded,
 * maintaining the same structure as the actual profile header but with placeholder
 * elements that have loading animations.
 *
 * @returns {JSX.Element} Animated loading skeleton for profile header
 */
export function ProfileHeaderSkeleton() {
  return (
    <Container
      className="dark:border-[#111] border shadow-lg animate-pulse"
      data-testid="profile-header-skeleton"
    >
      <div className="w-full h-max rounded-2xl">
        <div className="relative w-full flex">
          {/* Cover photo skeleton */}
          <div
            className="absolute top-0 left-0 w-full h-40 bg-primary/60 rounded-t-xl"
            data-testid="profile-cover-photo-skeleton"
          />

          {/* Profile picture skeleton */}
          <div
            className="relative size-48 z-10 ml-6 bg-primary/60 rounded-full border-8 border-foreground mt-10"
            data-testid="profile-picture-skeleton"
          />
        </div>
      </div>
      <div className="py-4 px-8 flex flex-col md:flex-row">
        <div className="w-full">
          {/* Name skeleton */}
          <div className="flex justify-between items-center w-full">
            <div
              className="w-48 h-8 bg-primary/60 rounded-2xl mb-2"
              data-testid="profile-name-skeleton"
            />
          </div>

          {/* Headline skeleton */}
          <div
            className="w-72 h-5 bg-primary/60 rounded-2xl mt-2"
            data-testid="profile-headline-skeleton"
          />

          {/* Industry skeleton */}
          <div
            className="w-40 h-4 bg-primary/60 rounded-2xl mt-4"
            data-testid="profile-industry-skeleton"
          />

          {/* Location and contact info skeleton */}
          <div className="flex gap-2 items-center mt-2">
            <div
              className="w-32 h-4 bg-primary/60 rounded-2xl"
              data-testid="profile-location-skeleton"
            />
            •
            <div
              className="w-24 h-4 bg-primary/60 rounded-2xl"
              data-testid="profile-contact-info-skeleton"
            />
          </div>

          {/* Connections and action buttons skeleton */}
          <div className="w-full md:justify-between flex md:flex-row flex-col mt-4">
            <div
              className="w-48 h-6 bg-primary/60 rounded-2xl"
              data-testid="profile-connections-skeleton"
            />
            <div className="flex flex-wrap mt-4 md:mt-0 md:ml-auto md:self-end gap-2">
              <div className="w-24 h-8 bg-primary/60 rounded-2xl" />
              <div className="w-24 h-8 bg-primary/60 rounded-2xl" />
              <div className="w-24 h-8 bg-primary/60 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
