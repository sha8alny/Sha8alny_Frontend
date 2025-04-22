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
    const otherParticipant = selectedConversation.participantName || 
        (selectedConversation.participants?.find(p => p !== currentUser.username) || "User");
    
    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <Button variant="ghost" size="icon" onClick={onBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    )}
                    <Avatar>
                        <AvatarImage
                            src={selectedConversation.participantAvatar || "/placeholder.svg"}
                            alt={otherParticipant}
                        />
                        <AvatarFallback>{otherParticipant?.substring(0, 2).toUpperCase() || "??"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{otherParticipant}</div>
                        {selectedConversation.isTyping && <div className="text-xs text-muted-foreground">Typing...</div>}
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
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

            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <MessageBubble
                            key={msg.id}
                            message={{
                                messageId: msg.id,
                                content: msg.messageContent,
                                sender: msg.senderName,
                                timestamp: msg.timestamp,
                                isDeleted: msg.isDeleted,
                                read: msg.read
                            }}
                            isCurrentUser={msg.senderName === currentUser}
                            participantName={otherParticipant}
                            currentUserName={currentUser}
                        />
                    ))}
                </div>
            </ScrollArea>

            {selectedConversation.isBlocked ? (
                <div className="p-4 text-center text-muted-foreground border-t">
                    You have blocked this user. Unblock to send messages.
                </div>
            ) : (
                <>
                    {mediaFiles.length > 0 && (
                        <div className="p-2 border-t">
                            <div className="flex gap-2 overflow-x-auto p-2">
                                {mediaFiles.map((file, index) => (
                                    <MediaPreview key={index} file={file} onRemove={() => onRemoveFile(index)} />
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="p-4 border-t sticky bottom-0 ">
                        <div className="flex gap-2">
                            <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
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
                                className="flex-1 min-h-[40px] max-h-[120px]"
                            />
                            <Button size="icon" onClick={onSendMessage}>
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
