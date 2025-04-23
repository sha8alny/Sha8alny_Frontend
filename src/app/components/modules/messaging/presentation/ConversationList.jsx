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
  onToggleRead,
  onToggleBlock,
}) {
  return (
    <div className="flex flex-col h-full md:bg-foreground bg-foreground/70 transition-colors duration-200">
      <div className="sticky top-0 z-10 p-3 border-b bg-foreground/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={onSearchChange}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="py-2">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conversation) => {
              return (
                <div
                  key={conversation.id}
                  className={`flex items-start gap-3 p-3 mx-2 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedConversationId === conversation.id
                      ? "bg-secondary/20"
                      : "hover:bg-background/30"
                  }`}
                  onClick={() => {
                    onSelectConversation(conversation.id);
                    onMarkAsRead(conversation.id);
                  }}
                >
                  <Avatar className="flex-shrink-0">
                    <AvatarImage
                      src={`/placeholder.svg`}
                      alt={conversation.otherParticipant}
                    />
                    <AvatarFallback>
                      {conversation.otherParticipant?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate text-text">
                        {conversation.otherParticipant}
                        {conversation.isBlocked && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Blocked)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
                        {conversation?.timestamp
                          ? formatDistanceToNow(
                              new Date(conversation.timestamp.seconds * 1000)
                            )
                          : ""}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-sm text-muted-foreground truncate max-w-[180px] sm:max-w-[220px] md:max-w-[250px]">
                        {conversation.isOtherParticipantTyping ? (
                          <span className="italic">Typing...</span>
                        ) : conversation?.lastMessage ? (
                          <span>{conversation.lastMessage}</span>
                        ) : (
                          <span className="italic">No messages yet</span>
                        )}
                      </div>
                      {!conversation.read ? (
                        <Badge
                          variant="default"
                          className="rounded-full px-2 py-2 text-xs"
                        >
                          {conversation.unseenCount > 0 ? conversation.unseenCount : ''}
                        </Badge>
                      ) : (
                        conversation.unseenCount > 0 && (
                          <Badge
                            variant="default"
                            className="rounded-full text-xs"
                          >
                            {conversation.unseenCount}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
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
                            onToggleRead();
                          }}
                        >
                          Mark as unread
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleRead();
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