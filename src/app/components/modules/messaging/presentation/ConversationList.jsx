// ConversationListPresentation.jsx

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import { Badge } from "@/app/components/ui/Badge";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { ScrollArea } from "@/app/components/ui/ScrollArea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/DropDownMenu";
import { Search, MoreVertical, Check } from "lucide-react";
import { formatDistanceToNow } from "@/app/utils/utils";

export function ConversationListPresentation({
  filteredConversations,
  selectedConversationId,
  currentUser,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  onMarkAsRead,
  onMarkAsUnread,
  onToggleBlock,
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={onSearchChange}
            className="flex-1"
          />
          <Button variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              // Find the participant who is not the current user
              const otherParticipant = conversation.participants?.find(
                (participant) => participant !== currentUser
              ) || "Unknown";

              return (
                <div
                  key={conversation.id}
                  className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversationId === conversation.id
                      ? "bg-accent"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <Avatar>
                    <AvatarImage
                      src={`/placeholder.svg`}
                      alt={otherParticipant}
                    />
                    <AvatarFallback>
                      {otherParticipant?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate text-text">
                        {otherParticipant}
                        {conversation.isBlocked && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Blocked)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {conversation.timestamp
                          ? formatDistanceToNow(
                              new Date(conversation.timestamp.seconds * 1000)
                            )
                          : ""}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-sm text-muted-foreground truncate max-w-[180px]">
                        {conversation.isTyping ? (
                          <span className="italic">Typing...</span>
                        ) : conversation.lastMessage ? (
                          <span>{conversation.lastMessage}</span>
                        ) : (
                          "Start a conversation"
                        )}
                      </div>
                      {!conversation.read && (
                        <Badge
                          variant="default"
                          className="rounded-full px-2 py-2 text-xs"
                        >
                          
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {conversation.read ? (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsUnread(conversation.id);
                          }}
                        >
                          Mark as unread
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(conversation.id);
                          }}
                        >
                          Mark as read
                        </DropdownMenuItem>
                      )}
                      {conversation.isBlocked ? (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBlock(conversation.id, false);
                          }}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Unblock user
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBlock(conversation.id, true);
                          }}
                        >
                          Block user
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              );
            })
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No conversations found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
