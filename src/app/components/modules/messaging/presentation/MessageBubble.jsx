"use client";

import { useState, memo, useEffect } from "react";

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
import MovieIcon from "@mui/icons-material/Movie";
import LinkIcon from "@mui/icons-material/Link";
import { green } from "@mui/material/colors";

// Utils
import {
  DateSeparator,
  formatMessageDate,
  formatTime,
} from "@/app/utils/messagingUtils";

// Helper function to determine media type from URL
function getMediaTypeFromUrl(url) {
  if (!url || typeof url !== 'string') return { type: 'unknown', url };
  
  // Handle blob URLs
  if (url.startsWith('blob:')) {
    // For blob URLs, we can't easily determine the type from the URL
    // We'll try to infer from additional context or default to image
    return { type: 'blob', url };
  }
  
  try {
    // Extract file extension from URL
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const extension = path.split('.').pop()?.toLowerCase();
    
    // Check for image extensions
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
      return { type: 'image', url, extension };
    }
    
    // Check for video extensions
    if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'].includes(extension)) {
      return { type: 'video', url, extension };
    }
    
    // Check for document extensions
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension)) {
      return { type: 'document', url, extension, fileName: path.split('/').pop() };
    }
    
    // Check for common image/video services and patterns
    if (url.includes('imgur.com') || url.includes('i.imgur.com')) {
      return { type: 'image', url, extension: 'jpg' };
    }
    
    if (url.includes('youtube.com/watch') || url.includes('youtu.be/') || 
        url.includes('vimeo.com')) {
      return { type: 'video', url, extension: 'mp4' };
    }
    
    return { type: 'link', url, fileName: urlObj.hostname };
  } catch (error) {
    console.error('Error parsing URL:', error);
    return { type: 'unknown', url };
  }
}

const FileAttachment = memo(({ url, fileName }) => {
  const displayName = fileName || url.split('/').pop() || 'File';
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-md text-sm hover:bg-muted/80"
    >
      <DescriptionIcon className="h-4 w-4" />
      <span className="truncate max-w-[200px]">{displayName}</span>
    </a>
  );
});

const LinkAttachment = memo(({ url }) => {
  const displayUrl = url.replace(/^https?:\/\//, '').split('/')[0];
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-md text-sm hover:bg-muted/80"
    >
      <LinkIcon className="h-4 w-4" />
      <span className="truncate max-w-[200px]">{displayUrl}</span>
    </a>
  );
});

const ImageAttachment = memo(({ url, alt = "Media" }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleError = () => {
    console.error("Error loading image:", url);
    setError(true);
  };

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
          onError={handleError}
        />
      )}
    </div>
  );
});

const VideoAttachment = memo(({ url }) => {
  const [error, setError] = useState(false);
  
  const handleError = () => {
    console.error("Error loading video:", url);
    setError(true);
  };
  
  return error ? (
    <LinkAttachment url={url} />
  ) : (
    <div className="mt-2 rounded-md overflow-hidden">
      <video
        src={url}
        controls
        className="max-w-[240px] max-h-[240px] object-contain rounded-md"
        onError={handleError}
      />
    </div>
  );
});

const MediaRenderer = memo(({ mediaUrl }) => {
  const [mediaInfo, setMediaInfo] = useState({ type: 'unknown', url: mediaUrl });
  
  useEffect(() => {
    if (mediaUrl) {
      setMediaInfo(getMediaTypeFromUrl(mediaUrl));
    }
  }, [mediaUrl]);
  
  if (!mediaUrl) return null;
  
  switch (mediaInfo.type) {
    case 'image':
      return <ImageAttachment url={mediaUrl} />;
    case 'video':
      return <VideoAttachment url={mediaUrl} />;
    case 'document':
      return <FileAttachment url={mediaUrl} fileName={mediaInfo.fileName} />;
    case 'link':
      return <LinkAttachment url={mediaUrl} />;
    case 'blob':
      // For blob URLs, try to render as image first, it will fall back to link if it fails
      return <ImageAttachment url={mediaUrl} />;
    default:
      // If we can't determine the type, we'll try to render as image and fall back if it fails
      return <ImageAttachment url={mediaUrl} />;
  }
});

export const MessageBubble = memo(
  ({
    message,
    isCurrentUser,
    participantName,
    participantPicture,
    showDateSeparator,
  }) => {
    return (
      <>
        {showDateSeparator && (
          <DateSeparator date={formatMessageDate(message.timestamp)} />
        )}
        <div
          className={`flex gap-2 max-w-[80%] ${
            isCurrentUser ? "ml-auto flex-row-reverse" : ""
          }`}
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
              {/* Handle text message */}
              {message.messageContent && (
                <div>
                  {typeof message.messageContent === "string" 
                    ? message.messageContent.replace(/^"|"$/g, '') // Remove surrounding quotes if present
                    : message.messageContent}
                </div>
              )}
              
              {/* Handle media message */}
              {message.mediaUrl && (
                <MediaRenderer mediaUrl={message.mediaUrl} />
              )}
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
      </>
    );
  }
);
