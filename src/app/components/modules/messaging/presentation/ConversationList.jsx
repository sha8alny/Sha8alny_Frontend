import React, { useMemo } from "react";
// UI Components
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
// Icons
import { Search, MoreVertical, Check } from "lucide-react";
// Utils
import { formatDistanceToNow } from "@/app/utils/messagingUtils";

// Conversation actions component
const ConversationActions = React.memo(
  ({ conversation, onToggleRead, onToggleBlock, onMenuClick }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0 ml-1 hover:bg-muted-foreground/10"
          onClick={onMenuClick}
          data-testid={`conversation-actions-button-${conversation.id}`}
        >
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          className="flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            onToggleRead(conversation.id, !conversation.read);
          }}
          data-testid={`toggle-read-button-${conversation.id}`}
        >
          <span className="truncate">
            Mark as {conversation.read ? "unread" : "read"}
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="flex items-center"
          onClick={(e) => {
            e.stopPropagation();
            onToggleBlock(
              conversation.id,
              conversation.otherUsername,
              !conversation.isOtherParticipantBlocked
            );
          }}
          data-testid={`toggle-block-button-${conversation.id}`}
        >
          {conversation.isOtherParticipantBlocked && (
            <Check className="mr-2 h-4 w-4 flex-shrink-0" />
          )}
          <span className="truncate">
            {conversation.isOtherParticipantBlocked
              ? "Unblock user"
              : "Block user"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
);

// Conversation item component
const ConversationItem = React.memo(
  ({ conversation, isSelected, onSelect, onToggleRead, onToggleBlock }) => {
    const otherParticipant = conversation.otherParticipantDetails;
    const isBlocked = conversation.isOtherParticipantBlocked;
    const otherUsername = conversation.otherUsername;

    const displayName = otherParticipant?.name || otherUsername;
    const avatarFallback = (
      otherParticipant?.name?.substring(0, 2) ||
      otherUsername?.substring(0, 2) ||
      "??"
    ).toUpperCase();

    const timestamp = conversation?.timestamp
      ? formatDistanceToNow(
          typeof conversation.timestamp?.toDate === "function"
            ? conversation.timestamp.toDate()
            : new Date(conversation.timestamp)
        )
      : "";

    const handleMenuClick = (e) => e.stopPropagation();

    const isLastMessageFromOtherUser =
      conversation.lastMessageSender === displayName;

    return (
      <div
        className={`flex items-start gap-3 p-3 mx-2 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
          isSelected ? "bg-secondary/20" : "hover:bg-background/30"
        }`}
        onClick={() => onSelect(conversation.id)}
        data-testid={`conversation-item-${conversation.id}`}
      >
        <Avatar className="flex-shrink-0">
          <AvatarImage
            src={otherParticipant?.profilePicture || `/placeholder.svg`}
            alt={displayName}
          />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center justify-between w-full">
            <div className="font-medium truncate max-w-[60%] text-text">
              {displayName}
              {isBlocked && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (Blocked)
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
              {timestamp}
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 w-full">
            <div className="text-sm text-muted-foreground truncate pr-2 max-w-3xs">
              {conversation.isOtherParticipantTyping ? (
                <span className="italic">Typing...</span>
              ) : conversation?.lastMessage ? (
                <span>
                  {isLastMessageFromOtherUser ? displayName : "Me"}:{" "}
                  {conversation.lastMessage}
                </span>
              ) : (
                <span className="italic">No messages yet</span>
              )}
            </div>

            {(!conversation.read || conversation.unseenCount > 0) && (
              <Badge
                variant="default"
                className="rounded-full h-5 w-5 flex-shrink-0 flex items-center justify-center min-w-[1.25rem]"
              >
                {conversation.unseenCount > 0 ? conversation.unseenCount : ""}
              </Badge>
            )}
          </div>
        </div>

        <ConversationActions
          conversation={conversation}
          onToggleRead={onToggleRead}
          onToggleBlock={onToggleBlock}
          onMenuClick={handleMenuClick}
        />
      </div>
    );
  }
);

// Main component
export function ConversationListPresentation({
  filteredConversations,
  selectedConversationId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  onToggleRead,
  onToggleBlock,
}) {
  const hasConversations = filteredConversations.length > 0;

  return (
    <div className="flex flex-col h-full md:bg-foreground bg-foreground transition-colors duration-200">
      <div className="sticky top-0 z-10 p-3 border-b bg-foreground/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={onSearchChange}
            className="flex-1 text-text"
            data-testid="conversation-search-input"
          />
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            data-testid="conversation-search-button"
          >
            <Search className="h-4 w-4 text-text" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="py-2">
          {hasConversations ? (
            filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isSelected={selectedConversationId === conversation.id}
                onSelect={onSelectConversation}
                onToggleRead={onToggleRead}
                onToggleBlock={onToggleBlock}
              />
            ))
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
