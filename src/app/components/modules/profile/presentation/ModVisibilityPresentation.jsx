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
  handleSave,
  setOpen,
  usernameError,
  handleChange,
  modifyVisibility,
  visibility,
  error,
  username,
  modifyingVisibility,
}) {
  return (
    <>
      {currentStage === 0 && (
        <div
          className="flex flex-col gap-6 p-2"
          data-testid="mod-visibility-stage0-content"
        >
          <div data-testid="mod-visibility-stage0-visibility-section">
            <Label
              className="text-primary font-semibold"
              data-testid="mod-visibility-label"
            >
              Profile Visibility
            </Label>
            <p
              className="text-muted text-xs"
              data-testid="mod-visibility-description"
            >
              Choose who can see your profile.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Select
                onValueChange={(value) => modifyVisibility(value)}
                value={visibility}
              >
                <SelectTrigger
                  className="w-full text-primary"
                  data-testid="mod-visibility-select-trigger"
                >
                  <SelectValue
                    value={visibility}
                    placeholder="Select visibility..."
                  />
                </SelectTrigger>
                <SelectContent data-testid="mod-visibility-select-content">
                  <SelectItem
                    key="Public"
                    value="Public"
                    data-testid="mod-visibility-select-item-Public"
                  >
                    Public
                  </SelectItem>
                  <SelectItem
                    key="Connections Only"
                    value="Connections Only"
                    data-testid="mod-visibility-select-item-ConnectionsOnly"
                  >
                    Connections Only
                  </SelectItem>
                  <SelectItem
                    key="Private"
                    value="Private"
                    data-testid="mod-visibility-select-item-Private"
                  >
                    Private
                  </SelectItem>
                </SelectContent>
              </Select>
              {modifyingVisibility && (
                <div
                  className="size-8 flex-shrink-0 animate-spin border-t-transparent border-2 border-secondary rounded-full"
                  data-testid="mod-visibility-loading-spinner"
                />
              )}
            </div>
          </div>
          <div data-testid="mod-visibility-stage0-url-section">
            <Label
              className="text-primary font-semibold"
              data-testid="mod-visibility-url-label"
            >
              Profile URL
            </Label>
            <p
              className="text-muted text-xs"
              data-testid="mod-visibility-url-description"
            >
              Choose a unique URL for your profile.
            </p>
            <div className="flex flex-col md:flex-row md:items-center mt-2 gap-1 md:gap-0">
              <span
                className="truncate p-2 rounded-md text-muted bg-muted/50 md:bg-transparent md:flex-[2.5_1_0]"
                data-testid="mod-visibility-url-prefix"
              >
                {process.env.NEXT_PUBLIC_DOMAIN_URL}/u/
              </span>
              <Input
                type="text"
                placeholder="your-username"
                value={username}
                onChange={(e) => handleChange(e)}
                className="p-2 w-full border rounded-md text-primary md:flex-1"
                data-testid="mod-visibility-url-input"
              />
            </div>
            {usernameError && (
              <p
                className="text-red-500 text-end text-xs mt-1"
                data-testid="mod-visibility-url-error"
              >
                {usernameError}
              </p>
            )}
          </div>
        </div>
      )}
      {currentStage === 1 && (
        <div
          className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center p-4 text-center"
          data-testid="mod-visibility-stage1-loading"
        >
          <div
            className="size-12 animate-spin border-t-transparent border-2 rounded-full border-secondary"
            data-testid="mod-visibility-stage1-spinner"
          />
          <span data-testid="mod-visibility-stage1-text">Modifying...</span>
        </div>
      )}
      {currentStage === 2 && (
        <div
          className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center p-4 text-center"
          data-testid="mod-visibility-stage2-success"
        >
          <CheckCircleIcon
            className="text-secondary"
            sx={{ fontSize: 60 }}
            data-testid="mod-visibility-stage2-icon"
          />
          <h2
            className="text-2xl font-bold"
            data-testid="mod-visibility-stage2-heading"
          >
            Profile Updated
          </h2>
          <p
            className="text-muted-foreground"
            data-testid="mod-visibility-stage2-description"
          >
            Your profile has been successfully updated!
          </p>
          <p data-testid="mod-visibility-stage2-refreshing">Refreshing...</p>
        </div>
      )}
      {currentStage === 3 && (
        <div
          className="w-full h-full flex flex-col gap-2 text-primary justify-center items-center p-4 text-center"
          data-testid="mod-visibility-stage3-error"
        >
          <Cancel
            className="text-destructive"
            sx={{ fontSize: 60 }}
            data-testid="mod-visibility-stage3-icon"
          />
          <h2
            className="text-2xl font-bold"
            data-testid="mod-visibility-stage3-heading"
          >
            Error
          </h2>
          <p
            className="text-muted-foreground"
            data-testid="mod-visibility-stage3-message"
          >
            {error}
          </p>
          <p data-testid="mod-visibility-stage3-instruction-1">
            Please try again.
          </p>
          <p data-testid="mod-visibility-stage3-instruction-2">
            You can close the window now.
          </p>
        </div>
      )}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end mt-4 gap-2 p-2">
        {currentStage === 0 && (
          <Button
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto mr-0 sm:mr-2 bg-red-700 rounded-2xl font-semibold cursor-pointer hover:bg-red-700/70 dark:bg-red-400 dark:hover:bg-red-300 hover:text-background"
            data-testid="mod-visibility-close-button"
          >
            Close
          </Button>
        )}
        {currentStage === 0 && (
          <Button
            onClick={handleSave}
            disabled={!username || !!usernameError}
            className="w-full sm:w-auto bg-secondary font-semibold rounded-2xl cursor-pointer hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="mod-visibility-update-button"
          >
            Update Profile URL
          </Button>
        )}
      </div>
    </>
  );
}
