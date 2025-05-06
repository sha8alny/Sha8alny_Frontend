import DialogMod from "@/app/components/ui/DialogMod";
import { ModifyProfileContainer } from "../container/ModHeader";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/Tabs";
import { Label } from "@/app/components/ui/Label";
import { Input } from "@/app/components/ui/Input";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button } from "@/app/components/ui/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AlertDialogCancel } from "@/app/components/ui/AlertDialog";
import { Cancel, CheckBox, Close, Upload } from "@mui/icons-material";
import { X, Loader2 } from "lucide-react";
import Image from "next/image";

/**
 * @namespace profile
 * @module profile
 * @description Components for displaying and editing profile header information
 */

/**
 * ModHeaderPresentation - Profile header component with conditional action buttons
 * 
 * This component renders different UI elements based on whether the profile 
 * belongs to the current user or another user. It provides functionality for:
 * - Resume download button (if available)
 * - Edit profile button (for the user's own profile)
 * - Connection management (connect, message, accept/decline) for other users' profiles
 * - Loading states for connection actions
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isMyProfile - Whether the profile belongs to the current user
 * @param {Object} props.userInfo - User profile information
 * @param {string} [props.userInfo.resume] - URL to user's resume if available
 * @param {Function} props.handleClick - Function to handle connection button clicks
 * @param {Function} props.handleResumeDownload - Function to handle resume download
 * @param {boolean} props.isConnecting - Whether a connection request is in progress
 * @param {boolean} props.isHandlingRequest - Whether handling an incoming connection request
 * @param {string} props.connectionStatus - Current connection status ("connected", "pending", "requestReceived", "notConnected")
 * @returns {JSX.Element} Profile header UI with appropriate action buttons
 */
export default function ModHeaderPresentation({
  isMyProfile,
  userInfo,
  handleClick,
  handleResumeDownload,
  isConnecting,
  isHandlingRequest,
  connectionStatus,
}) {
  return (
    <>
      {isMyProfile && (
        <>
          {userInfo?.resume && (
            <ButtonProfile
              text="Download Resume"
              onClick={handleResumeDownload}
              testId="download-resume-button"
            />
          )}
        </>
      )}
      {isMyProfile ? (
        <DialogMod
          useRegularButton
          buttonClass="bg-secondary ml-2 text-background text-sm rounded-md cursor-pointer py-2 px-4 font-semibold hover:opacity-90 duration-250"
          className="min-w-[60vh]"
          buttonData={"Edit Profile"}
          testId="edit-profile-button"
          AlertContent={<ModifyProfileContainer userInfo={userInfo} />}
        />
      ) : (
        <div className="flex gap-4" data-testid="other-profile-actions">
          {userInfo?.resume && (
            <ButtonProfile
              text="Download Resume"
              onClick={handleResumeDownload}
              testId="download-resume-button"
            />
          )}
          {connectionStatus === "requestReceived" && (
            <div className="flex gap-3">
              {isHandlingRequest && (
                <ButtonProfile
                  text={
                    <div className="flex items-center gap-1 text-background/70">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending Decision...</span>
                    </div>
                  }
                />
              )}
              {!isHandlingRequest && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleClick("ACCEPT")}
                    className="flex items-center justify-center gap-1.5 bg-green-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 transition-colors duration-200 text-sm text-background font-semibold"
                  >
                    <CheckCircleIcon sx={{ fontSize: "1.125rem" }} />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleClick("DECLINE")}
                    className="flex items-center justify-center gap-1.5 bg-red-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 transition-colors duration-200 text-sm text-background font-semibold"
                  >
                    <Cancel sx={{ fontSize: "1.125rem" }} />
                    <span>Decline</span>
                  </button>
                </div>
              )}
            </div>
          )}
          {connectionStatus !== "requestReceived" && (
            <ButtonProfile
              disabled={
                userInfo?.connectionStatus === "pending" || isConnecting
              }
              text={
                isConnecting ? (
                  <div className="flex items-center gap-1 text-background/70">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Sending Request...</span>
                  </div>
                ) : connectionStatus === "connected" ? (
                  "Message"
                ) : connectionStatus === "pending" ? (
                  "Awaiting Response"
                ) : (
                  "Connect"
                )
              }
              onClick={() => handleClick()}
              testId={
                userInfo?.connectionStatus === "connected"
                  ? "message-button"
                  : userInfo?.connectionStatus === "pending"
                  ? "awaiting-response-button"
                  : "connect-button"
              }
            />
          )}
        </div>
      )}
    </>
  );
}

