import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/app/components/ui/Button";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/Select";
import { Input } from "@/app/components/ui/Input";
import { Cancel } from "@mui/icons-material";

/**
 * @namespace profile
 * @module profile
 */
export default function ModVisibilityPresentation({
  currentStage,
  visibility,
  setVisibility,
  username,
  error,
  usernameError,
  handleChange,
  modifyingVisibility,
  modifyVisibility,
  handleSave,
  setOpen,
}) {
  return (
    <>
      {currentStage === 0 && (
        <div className="flex flex-col gap-6 p-2">
          <div>
            <Label className="text-primary font-semibold">
              Profile Visibility
            </Label>
            <p className="text-muted text-xs">
              Choose who can see your profile.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Select
                onValueChange={(value) => modifyVisibility(value)}
                value={visibility}
              >
                <SelectTrigger className="w-full text-primary">
                  <SelectValue
                    value={visibility}
                    placeholder="Select visibility..."
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="Public" value="Public">
                    Public
                  </SelectItem>
                  <SelectItem key="Connections Only" value="Connections Only">
                    Connections Only
                  </SelectItem>
                  <SelectItem key="Private" value="Private">
                    Private
                  </SelectItem>
                </SelectContent>
              </Select>
              {modifyingVisibility && (
                <div className="size-8 flex-shrink-0 animate-spin border-t-transparent border-2 border-secondary rounded-full" />
              )}
            </div>
          </div>
          <div>
            <Label className="text-primary font-semibold">Profile URL</Label>
            <p className="text-muted text-xs">
              Choose a unique URL for your profile.
            </p>
            <div className="flex flex-col md:flex-row md:items-center mt-2 gap-1 md:gap-0">
              <span className="truncate p-2 rounded-md text-muted bg-muted/50 md:bg-transparent md:flex-[2.5_1_0]">
                {process.env.NEXT_PUBLIC_DOMAIN_URL}/u/
              </span>
              <Input
                type="text"
                placeholder="your-username"
                value={username}
                onChange={(e) => handleChange(e)}
                className="p-2 w-full border rounded-md text-primary md:flex-1"
              />
            </div>
            {usernameError && (
              <p className="text-red-500 text-end text-xs mt-1">
                {usernameError}
              </p>
            )}
          </div>
        </div>
      )}
      {currentStage === 1 && (
        <div className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center p-4 text-center">
          <div className="size-12 animate-spin border-t-transparent border-2 rounded-full border-secondary" />
          Modifying...
        </div>
      )}
      {currentStage === 2 && (
        <div className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center p-4 text-center">
          <CheckCircleIcon className="text-secondary" sx={{ fontSize: 60 }} />
          <h2 className="text-2xl font-bold">Profile Updated</h2>
          <p className="text-muted-foreground">
            Your profile has been successfully updated!
          </p>
          <p>Refreshing...</p>
        </div>
      )}
      {currentStage === 3 && (
        <div className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center p-4 text-center">
          <Cancel className="text-destructive" sx={{ fontSize: 60 }} />
          <h2 className="text-2xl font-bold">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <p>Please try again.</p>
          <p>You can close the window now.</p>
        </div>
      )}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end mt-4 gap-2 p-2">
        {currentStage === 0 && (
          <Button
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto mr-0 sm:mr-2 bg-red-700 rounded-2xl font-semibold cursor-pointer hover:bg-red-700/70 dark:bg-red-400 dark:hover:bg-red-300 hover:text-background"
          >
            Close
          </Button>
        )}
        {currentStage === 0 && (
          <Button
            onClick={handleSave}
            disabled={!username || !!usernameError}
            className="w-full sm:w-auto bg-secondary font-semibold rounded-2xl cursor-pointer hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Update Profile URL
          </Button>
        )}
      </div>
    </>
  );
}
