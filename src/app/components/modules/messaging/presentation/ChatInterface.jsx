import React, { useEffect, useRef } from "react";
import { DateSeparator, formatMessageDate } from "@/app/utils/messagingUtils"; // Ensure these imports exist

// UI Components
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { ScrollArea } from "@/app/components/ui/ScrollArea";
import { Textarea } from "@/app/components/ui/Textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropDownMenu";
import { MessageBubble } from "./MessageBubble";
import { MediaPreview } from "./MediaPreview";

// Icons
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SendIcon from "@mui/icons-material/Send";
import ImageIcon from "@mui/icons-material/Image";
import BlockIcon from "@mui/icons-material/Block";
import CheckIcon from "@mui/icons-material/Check";

// Chat header component
const ChatHeader = React.memo(
  ({
    onBack,
    otherParticipant,
    isOtherParticipantTyping,
    isOtherParticipantBlocked,
    isCurrentUserBlocked,
    onBlockUser,
    onUnblockUser,
  }) => (
    <div className="flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 hover:bg-foreground dark:hover:bg-foreground/80 transition-colors"
            data-testid="chat-back-button"
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} className="text-muted-foreground"/>
          </Button>
        )}
        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
          <AvatarImage
            src={otherParticipant?.profilePicture || "/placeholder.svg"}
            alt={otherParticipant?.name || otherParticipant?.username}
          />
          <AvatarFallback>
            {otherParticipant?.name?.substring(0, 2).toUpperCase() ||
              otherParticipant?.username?.substring(0, 2).toUpperCase() ||
              "??"}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm sm:text-base text-text">
            {otherParticipant?.name || otherParticipant?.username}
            {otherParticipant?.fromRequest && (
              <span className="ml-2 text-xs bg-secondary px-1.5 py-0.5 rounded text-secondary-foreground">
                Request Accepted
              </span>
            )}
          </div>
          {isOtherParticipantTyping && (
            <div className="text-xs text-muted-foreground">Typing...</div>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-foreground dark:hover:bg-foreground/80 transition-colors"
            data-testid="chat-options-button"
          >
            <MoreVertIcon sx={{ fontSize: 20 }} className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOtherParticipantBlocked ? (
            <DropdownMenuItem
              onClick={onUnblockUser}
              data-testid="unblock-user-button"
            >
              <CheckIcon sx={{ mr: 1, fontSize: 16 }} />
              Unblock user
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={onBlockUser}
              data-testid="block-user-button"
              disabled={isCurrentUserBlocked}
            >
              <BlockIcon sx={{ mr: 1, fontSize: 16 }} />
              Block user
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
);

// Message list component
const MessageList = React.memo(
  ({ messages, currentUser, otherParticipant }) => {
    let lastDateString = null; // Keep track of the last date rendered

    return (
      <div className="space-y-4 pb-2">
        {messages.map((msg, index) => {
          const currentDate = new Date(msg.timestamp);
          const currentDateString = formatMessageDate(currentDate);
          
          // Determine if the date separator should be shown
          const showDateSeparator = currentDateString !== lastDateString;
          if (showDateSeparator) {
            lastDateString = currentDateString; // Update the last date rendered
          }

          return (
            <React.Fragment key={msg.id}>
              {/* Render DateSeparator here if the date has changed */}
              {showDateSeparator && (
                <DateSeparator date={currentDateString} />
              )}
              <MessageBubble
                message={msg}
                isCurrentUser={msg.senderName === currentUser}
                participantName={
                  otherParticipant?.name || otherParticipant?.username
                }
                participantPicture={otherParticipant?.profilePicture}
              />
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

// Chat input component
const ChatInput = React.memo(
  ({
    message,
    mediaFiles,
    fileInputRef,
    onSendMessage,
    onTyping,
    onKeyDown,
    onFileSelect,
    onRemoveFile,
  }) => {
    // Add this handler to clear the file input value when removing a file
    const handleRemoveFile = (index) => {
      onRemoveFile(index);
      // Reset the file input value to ensure the same file can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };

    return (
      <>
        {mediaFiles.length > 0 && (
          <div className="p-2 border-t bg-background">
            <div className="flex gap-2 overflow-x-auto p-2 scrollbar-thin">
              {mediaFiles.map((file, index) => (
                <MediaPreview
                  key={index}
                  file={file}
                  onRemove={() => handleRemoveFile(index)}
                  data-testid={`remove-media-${index}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="p-3 border-t sticky bottom-0 bg-background/95 backdrop-blur-sm z-10 flex-shrink-0">
          <div className="flex gap-2 items-end ">
            <Button
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="flex-shrink-0 h-10 w-10 bg-secondary dark:bg-secondary hover:bg-secondary/80 transition-colors"
              data-testid="file-picker-button"
            >
              <ImageIcon sx={{ fontSize: 20 }} />
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileSelect}
              multiple
              accept="image/*,video/*,application/pdf"
            />
            <Textarea
              placeholder="Type a message..."
              value={message}
              onChange={onTyping}
              onKeyDown={onKeyDown}
              className="flex-1 min-h-[40px] max-h-[120px] resize-none text-text"
              rows={1}
              data-testid="message-input"
            />
            <Button
              size="icon"
              onClick={onSendMessage}
              className="flex-shrink-0 h-10 w-10 bg-secondary hover:bg-secondary/80 transition-colors"
              disabled={!message.trim() && mediaFiles.length === 0}
              data-testid="send-message-button"
            >
              <SendIcon sx={{ fontSize: 20 }} />
            </Button>
          </div>
        </div>
      </>
    );
  }
);

// Main chat presentation component
export function ChatPresentation({
  currentUser,
  otherParticipant,
  isOtherParticipantTyping,
  isOtherParticipantBlocked,
  isCurrentUserBlocked,
  messages,
  message,
  mediaFiles,
  fileInputRef,
  scrollAreaRef,
  onBack,
  onSendMessage,
  onKeyDown,
  onFileSelect,
  onRemoveFile,
  onTyping,
  onBlockUser,
  onUnblockUser,
  onLoadMoreMessages,
  isLoadingMore,
  setIsLoadingMore,
}) {
  const scrollAreaViewportRef = useRef(null);
  const scrollPositionRef = useRef(null);

  // Improved scroll detection to load more messages
  useEffect(() => {
    if (!scrollAreaRef.current) return;

    const viewport = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) return;

    scrollAreaViewportRef.current = viewport;

    const handleScroll = () => {
      // Store current scroll position
      scrollPositionRef.current = {
        scrollTop: viewport.scrollTop,
        scrollHeight: viewport.scrollHeight
      };
      
      // If user has scrolled near the top (30px threshold) and we're not already loading, trigger load more
      if (viewport.scrollTop < 30 && !isLoadingMore && messages.length >= 20) {
        onLoadMoreMessages && onLoadMoreMessages();
      }
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [onLoadMoreMessages, messages.length, isLoadingMore]);
  
  // Improved preservation of scroll position when loading history
  useEffect(() => {
    if (!scrollAreaViewportRef.current || !isLoadingMore) return;
    
    const viewport = scrollAreaViewportRef.current;
    
    // Set a flag to check if messages have been updated after isLoadingMore became true
    const checkForUpdates = setInterval(() => {
      // If DOM has been updated with new content
      if (viewport.scrollHeight > (scrollPositionRef.current?.scrollHeight || 0)) {
        clearInterval(checkForUpdates);
        
        // Calculate height difference and maintain relative position
        const heightDifference = viewport.scrollHeight - scrollPositionRef.current.scrollHeight;
        viewport.scrollTop = scrollPositionRef.current.scrollTop + heightDifference;
        
        // Reset loading flag after position is maintained
        setTimeout(() => {
          setIsLoadingMore && setIsLoadingMore(false);
        }, 100);
      }
    }, 50);
    
    // Clear interval if component unmounts or dependencies change
    return () => clearInterval(checkForUpdates);
  }, [messages, isLoadingMore, setIsLoadingMore]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatHeader
        onBack={onBack}
        otherParticipant={otherParticipant}
        isOtherParticipantTyping={isOtherParticipantTyping}
        isOtherParticipantBlocked={isOtherParticipantBlocked}
        isCurrentUserBlocked={isCurrentUserBlocked}
        onBlockUser={onBlockUser}
        onUnblockUser={onUnblockUser}
      />

      {/* Ensure ScrollArea allows sticky positioning */}
      <ScrollArea
        className="flex-1 p-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted/50 scrollbar-track-transparent"
        ref={scrollAreaRef}
      >
        <MessageList
          messages={messages}
          currentUser={currentUser}
          otherParticipant={otherParticipant}
        />
      </ScrollArea>

      {/* Blocked user messages */}
      {isOtherParticipantBlocked ? (
        <div className="p-4 text-center text-muted-foreground border-t bg-background/95 backdrop-blur-sm">
          You have blocked this user. Unblock to send messages.
        </div>
      ) : isCurrentUserBlocked ? (
        <div className="p-4 text-center text-muted-foreground border-t bg-background/95 backdrop-blur-sm">
          You have been blocked by this user and cannot send messages.
        </div>
      ) : (
        <ChatInput
          message={message}
          mediaFiles={mediaFiles}
          fileInputRef={fileInputRef}
          onSendMessage={onSendMessage}
          onTyping={onTyping}
          onKeyDown={onKeyDown}
          onFileSelect={onFileSelect}
          onRemoveFile={onRemoveFile}
        />
      )}
    </div>
  );
}
