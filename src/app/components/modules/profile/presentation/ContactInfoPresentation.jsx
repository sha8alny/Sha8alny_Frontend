import Dialog from "@/app/components/ui/DialogMod";
import { ContentCopy, Launch, Mail } from "@mui/icons-material";

export default function ContactInfoPresentation({
  userInfo,
  onCopy,
  onEmail,
  copied,
}) {
  return (
    <Dialog
      useRegularButton
      buttonData="Contact Info"
      buttonClass="hover:underline cursor-pointer text-secondary text-sm"
      testId="contact-info-button" // Added data-testid for the trigger button
      AlertContent={
        <div
          className="flex flex-col gap-4 p-1 text-primary"
          data-testid="contact-info-dialog-content"
        >
          {" "}
          {/* Added data-testid */}
          <h1
            className="text-2xl font-bold border-b border-primary/20 pb-2"
            data-testid="contact-info-heading"
          >
            {" "}
            {/* Added data-testid */}
            Contact Information
          </h1>
          {/* Email Section */}
          <div
            className="rounded-md p-4 border border-dashed border-primary/20"
            data-testid="email-section"
          >
            {" "}
            {/* Added data-testid */}
            <div className="flex items-center gap-2 mb-2">
              <Mail className="text-secondary" sx={{ fontSize: "1.3rem" }} />
              <h2 className="text-lg font-medium">Email</h2>
            </div>
            <div className="flex items-center justify-between">
              <p className="font-medium text-muted" data-testid="email-display">
                {" "}
                {/* Added data-testid */}
                {userInfo?.email || "No email provided"}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => onCopy(userInfo?.email)}
                  className="p-1.5 rounded-full hover:bg-secondary/10 transition-colors cursor-pointer"
                  title="Copy email"
                  data-testid="copy-email-button" // Added data-testid
                >
                  <ContentCopy
                    className="text-secondary"
                    sx={{ fontSize: "1rem" }}
                  />
                </button>
                <button
                  onClick={() => onEmail(userInfo?.email)}
                  className="p-1.5 rounded-full hover:bg-secondary/10 transition-colors cursor-pointer"
                  title="Send email"
                  data-testid="send-email-button" // Added data-testid
                >
                  <Launch
                    className="text-secondary"
                    sx={{ fontSize: "1rem" }}
                  />
                </button>
              </div>
            </div>
          </div>
          {/* Copy Notification */}
          {copied && (
            <div
              className="bg-green-200 text-green-800 dark:bg-green-800/30 dark:text-green-400 text-sm p-2 rounded text-center mt-2 animate-fade-in"
              data-testid="copy-notification"
            >
              {" "}
              {/* Added data-testid */}
              Copied to clipboard!
            </div>
          )}
        </div>
      }
    />
  );
}