/**
 * ButtonProfile - Standardized button component for profile actions
 * 
 * Renders a consistent styled button used throughout the profile interface
 * with support for disabled states and custom text/content.
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.text - Button text or content (can be JSX)
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.testId - Test ID for the button element
 * @returns {JSX.Element} Styled button component
 */
const ButtonProfile = ({ text, disabled = false, onClick, testId }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="disabled:bg-secondary/60 disabled:cursor-default bg-secondary text-background text-sm rounded-md cursor-pointer py-2 px-4 font-semibold hover:bg-secondary/90 duration-250"
      data-testid={testId}
    >
      {text}
    </button>
  );
};

/**
 * ModifyProfilePresentation - Comprehensive form for editing profile information
 * 
 * Multi-stage component that provides tabbed interface for editing profile details including:
 * - Profile and cover pictures with upload/preview functionality
 * - Personal information (name, location, headline, industry)
 * - Resume upload and management
 * - Real-time preview of profile changes
 * - Form validation with error messages
 * - Loading, success, and error state displays
 * 
 * @param {Object} props - Component props
 * @param {string} props.profilePicture - Current profile picture URL
 * @param {string} props.coverPicture - Current cover picture URL
 * @param {Function} props.setCoverPicture - Function to update cover picture
 * @param {Function} props.setProfilePicture - Function to update profile picture
 * @param {string} props.name - User's name
 * @param {Function} props.setName - Function to update name
 * @param {string} props.location - User's location
 * @param {Function} props.setLocation - Function to update location
 * @param {string} props.headline - User's professional headline
 * @param {Function} props.setHeadline - Function to update headline
 * @param {string} props.resume - User's resume URL
 * @param {Function} props.setResume - Function to update resume
 * @param {number} props.currentStage - Current form stage (0: edit, 1: loading, 2: success, 3: error)
 * @param {string|null} props.error - Error message
 * @param {Function} props.handleFileChange - Handler for file input changes
 * @param {Function} props.removeFile - Handler to remove uploaded files
 * @param {Function} props.onSubmit - Form submission handler
 * @param {string|null} props.nameError - Name validation error
 * @param {string|null} props.locationError - Location validation error
 * @param {string|null} props.headlineError - Headline validation error
 * @param {boolean} props.isProfilePictureLoading - Whether profile picture is uploading
 * @param {boolean} props.isCoverPictureLoading - Whether cover picture is uploading
 * @param {boolean} props.isResumeLoading - Whether resume is uploading
 * @param {string|null} props.profilePictureError - Profile picture error message
 * @param {string|null} props.coverPictureError - Cover picture error message
 * @param {string|null} props.resumeError - Resume error message
 * @param {string} props.industry - User's industry
 * @param {Function} props.setIndustry - Function to update industry
 * @param {string|null} props.industryError - Industry validation error
 * @returns {JSX.Element} Multi-stage profile editing interface
 */
