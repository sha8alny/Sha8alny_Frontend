"use client";

import { useState, memo, useEffect, useRef } from "react";

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
  DateSeparator,
  formatMessageDate,
  formatTime,
} from "@/app/utils/messagingUtils";

// Media helpers
const getMediaTypeFromUrl = (url) => {
  if (!url || typeof url !== 'string') return { type: 'unknown', url };
  
  if (url.startsWith('blob:')) return { type: 'blob', url };
  
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const extension = path.split('.').pop()?.toLowerCase();
    const fileName = path.split('/').pop();
    
    // Image types
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(extension)) {
      return { type: 'image', url, extension };
    }
    
    // Video types
    if (['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'].includes(extension)) {
      return { type: 'video', url, extension };
    }
    
    // Document types
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'].includes(extension)) {
      return { type: 'document', url, extension, fileName };
    }
    
    // Special cases
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
};

// Attachment Components
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
        />
      )}
    </div>
  );
});

const VideoAttachment = memo(({ url }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const videoRef = useRef(null);
  const loadTimeoutRef = useRef(null);
  
  // Check if video can be loaded within a timeout period
  useEffect(() => {
    // Set a timeout to consider the video as failed if it doesn't load within 10 seconds
    loadTimeoutRef.current = setTimeout(() => {
      if (loading && !canPlay) {
        console.warn("Video loading timeout:", url);
        setError(true);
        setLoading(false);
      }
    }, 10000);
    
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [url, loading, canPlay]);
  
  const handleCanPlay = () => {
    setCanPlay(true);
    setLoading(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  };
  
  const handleError = (e) => {
    console.error("Video loading error:", e);
    setError(true);
    setLoading(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
  };
  
  // Handle video playback using a more robust approach
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
        onCanPlay={handleCanPlay}
        onError={handleError}
        onLoadedData={() => {
          // Sometimes canplay doesn't fire but loadeddata does
          if (loading) handleCanPlay();
        }}
      >
        <source src={url} type="video/mp4" />
        <source src={url} type="video/webm" />
        <source src={url} type="video/ogg" />
        <source src={url} type="video/quicktime" />
        <p>Your browser doesn't support HTML5 video. <a href={url} target="_blank" rel="noopener noreferrer">Download</a> instead.</p>
      </video>
    </div>
  );
});

// Add specialized PDF attachment component
const PDFAttachment = memo(({ url, fileName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const displayName = fileName || url.split('/').pop() || 'Document.pdf';
  
  const handlePreviewError = () => {
    console.error("PDF preview error:", url);
    setError(true);
    setLoading(false);
  };
  
  // Set a loading state to show initial loading indicator
  useEffect(() => {
    setLoading(true);
    
    // For PDF preview, we use the actual URL
    setPreviewUrl(url);
    
    // Simulate loading to ensure UI shows loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [url]);
  
  return (
    <div className="mt-2 rounded-md overflow-hidden">
      {/* PDF file thumbnail preview with download option */}
      <div className="flex flex-col bg-muted rounded-md">
        {/* Preview container */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted z-10">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-xs text-muted-foreground mt-2">Loading PDF...</span>
            </div>
          )}
          
          {error ? (
            <div className="h-[240px] w-[240px] flex items-center justify-center bg-muted">
              <div className="flex flex-col items-center p-4">
                <PictureAsPdfIcon className="h-12 w-12 text-destructive" />
                <p className="text-xs text-muted-foreground mt-2">Error loading PDF</p>
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-primary mt-2 hover:underline"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ) : (
            <iframe
              src={previewUrl && `${previewUrl}#toolbar=0&navpanes=0`}
              className={`w-[240px] h-[180px] border-0 ${loading ? 'hidden' : 'block'}`}
              onError={handlePreviewError}
              title={displayName}
            ></iframe>
          )}
        </div>
        
        {/* PDF info and actions */}
        <div className="p-2 flex items-center bg-muted/80">
          <PictureAsPdfIcon className="h-5 w-5 text-destructive mr-2" />
          <span className="truncate text-sm flex-1">{displayName}</span>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 text-xs text-primary hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            Open
          </a>
        </div>
      </div>
    </div>
  );
});

// Update MediaRenderer to handle PDFs specifically
const MediaRenderer = memo(({ mediaUrl }) => {
  // Use a more reliable approach for detecting media type with fallbacks
  const [mediaInfo, setMediaInfo] = useState(() => getMediaTypeFromUrl(mediaUrl));
  const [tryFallback, setTryFallback] = useState(false);
  
  useEffect(() => {
    if (mediaUrl) {
      setMediaInfo(getMediaTypeFromUrl(mediaUrl));
      setTryFallback(false);
    }
  }, [mediaUrl]);
  
  if (!mediaUrl) return null;
  
  // If a particular media type fails, we can try an alternate rendering
  const handleMediaFallback = () => {
    setTryFallback(true);
  };
  
  // Decide what to render based on media type and fallback state
  if (tryFallback || mediaInfo.type === 'unknown' || mediaInfo.type === 'link') {
    return <LinkAttachment url={mediaUrl} />;
  }
  
  switch (mediaInfo.type) {
    case 'image': 
      return <ImageAttachment url={mediaUrl} onError={handleMediaFallback} />;
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
      return <ImageAttachment url={mediaUrl} onError={handleMediaFallback} />;
    default:
      return <LinkAttachment url={mediaUrl} />;
  }
});

// Main Message Component
export const MessageBubble = memo(({
  message,
  isCurrentUser,
  participantName,
  participantPicture,
  showDateSeparator,
}) => {
  const messageContent = typeof message.messageContent === "string" 
    ? message.messageContent.replace(/^"|"$/g, '')
    : message.messageContent;
    
  return (
    <>
      {showDateSeparator && (
        <DateSeparator date={formatMessageDate(message.timestamp)} />
      )}
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
    </>
  );
});
