"use client";

import { useState, memo } from "react";

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
import { green } from "@mui/material/colors";

// Utils
import { DateSeparator, formatMessageDate, formatTime } from "@/app/utils/messagingUtils";

// File type identification helper
function getFileTypeInfo(file) {
  let fileName, fileType, extension, url;

  if (typeof file === "string") {
    url = file;
    fileName = file.split("/").pop() || "File";
    extension = fileName.split(".").pop()?.toLowerCase();
    fileType = "";
  } else if (file instanceof File || (file && file.name)) {
    fileName = file.name;
    fileType = file.type;
    extension = fileName.split(".").pop()?.toLowerCase();
    url =
      fileType.startsWith("image/") || fileType.startsWith("video/")
        ? URL.createObjectURL(file)
        : null;
  } else if (
    file &&
    file.content &&
    (file.content instanceof File || file.content.name)
  ) {
    return getFileTypeInfo(file.content);
  } else if (file && file.url) {
    return getFileTypeInfo(file.url);
  } else {
    return {
      fileName: "File",
      fileType: "",
      extension: "",
      url: null,
      icon: <DescriptionIcon className="h-4 w-4" />,
    };
  }

  // Determine file icon
  let icon = <DescriptionIcon className="h-4 w-4" />;
  if (
    fileType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)
  ) {
    icon = <ImageIcon className="h-4 w-4" />;
  } else if (
    fileType.startsWith("video/") ||
    ["mp4", "webm", "mov"].includes(extension)
  ) {
    icon = <MovieIcon className="h-4 w-4" />;
  } else if (fileType === "application/pdf" || extension === "pdf") {
    icon = <DescriptionIcon className="h-4 w-4" />;
  }

  return { fileName, fileType, extension, url, icon };
}

const FileAttachment = memo(({ file }) => {
  const { fileName, url, icon } = getFileTypeInfo(file);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 mt-2 p-2 bg-muted rounded-md text-sm hover:bg-muted/80"
    >
      {icon}
      <span className="truncate max-w-[200px]">{fileName}</span>
    </a>
  );
});

const ImageAttachment = memo(({ url, alt = "Media" }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative mt-2 rounded-md overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
      <img
        src={url}
        alt={alt}
        className="max-w-[240px] max-h-[240px] object-contain rounded-md"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
});

const VideoAttachment = memo(({ url }) => (
  <div className="mt-2 rounded-md overflow-hidden">
    <video
      src={url}
      controls
      className="max-w-[240px] max-h-[240px] object-contain rounded-md"
    />
  </div>
));

const MediaRenderer = memo(({ media, index }) => {
  const { fileType, extension, url } = getFileTypeInfo(media);

  if (!url) return null;

  if (
    fileType.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)
  ) {
    return <ImageAttachment key={index} url={url} />;
  } else if (
    fileType.startsWith("video/") ||
    ["mp4", "webm", "mov"].includes(extension)
  ) {
    return <VideoAttachment key={index} url={url} />;
  } else {
    return <FileAttachment key={index} file={media} />;
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
              {Array.isArray(message.messageContent) ? (
                <div className="space-y-2">
                  {message.messageContent.map((item, index) => {
                    if (item.type === "text") {
                      return <div key={index}>{item.content}</div>;
                    } else if (item.type === "media") {
                      return (
                        <MediaRenderer
                          key={index}
                          media={item.content || item}
                          index={index}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              ) : (
                message.messageContent
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
