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
import CancelIcon from '@mui/icons-material/Cancel';
import { Button } from "@/app/components/ui/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AlertDialogCancel } from "@/app/components/ui/AlertDialog";
import { Upload, X } from "@mui/icons-material";

/**
 * @namespace profile
 * @module profile
 */
export default function ModHeaderPresentation({
  isMyProfile,
  isConnected,
  userInfo,
  pendingConnection,
  handleConnect,
  handleResumeDownload,
  handleSubmit,
}) {
  return (
    <>
      {isMyProfile ? (
        <DialogMod
          useRegularButton
          buttonClass="bg-secondary text-background text-sm rounded-md cursor-pointer py-2 px-4 font-semibold hover:opacity-90 duration-250"
          className="min-w-[60vh]"
          buttonData={"Edit Profile"}
          AlertContent={
            <ModifyProfileContainer
              userInfo={userInfo}
              handleSubmit={handleSubmit}
            />
          }
        />
      ) : (
        <div className="flex gap-4">
          {userInfo?.resume && (
            <ButtonProfile
              text="Download Resume"
              onClick={handleResumeDownload}
            />
          )}
          <ButtonProfile
            text={
              isConnected
                ? "Message"
                : pendingConnection
                ? "Awaiting Response"
                : "Connect"
            }
            onClick={() => handleConnect(userInfo.username)}
          />
        </div>
      )}
    </>
  );
}

const ButtonProfile = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-secondary text-background text-sm rounded-md cursor-pointer py-2 px-4 font-semibold hover:opacity-90 duration-250"
    >
      {text}
    </button>
  );
};

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
}) => {
  return (
    <>
      {currentStage === 0 && (
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <form onSubmit={onSubmit} className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="coverPicture">Cover Picture</Label>
                <div className="relative">
                  {coverPicture && (
                    <div className="relative mb-2 rounded-md overflow-hidden h-32">
                      <img
                        src={coverPicture || "/placeholder.svg"}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => removeFile(setCoverPicture)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="coverPictureInput"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted"
                    >
                      <Upload className="h-4 w-4" />
                      {coverPicture
                        ? "Change Cover Picture"
                        : "Upload Cover Picture"}
                    </Label>
                    <Input
                      id="coverPictureInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setCoverPicture)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profilePicture">Profile Picture</Label>
                <div className="relative">
                  {profilePicture && (
                    <div className="relative mb-2 w-24 h-24 rounded-full overflow-hidden">
                      <img
                        src={profilePicture || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-0 right-0"
                        onClick={() => removeFile(setProfilePicture)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="profilePictureInput"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted"
                    >
                      <Upload className="h-4 w-4" />
                      {profilePicture
                        ? "Change Profile Picture"
                        : "Upload Profile Picture"}
                    </Label>
                    <Input
                      id="profilePictureInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setProfilePicture)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
                {nameError && (
                  <p className="text-red-500 text-sm">{nameError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your location"
                />
                {locationError && (
                  <p className="text-red-500 text-sm">{locationError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Your professional headline"
                />
                {headlineError && (
                  <p className="text-red-500 text-sm">{headlineError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume</Label>
                <div className="relative">
                  {resume && (
                    <div className="flex items-center justify-between p-2 mb-2 border rounded-md">
                      <span className="text-sm truncate max-w-[400px]">
                        {typeof resume === "string"
                          ? resume.split("/").pop()
                          : "Resume uploaded"}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFile(setResume)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Label
                      htmlFor="resumeInput"
                      className="cursor-pointer flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-muted"
                    >
                      <Upload className="h-4 w-4" />
                      {resume ? "Change Resume" : "Upload Resume"}
                    </Label>
                    <Input
                      id="resumeInput"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, setResume)}
                    />
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="preview">
            <div className="py-4">
              <div className="rounded-lg overflow-hidden border shadow-sm">
                {/* Cover Picture */}
                <div className="h-40 bg-muted relative">
                  {coverPicture ? (
                    <img
                      src={coverPicture || "/placeholder.svg"}
                      alt="Cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-400 to-gray-400 dark:from-gray-100 dark:to-gray-200">
                      <span className="text-background dark:text-muted-foreground">
                        No cover picture
                      </span>
                    </div>
                  )}

                  {/* Profile Picture */}
                  <div className="absolute -bottom-16 left-6">
                    <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden">
                      {profilePicture ? (
                        <img
                          src={profilePicture || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <span className="text-2xl">👤</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="pt-20 pb-6 px-6">
                  <h2 className="text-2xl font-bold">{name || "Your Name"}</h2>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {headline ||
                        "Your professional headline will appear here"}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {location || "Your Location"}
                  </p>


                  {resume && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
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
            <AlertDialogCancel className="flex-1 bg-red-700 rounded-2xl font-semibold cursor-pointer hover:bg-red-700/70 dark:bg-red-400 dark:hover:bg-red-300 hover:text-background">
              Cancel
            </AlertDialogCancel>
            <Button
              className="flex-1 bg-secondary font-semibold rounded-2xl cursor-pointer hover:bg-secondary/80"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </div>
        </Tabs>
      )}
      {currentStage === 1 && (
        <div className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center">
          <div className="size-12 animate-spin border-2 border-t-transparent rounded-full border-secondary" />
          Modifying...
        </div>
      )}
      {currentStage === 2 && (
        <div className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center">
          <CheckCircleIcon className="text-secondary" sx={{ fontSize: 60 }} />
          <h2 className="text-2xl font-bold">Profile Updated</h2>
          <p className="text-muted-foreground">
            Your profile has been successfully updated!
          </p>
          <p>You can close the window now.</p>
        </div>
      )}
      {currentStage === 3 && (
        <div className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center">
          <CancelIcon className="text-destructive" sx={{ fontSize: 60 }} />
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <p>Please try again.</p>
          <p>You can close the window now.</p>
        </div>
      )}
    </>
  );
};
