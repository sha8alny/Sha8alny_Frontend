// ChatPresentation.jsx
import React from "react";
import {Avatar , AvatarFallback, AvatarImage } from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { ScrollArea } from "@/app/components/ui/ScrollArea";
import { Textarea } from "@/app/components/ui/Textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/app/components/ui/DropDownMenu";
import { ArrowLeft, MoreVertical, Send, ImageIcon, Ban, Check } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { MediaPreview } from "./MediaPreview";
import { formatDate } from "@/app/utils/utils";

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
    // Find the other participant for display
    const otherParticipant = selectedConversation.participants?.find(
        (participant) => participant !== currentUser
    );
    // Check if the other participant is typing
    const isOtherParticipantTyping = selectedConversation.typingStatus?.[otherParticipant] === true;

    // Helper function to check if two dates are on the same day
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    // Render message list with date separators
    console.log("Rendering messages:", messages);
    const messageList = messages.map((message, index) => {
        // Show date separator if it's the first message or if the date is different from the previous message
        const showDateSeparator = index === 0 || 
            !isSameDay(formatDate(message.timestamp), formatDate(messages[index - 1].timestamp));
        
        return (
            <MessageBubble 
                key={message.messageId || message.id}
                message={{
                    messageId: message.messageId || message.id,
                    content: message.content || message.messageContent,
                    sender: message.sender || message.senderName,
                    timestamp: message.timestamp,
                    isDeleted: message.isDeleted,
                    read: message.read
                }}
                isCurrentUser={(message.sender || message.senderName) === currentUser}
                participantName={otherParticipant}
                showDateSeparator={showDateSeparator}
            />
        );
    });
    
    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-3 border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack} >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        <AvatarImage
                            src={otherParticipant?.picture || "/placeholder.svg"}
                            alt={otherParticipant}
                        />
                        <AvatarFallback>{otherParticipant?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium text-sm sm:text-base text-text">{otherParticipant}</div>
                        {isOtherParticipantTyping && (
                            <div className="text-xs text-muted-foreground">Typing...</div>
                        )}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {selectedConversation.isBlocked ? (
                            <DropdownMenuItem onClick={onUnblockUser}>
                                <Check className="mr-2 h-4 w-4" />
                                Unblock user
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onClick={onBlockUser}>
                                <Ban className="mr-2 h-4 w-4" />
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
            {selectedConversation.isBlocked ? (
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
                                <ImageIcon className="h-5 w-5" />
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
                                className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                                rows={1}
                            />
                            <Button 
                                size="icon" 
                                onClick={onSendMessage}
                                className="flex-shrink-0 h-10 w-10"
                                disabled={!message.trim() && mediaFiles.length === 0}
                            >
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}