export const ModifyProfilePresentation = ({
  profilePicture,
  coverPicture,
  setCoverPicture,
  setProfilePicture,
  name,
  setName,
  location,
  setLocation,
  headline,
  setHeadline,
  resume,
  setResume,
  currentStage,
  error,
  handleFileChange,
  removeFile,
  onSubmit,
  nameError,
  locationError,
  headlineError,
  isProfilePictureLoading,
  isCoverPictureLoading,
  isResumeLoading,
  profilePictureError,
  coverPictureError,
  resumeError,
  industry,
  setIndustry,
  industryError,
}) => {
  return (
    <>
      {currentStage === 0 && (
        <Tabs
          defaultValue="edit"
          className="w-full"
          data-testid="edit-profile-tabs"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit" data-testid="edit-tab-trigger">
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" data-testid="preview-tab-trigger">
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <form
              onSubmit={onSubmit}
              className="grid gap-6 py-4"
              data-testid="edit-profile-form"
            >
              <div className="space-y-2">
                <Label htmlFor="coverPicture">Cover Picture</Label>
                <div className="relative">
                  {coverPicture && !isCoverPictureLoading && (
                    <div
                      className="relative mb-2 rounded-md overflow-hidden h-32"
                      data-testid="cover-picture-preview"
                    >
                      <Image
                        src={coverPicture}
                        alt="Cover"
                        className="w-full h-full object-cover"
                        fill
                        placeholder="blur"
                        blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg=="
                      />
                      <Button
                        type="button"
                        size="icon"
                        data-testid="remove-cover"
                        className="absolute top-2 right-2 hover:bg-destructive/80 bg-destructive text-primary cursor-pointer"
                        onClick={() => removeFile("cover")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {isCoverPictureLoading && (
                    <div
                      className="flex justify-center items-center h-32 mb-2 bg-muted rounded-md"
                      data-testid="cover-picture-loading"
                    >
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {coverPictureError && (
                    <p
                      className="text-destructive text-sm mb-2"
                      data-testid="cover-picture-error"
                    >
                      {coverPictureError}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="coverPictureInput"
                      data-testid="cover-picture-upload-label"
                      className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted ${
                        isCoverPictureLoading
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      {isCoverPictureLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {coverPicture
                        ? "Change Cover Picture"
                        : "Upload Cover Picture"}
                    </Label>
                    <Input
                      id="coverPictureInput"
                      type="file"
                      accept="image/*"
                      data-testid="cover-picture-input"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, "cover")}
                      disabled={isCoverPictureLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <div className="relative">
                  {profilePicture && !isProfilePictureLoading && (
                    <div
                      className="relative flex"
                      data-testid="profile-picture-preview-container"
                    >
                      <div
                        className="relative mb-2 w-24 h-24 rounded-full overflow-hidden"
                        data-testid="profile-picture-preview"
                      >
                        <Image
                          src={profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          fill
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg=="
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        data-testid="remove-profile"
                        className="absolute left-0 hover:bg-destructive/80 bg-destructive text-primary cursor-pointer"
                        onClick={() => removeFile("profile")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {isProfilePictureLoading && (
                    <div
                      className="flex justify-center items-center w-24 h-24 mb-2 bg-muted rounded-full"
                      data-testid="profile-picture-loading"
                    >
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {profilePictureError && (
                    <p
                      className="text-destructive text-sm mb-2"
                      data-testid="profile-picture-error"
                    >
                      {profilePictureError}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="profilePictureInput"
                      data-testid="profile-picture-upload-label"
                      className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted ${
                        isProfilePictureLoading
                          ? "opacity-50 pointer-events-none"
                          : ""
                      }`}
                    >
                      {isProfilePictureLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {profilePicture
                        ? "Change Profile Picture"
                        : "Upload Profile Picture"}
                    </Label>
                    <Input
                      id="profilePictureInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      data-testid="profile-picture-input"
                      onChange={(e) => handleFileChange(e, "profile")}
                      disabled={isProfilePictureLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  data-testid="name-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                {nameError && (
                  <p className="text-red-500 text-sm" data-testid="name-error">
                    {nameError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  data-testid="location-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your location"
                />
                {locationError && (
                  <p
                    className="text-red-500 text-sm"
                    data-testid="location-error"
                  >
                    {locationError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  data-testid="headline-input"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Your professional headline"
                />
                {headlineError && (
                  <p
                    className="text-red-500 text-sm"
                    data-testid="headline-error"
                  >
                    {headlineError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  data-testid="industry-input"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Your industry"
                />
                {industryError && (
                  <p
                    className="text-red-500 text-sm"
                    data-testid="industry-error"
                  >
                    {industryError}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <div className="relative">
                  {resume && !isResumeLoading && (
                    <div
                      className="flex items-center justify-between p-2 mb-2 border rounded-md"
                      data-testid="resume-display"
                    >
                      <span
                        className="text-sm truncate max-w-[400px]"
                        data-testid="resume-filename"
                      >
                        {typeof resume === "string"
                          ? resume.split("/").pop()
                          : "Resume uploaded"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        data-testid="remove-resume"
                        onClick={() => removeFile("resume")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {isResumeLoading && (
                    <div
                      className="flex justify-center items-center h-12 mb-2 bg-muted rounded-md"
                      data-testid="resume-loading"
                    >
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {resumeError && (
                    <p
                      className="text-destructive text-sm mb-2"
                      data-testid="resume-error"
                    >
                      {resumeError}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="resumeInput"
                      data-testid="resume-upload-label"
                      className={`cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted ${
                        isResumeLoading ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      {isResumeLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {resume ? "Change Resume" : "Upload Resume"}
                    </Label>
                    <Input
                      id="resumeInput"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      data-testid="resume-input"
                      onChange={(e) => handleFileChange(e, "resume")}
                      disabled={isResumeLoading}
                    />
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview">
            <div className="py-4" data-testid="profile-preview">
              <div className="rounded-lg overflow-hidden border shadow-sm">
                {/* Cover Picture */}
                <div
                  className="h-40 bg-muted relative"
                  data-testid="preview-cover-container"
                >
                  {coverPicture ? (
                    <Image
                      src={coverPicture}
                      alt="Cover"
                      className="w-full h-full object-cover"
                      fill
                      placeholder="blur"
                      blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iIzAwMDAwMCIvPjwvc3ZnPg=="
                      data-testid="preview-cover-image"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-400 dark:from-gray-100 dark:to-gray-200">
                      <span
                        className="text-background dark:text-muted-foreground"
                        data-testid="preview-no-cover"
                      >
                        No cover picture
                      </span>
                    </div>
                  )}

                  {/* Profile Picture */}
                  <div className="absolute -bottom-16 left-6">
                    <div
                      className="w-32 h-32 rounded-full border-4 border-background overflow-hidden"
                      data-testid="preview-profile-container"
                    >
                      {profilePicture ? (
                        <img
                          src={profilePicture || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          data-testid="preview-profile-image"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span
                            className="text-2xl"
                            data-testid="preview-no-profile"
                          >
                            👤
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-20 pb-6 px-6">
                  <h2
                    className="text-left text-2xl font-bold"
                    data-testid="preview-name"
                  >
                    {name || "Your Name"}
                  </h2>
                  <div>
                    <p
                      className="text-sm text-muted-foreground"
                      data-testid="preview-headline"
                    >
                      {headline ||
                        "Your professional headline will appear here"}
                    </p>
                  </div>
                  <p
                    className="text-left text-muted-foreground text-sm"
                    data-testid="preview-location"
                  >
                    {location || "Your Location"}
                  </p>
                  <p
                    className="text-left text-muted-foreground text-sm"
                    data-testid="preview-industry"
                  >
                    {industry || "Your Industry"}
                  </p>

                  {resume && (
                    <div
                      className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
                      data-testid="preview-resume-attached"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-file"
                      >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0-2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <span>Resume attached</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          <div className="flex gap-2 w-full">
            <AlertDialogCancel
              data-testid="cancel-edit-button"
              className="flex-1 bg-red-700 rounded-2xl font-semibold cursor-pointer hover:bg-red-700/70 dark:bg-red-400 dark:hover:bg-red-300 hover:text-background"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              className="flex-1 bg-secondary font-semibold rounded-2xl cursor-pointer hover:bg-secondary/80"
              data-testid="submit-edit-button"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </div>
        </Tabs>
      )}
      {currentStage === 1 && (
        <div
          className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center"
          data-testid="loading-stage"
        >
          <div className="size-12 animate-spin border-2 border-t-transparent rounded-full border-secondary" />
          Modifying...
        </div>
      )}
      {currentStage === 2 && (
        <div
          className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center"
          data-testid="success-stage"
        >
          <CheckCircleIcon className="text-secondary" sx={{ fontSize: 60 }} />
          <h2 className="text-2xl font-bold">Profile Updated</h2>
          <p className="text-muted-foreground">
            Your profile has been successfully updated!
          </p>
          <p>You can close the window now.</p>
        </div>
      )}
      {currentStage === 3 && (
        <div
          className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center"
          data-testid="error-stage"
        >
          <CancelIcon className="text-destructive" sx={{ fontSize: 60 }} />
          <h2 className="text-2xl font-bold">Error</h2>
          <p
            className="text-muted-foreground"
            data-testid="error-stage-message"
          >
            {error}
          </p>
          <p>Please try again.</p>
          <p>You can close the window now.</p>
        </div>
      )}
    </>
  );
};
