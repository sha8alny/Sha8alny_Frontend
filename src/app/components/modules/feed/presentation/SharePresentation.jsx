import {
  CopyAll,
  Email,
  Facebook,
  LinkedIn,
  Twitter,
  X,
} from "@mui/icons-material";

/**
 * SharePresentation - Modal content for sharing posts to various platforms
 * 
 * This component provides multiple sharing options for content:
 * - Copy link to clipboard with visual confirmation
 * - Share to social media platforms (Twitter/X, LinkedIn, Facebook)
 * - Send via email
 * 
 * All sharing options are properly formatted with the appropriate sharing APIs
 * and open in new windows/tabs for external platforms.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.copied - Whether the link has been copied to clipboard
 * @param {Function} props.copyToClipboard - Handler to copy URL to clipboard
 * @param {string} props.shareUrl - Encoded URL to be shared
 * @returns {JSX.Element} Share dialog content with multiple sharing options
 */
export default function SharePresentation({
  copied,
  copyToClipboard,
  shareUrl,
}) {
  return (
    <div
      className="text-primary flex flex-col items-center p-4"
      data-testid="share-root"
    >
      <h2
        className="text-lg font-semibold text-center"
        data-testid="share-title"
      >
        Share this
      </h2>
      <div
        className="grid grid-cols-2 md:flex flex-row gap-2 items-center md:gap-4 mt-4 text-primary"
        data-testid="share-btns-row"
      >
        <button
          onClick={copyToClipboard}
          className="flex justify-center items-center w-full gap-2 px-4 py-2 rounded-md bg-secondary cursor-pointer text-background hover:bg-secondary/70"
          data-testid="share-copy-btn"
        >
          <CopyAll sx={{ fontSize: 20 }} /> {copied ? "Copied!" : "Copy Link"}
        </button>
        <a
          href={`https://twitter.com/intent/tweet?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="share-twitter-link"
        >
          <button
            className="flex justify-center items-center w-full gap-2 px-4 py-2 rounded-md bg-secondary cursor-pointer text-background hover:bg-secondary/70"
            data-testid="share-twitter-btn"
          >
            <X sx={{ fontSize: 20 }} /> Twitter
          </button>
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="share-linkedin-link"
        >
          <button
            className="flex justify-center items-center w-full gap-2 px-4 py-2 rounded-md bg-secondary cursor-pointer text-background hover:bg-secondary/70"
            data-testid="share-linkedin-btn"
          >
            <LinkedIn sx={{ fontSize: 20 }} /> LinkedIn
          </button>
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="share-facebook-link"
        >
          <button
            className="flex justify-center items-center w-full gap-2 px-4 py-2 rounded-md bg-secondary cursor-pointer text-background hover:bg-secondary/70"
            data-testid="share-facebook-btn"
          >
            <Facebook sx={{ fontSize: 20 }} /> Facebook
          </button>
        </a>
      </div>
      <button
        className="mt-4 flex items-center gap-2 px-4 py-2 rounded-md bg-primary cursor-pointer text-background hover:bg-primary/70"
        onClick={() =>
          window.open(
            `mailto:?subject=Check this out!&body=${shareUrl}`,
            "_blank"
          )
        }
        data-testid="share-email-btn"
      >
        <Email sx={{ fontSize: 20 }} />
        Send via Email
      </button>
    </div>
  );
}
