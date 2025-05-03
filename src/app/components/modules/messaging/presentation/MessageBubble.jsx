"use client";

import { useState, memo, useRef } from "react";

// UI Components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";

// Icons
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DescriptionIcon from "@mui/icons-material/Description";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { green } from "@mui/material/colors";

// Utils
import {
  formatTime,
  getMediaTypeFromUrl,
} from "@/app/utils/messagingUtils";

// Simplified Attachment Components
const FileAttachment = memo(({ url, fileName }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-md text-sm hover:bg-muted/80"
    data-testid="file-attachment-link"
  >
    <DescriptionIcon className="h-4 w-4" />
    <span className="truncate max-w-[200px]">{fileName || url.split('/').pop() || 'File'}</span>
  </a>
));

const LinkAttachment = memo(({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-md text-sm hover:bg-muted/80"
    data-testid="link-attachment-link"
  >
    <LinkIcon className="h-4 w-4" />
    <span className="truncate max-w-[200px]">{url.replace(/^https?:\/\//, '').split('/')[0]}</span>
  </a>
));

const ImageAttachment = memo(({ url, alt = "Media" }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="relative mt-2 rounded-md overflow-hidden">
      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      
      {error ? (
        <LinkAttachment url={url} />
      ) : (
        <img
          src={url}
          alt={alt}
          className="max-w-[240px] max-h-[240px] object-contain rounded-md"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          data-testid="image-attachment-img"
        />
      )}
    </div>
  );
});

const VideoAttachment = memo(({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef(null);
  
  return error ? (
    <LinkAttachment url={url} />
  ) : (
    <div className="relative mt-2 rounded-md overflow-hidden bg-muted">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted z-10">
          <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs text-muted-foreground mt-2">Loading video...</span>
        </div>
      )}
      
      <video
        ref={videoRef}
        className={`max-w-[240px] max-h-[240px] object-contain rounded-md ${loading ? 'opacity-0' : 'opacity-100'}`}
        controls
        preload="metadata"
        playsInline
        onCanPlay={() => setLoading(false)}
        onError={() => setError(true)}
        data-testid="video-attachment-video"
      >
        <source src={url} type="video/mp4" />
        <p>Your browser doesn't support HTML5 video. <a href={url} data-testid="video-attachment-download-link">Download</a> instead.</p>
      </video>
    </div>
  );
});

const PDFAttachment = memo(({ url, fileName }) => {
  const displayName = fileName || url.split('/').pop() || 'Document.pdf';
  
  return (
    <div className="mt-2 rounded-md overflow-hidden">
      <div className="flex flex-col bg-muted rounded-md">
        <iframe
          src={`${url}#toolbar=0&navpanes=0`}
          className="w-[240px] h-[180px] border-0"
          title={displayName}
          onError={(e) => e.target.style.display = 'none'}
          data-testid="pdf-attachment-iframe"
        ></iframe>
        
        <div className="p-2 flex items-center bg-muted/80">
          <PictureAsPdfIcon className="h-5 w-5 text-destructive mr-2" />
          <span className="truncate text-sm flex-1">{displayName}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-xs text-primary hover:underline"
            data-testid="pdf-attachment-open-link"
          >
            Open
          </a>
        </div>
      </div>
    </div>
  );
});

// MediaRenderer Component
const MediaRenderer = memo(({ mediaUrl }) => {
  const mediaInfo = getMediaTypeFromUrl(mediaUrl);
  
  if (!mediaUrl) return null;
  
  // Render based on media type
  switch (mediaInfo.type) {
    case 'image': 
      return <ImageAttachment url={mediaUrl} />;
    case 'video': 
      return <VideoAttachment url={mediaUrl} />;
    case 'document': 
      // Check specifically for PDFs
      if (mediaInfo.extension === 'pdf' || mediaUrl.toLowerCase().endsWith('.pdf')) {
        return <PDFAttachment url={mediaUrl} fileName={mediaInfo.fileName} />;
      }
      return <FileAttachment url={mediaUrl} fileName={mediaInfo.fileName} />;
    case 'blob':
      // For blobs, check if it might be a PDF based on filename
      if (mediaUrl.includes('pdf')) {
        return <PDFAttachment url={mediaUrl} />;
      }
      return <ImageAttachment url={mediaUrl} />;
    default:
      return <LinkAttachment url={mediaUrl} />;
  }
});

/**
 * @namespace messages
 * @module messages
 */
/**
 * MessageBubble
 *
 * Renders a single chat message bubble, including text, media attachments, and read status.
 *
 * @param {Object} props
 * @param {Object} props.message - The message object containing content, media, timestamp, etc.
 * @param {boolean} props.isCurrentUser - Whether the message is sent by the current user.
 * @param {string} props.participantName - Name of the message sender.
 * @param {string} props.participantPicture - URL of the sender's avatar.
 * @returns {JSX.Element}
 */
export const MessageBubble = memo(({
  message,
  isCurrentUser,
  participantName,
  participantPicture,
}) => {
  // Ensure messageContent is treated as a string and remove potential leading/trailing quotes
  const messageContent = typeof message.messageContent === "string" 
    ? message.messageContent.replace(/^"|"$/g, '')
    : message.messageContent;
    
  return (
    <div
      className={`flex gap-2 max-w-[80%] ${isCurrentUser ? "ml-auto flex-row-reverse" : ""}`}
      data-testid={`message-bubble-${message.id}`}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={participantPicture || "/placeholder.svg"}
            alt={participantName}
          />
          <AvatarFallback>
            {participantName?.substring(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
      )}
      <div>
        <div
          className={`rounded-xl p-3 w-fit ${
            isCurrentUser
              ? "bg-secondary ml-auto"
              : "bg-primary text-primary-foreground"
          }`}
          data-testid={`message-content-${message.id}`}
        >
          {messageContent && <div>{messageContent}</div>}
          {message.mediaUrl && <MediaRenderer mediaUrl={message.mediaUrl} />}
        </div>
        <div
          className={`flex items-center text-xs text-muted-foreground mt-1 ${
            isCurrentUser ? "justify-end" : ""
          }`}
        >
          <span>{formatTime(message.timestamp)}</span>
          {isCurrentUser && message.read && (
            <DoneAllIcon
              className="ml-1"
              sx={{ fontSize: 20, color: green[400] }}
              data-testid={`message-read-icon-${message.id}`}
            />
          )}
        </div>
      </div>
    </div>
  );
});
export default MessageBubble;