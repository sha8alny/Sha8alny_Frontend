import React, { useEffect, useRef } from "react";

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
import { isSameDay } from "date-fns";

// Chat header component
const ChatHeader = React.memo(
  ({
    onBack,
    otherParticipant,
    isOtherParticipantTyping,
    isOtherUserBlocked,
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
            data-testid="chat-back-button"
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
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
            className="h-8 w-8"
            data-testid="chat-options-button"
          >
            <MoreVertIcon sx={{ fontSize: 20 }} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isOtherUserBlocked ? (
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
  ({ messages, currentUser, otherParticipant, onLoadMoreMessages }) => (
    <div className="space-y-4 pb-2">
      {messages.map((msg, index) => {
        const showDateSeparator =
          index === 0 ||
          !isSameDay(
            new Date(msg.timestamp), 
            new Date(messages[index - 1].timestamp)
          );

        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            isCurrentUser={msg.senderName === currentUser}
            participantName={
              otherParticipant?.name || otherParticipant?.username
            }
            participantPicture={otherParticipant?.profilePicture}
            showDateSeparator={showDateSeparator}
          />
        );
      })}
    </div>
  )
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
  }) => (
    <>
      {mediaFiles.length > 0 && (
        <div className="p-2 border-t bg-background">
          <div className="flex gap-2 overflow-x-auto p-2 scrollbar-thin">
            {mediaFiles.map((file, index) => (
              <MediaPreview
                key={index}
                file={file}
                onRemove={() => onRemoveFile(index)}
                data-testid={`remove-media-${index}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="p-3 border-t sticky bottom-0 bg-background/95 backdrop-blur-sm z-10 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 h-10 w-10"
            data-testid="file-picker-button"
          >
            <ImageIcon sx={{ fontSize: 20 }} className="text-primary" />
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
            className="flex-shrink-0 h-10 w-10"
            disabled={!message.trim() && mediaFiles.length === 0}
            data-testid="send-message-button"
          >
            <SendIcon sx={{ fontSize: 20 }} />
          </Button>
        </div>
      </div>
    </>
  )
);

// Main chat presentation component
export function ChatPresentation({
  selectedConversation,
  currentUser,
  otherParticipant,
  isOtherParticipantTyping,
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
}) {
  const isOtherUserBlocked = otherParticipant?.isBlocked === true;
  const scrollAreaViewportRef = useRef(null);
  const prevMessagesLengthRef = useRef(messages.length);
  const scrollPositionRef = useRef(null);
  const isLoadingMoreRef = useRef(false);

  // Add scroll detection to load more messages when reaching top
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
      
      // If user has scrolled near the top (20px threshold) and we're not already loading, trigger load more
      if (viewport.scrollTop < 20 && !isLoadingMoreRef.current) {
        isLoadingMoreRef.current = true;
        onLoadMoreMessages && onLoadMoreMessages();
      }
    };

    viewport.addEventListener("scroll", handleScroll);
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [onLoadMoreMessages]);
  
  // Preserve scroll position when new messages are loaded at the top
  useEffect(() => {
    if (!scrollAreaViewportRef.current) return;
    
    // Check if new messages were loaded (not sent)
    if (messages.length > prevMessagesLengthRef.current && isLoadingMoreRef.current) {
      const viewport = scrollAreaViewportRef.current;
      
      // Add a small delay to ensure DOM is updated
      setTimeout(() => {
        // Get height difference to maintain relative scroll position
        if (scrollPositionRef.current) {
          const heightDifference = viewport.scrollHeight - scrollPositionRef.current.scrollHeight;
          viewport.scrollTop = scrollPositionRef.current.scrollTop + heightDifference;
        }
        
        isLoadingMoreRef.current = false;
      }, 50);
    } else {
      // If not loading more (i.e., new message sent), don't interfere with auto-scroll
      isLoadingMoreRef.current = false;
    }
    
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ChatHeader
        onBack={onBack}
        otherParticipant={otherParticipant}
        isOtherParticipantTyping={isOtherParticipantTyping}
        isOtherUserBlocked={isOtherUserBlocked}
        onBlockUser={onBlockUser}
        onUnblockUser={onUnblockUser}
      />

      <ScrollArea
        className="flex-1 p-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted/50 scrollbar-track-transparent"
        ref={scrollAreaRef}
      >
        <MessageList
          messages={messages}
          currentUser={currentUser}
          otherParticipant={otherParticipant}
          onLoadMoreMessages={onLoadMoreMessages}
        />
      </ScrollArea>

      {isOtherUserBlocked ? (
        <div className="p-4 text-center text-muted-foreground border-t bg-background/95 backdrop-blur-sm">
          You have blocked this user. Unblock to send messages.
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
