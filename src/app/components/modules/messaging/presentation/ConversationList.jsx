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
  searchQuery,
  onSearchChange,
  onSelectConversation,
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
              // Extract participant details from the processed conversation object
              const otherParticipant = conversation.otherParticipantDetails; 
              const isBlockedByCurrentUser = conversation.isOtherParticipantBlocked; // Assuming this is processed in container

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
                  }}
                >
                  <Avatar className="flex-shrink-0">
                    <AvatarImage
                      src={otherParticipant?.profilePicture || `/placeholder.svg`}
                      alt={otherParticipant?.name || otherParticipant?.username}
                    />
                    <AvatarFallback>
                      {/* Use name or username for fallback */}
                      {otherParticipant?.name?.substring(0, 2).toUpperCase() || otherParticipant?.username?.substring(0, 2).toUpperCase() || "??"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center justify-between w-full">
                      <div className="font-medium truncate max-w-[60%] text-text">
                        {otherParticipant?.name || otherParticipant?.username} 
                        {isBlockedByCurrentUser && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (Blocked)
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
                        {conversation?.timestamp
                          ? formatDistanceToNow(
                              typeof conversation.timestamp?.toDate === 'function' 
                                ? conversation.timestamp.toDate() 
                                : new Date(conversation.timestamp)
                            )
                          : ""}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1 w-full">
                      <div className="text-sm text-muted-foreground truncate pr-2 max-w-3xs" >
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
                          className="rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center min-w-[1.25rem]"
                        >
                          {conversation.unseenCount > 0 ? conversation.unseenCount : ''}
                        </Badge>
                      ) : (
                        conversation.unseenCount > 0 && (
                          <Badge
                            variant="default"
                            className="rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center min-w-[1.25rem]"
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
                        className="h-8 w-8 flex-shrink-0 ml-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {conversation.read ? (
                        <DropdownMenuItem
                          className="flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleRead(conversation.id, false);
                          }}
                        >
                          <span className="truncate">Mark as unread</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleRead(conversation.id, true);
                          }}
                        >
                          <span className="truncate">Mark as read</span>
                        </DropdownMenuItem>
                      )}
                      {isBlockedByCurrentUser ? (
                        <DropdownMenuItem
                          className="flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBlock(conversation.id, otherParticipant.username, false); 
                          }}
                        >
                          <Check className="mr-2 h-4 w-4 flex-shrink-0" />
                          <span className="truncate">Unblock user</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          className="flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBlock(conversation.id, otherParticipant.username, true);
                          }}
                        >
                          <span className="truncate">Block user</span>
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