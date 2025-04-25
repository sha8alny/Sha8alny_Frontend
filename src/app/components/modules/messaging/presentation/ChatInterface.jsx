// ChatPresentation.jsx
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { ScrollArea } from "@/app/components/ui/ScrollArea";
import { Textarea } from "@/app/components/ui/Textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/DropDownMenu";
import { MessageBubble } from "./MessageBubble";
import { MediaPreview } from "./MediaPreview";

// Import MUI Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';


export function ChatPresentation({
    selectedConversation,
    currentUser,
    message,
    messages,
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
    onUnblockUser
}) {
    // Find the other participant object
    const otherParticipant = selectedConversation.participants?.find(
        (p) => p.username !== currentUser
    );
    // Check if the other participant is typing using their username
    const isOtherParticipantTyping = otherParticipant?.username ? selectedConversation.typingStatus?.[otherParticipant.username] === true : false;

    // Determine if the current user has blocked the other participant
    // This assumes the `isBlocked` flag on the *other* participant's object means they are blocked by the current user.
    const isOtherUserBlocked = otherParticipant?.isBlocked === true;

    // Helper function to check if two dates are on the same day
    function isSameDay(date1, date2) {
        // Handle potential string dates from schema
        const d1 = typeof date1?.toDate === 'function' ? date1.toDate() : new Date(date1);
        const d2 = typeof date2?.toDate === 'function' ? date2.toDate() : new Date(date2);
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    // Render message list with date separators
    const messageList = messages.map((msg, index) => {
        // Show date separator if it's the first message or if the date is different from the previous message
        const showDateSeparator = index === 0 ||
            !isSameDay(msg.timestamp, messages[index - 1].timestamp);

        return (
            <MessageBubble
                key={msg.id} // Use messageId
                message={msg}
                isCurrentUser={msg.senderName === currentUser}
                // Pass other participant's details for avatar/name if needed by bubble
                participantName={otherParticipant?.name || otherParticipant?.username}
                participantPicture={otherParticipant?.profilePicture}
                showDateSeparator={showDateSeparator}
            />
        );
    });

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack} >
                            <ArrowBackIcon sx={{ fontSize: 20 }} /> {/* Replaced ArrowLeft */}
                        </Button>
                    )}
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage
                            // Use other participant's profile picture
                            src={otherParticipant?.profilePicture || "/placeholder.svg"}
                            alt={otherParticipant?.name || otherParticipant?.username}
                        />
                        {/* Use other participant's name or username for fallback */}
                        <AvatarFallback>{otherParticipant?.name?.substring(0, 2).toUpperCase() || otherParticipant?.username?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                    </Avatar>
                    <div>
                        {/* Use other participant's name or username */}
                        <div className="font-medium text-sm sm:text-base text-text">{otherParticipant?.name || otherParticipant?.username}</div>
                        {isOtherParticipantTyping && (
                            <div className="text-xs text-muted-foreground">Typing...</div>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertIcon sx={{ fontSize: 20 }} /> {/* Replaced MoreVertical */}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* Use isOtherUserBlocked status */}
                        {isOtherUserBlocked ? (
                            <DropdownMenuItem onClick={onUnblockUser}>
                                <CheckIcon sx={{ mr: 1, fontSize: 16 }} /> {/* Replaced Check */}
                                Unblock user
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={onBlockUser}>
                                <BlockIcon sx={{ mr: 1, fontSize: 16 }} /> {/* Replaced Ban */}
                                Block user
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Messages Area */}
            <ScrollArea
                className="flex-1 p-3 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted/50 scrollbar-track-transparent"
                ref={scrollAreaRef}
            >
                <div className="space-y-4 pb-2">
                    {messageList}
                </div>
            </ScrollArea>

            {/* Blocked Message or Input Area */}
            {/* Check block status based on the other participant */}
            {isOtherUserBlocked ? (
                <div className="p-4 text-center text-muted-foreground border-t bg-background/95 backdrop-blur-sm">
                    You have blocked this user. Unblock to send messages.
                </div>
            ) : (
                <>
                    {/* Media Preview Area */}
                    {mediaFiles.length > 0 && (
                        <div className="p-2 border-t bg-background">
                            <div className="flex gap-2 overflow-x-auto p-2 scrollbar-thin">
                                {mediaFiles.map((file, index) => (
                                    <MediaPreview key={index} file={file} onRemove={() => onRemoveFile(index)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Message Input Area */}
                    <div className="p-3 border-t sticky bottom-0 bg-background/95 backdrop-blur-sm z-10 flex-shrink-0">
                        <div className="flex gap-2 items-end">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex-shrink-0 h-10 w-10"
                            >
                                <ImageIcon sx={{ fontSize: 20 }} className="text-primary" /> {/* Replaced ImageIcon */}
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
                            />
                            <Button
                                size="icon"
                                onClick={onSendMessage}
                                className="flex-shrink-0 h-10 w-10"
                                disabled={!message.trim() && mediaFiles.length === 0}
                            >
                                <SendIcon sx={{ fontSize: 20 }} /> {/* Replaced Send */}
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}