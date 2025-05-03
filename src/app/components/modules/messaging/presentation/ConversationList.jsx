import React, { useMemo, useState } from "react";
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
// MUI Icons
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckIcon from '@mui/icons-material/Check';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// Utils
import { formatDistanceToNow } from "@/app/utils/messagingUtils";
// Components
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";

// Conversation actions component
const ConversationActions = React.memo(
  ({
    conversation,
    onToggleRead,
    onToggleBlock,
    onDeleteConversation,
    onMenuClick,
    isDeleting,
  }) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const handleDeleteClick = (e) => {
      e.stopPropagation();
      setShowDeleteConfirmation(true);
    };

    const handleConfirmDelete = () => {
      onDeleteConversation(conversation.id, conversation.otherUsername);
      // Close the dialog with a slight delay after deletion initiated
      setTimeout(() => {
        setShowDeleteConfirmation(false);
      }, 3000);
    };

    const displayName =
      conversation.otherParticipantDetails?.name || conversation.otherUsername;

    // Prevent conversation selection when clicking anywhere inside the component
    // if the delete confirmation is showing
    const containerProps = showDeleteConfirmation
      ? {
          onClick: (e) => e.stopPropagation(),
        }
      : {};

    return (
      <div {...containerProps}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0 ml-1 hover:bg-muted-foreground/10"
              onClick={onMenuClick}
              data-testid={`conversation-actions-button-${conversation.id}`}
            >
              <MoreVertIcon className="h-4 w-4 text-muted-foreground" />
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
                <CheckIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              )}
              <span className="truncate">
                {conversation.isOtherParticipantBlocked
                  ? "Unblock user"
                  : "Block user"}
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex items-center text-destructive"
              onClick={handleDeleteClick}
              data-testid={`delete-conversation-button-${conversation.id}`}
            >
              <DeleteOutlineIcon className="mr-2 h-4 w-4 flex-shrink-0 text-destructive" />
              <span className="truncate">Delete conversation</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteConfirmationDialog
          isOpen={showDeleteConfirmation}
          onClose={(open) => {
            if (!open) {
              // Prevent event propagation when closing dialog
              setTimeout(() => setShowDeleteConfirmation(false), 0);
            }
          }}
          onConfirm={handleConfirmDelete}
          participantName={displayName}
          isDeleting={isDeleting}
        />
      </div>
    );
  }
);

// Conversation item component
const ConversationItem = React.memo(
  ({
    conversation,
    isSelected,
    onSelect,
    onToggleRead,
    onToggleBlock,
    onDeleteConversation,
    isDeleting,
  }) => {
    const otherParticipant = conversation.otherParticipantDetails;
    const isOtherBlocked = conversation.isOtherParticipantBlocked;
    const isCurrentUserBlocked = conversation.isCurrentUserBlocked;
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

    // Determine block status text
    let blockStatusText = null;
    if (isOtherBlocked) {
      blockStatusText = "(Blocked)";
    } else if (isCurrentUserBlocked) {
      blockStatusText = "(Blocked you)";
    }

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
              {blockStatusText && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {blockStatusText}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground whitespace-nowrap ml-2 flex-shrink-0">
              {timestamp}
            </div>
          </div>

          <div className="flex items-center justify-between mt-1 w-full">
            <div className="text-sm text-muted-foreground truncate pr-2 w-3xs">
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
          onDeleteConversation={onDeleteConversation}
          onMenuClick={handleMenuClick}
          isDeleting={isDeleting}
        />
      </div>
    );
  }
);
/**
 * @namespace messages
 * @module messages
 */
/**
 * ConversationListPresentation
 *
 * Displays a searchable, scrollable list of conversations.
 *
 * @param {Object} props
 * @param {Array} props.filteredConversations - Array of conversation objects to display.
 * @param {string} props.selectedConversationId - ID of the currently selected conversation.
 * @param {string} props.searchQuery - Current search input value.
 * @param {function} props.onSearchChange - Handler for search input changes.
 * @param {function} props.onSelectConversation - Handler for selecting a conversation.
 * @param {function} props.onToggleRead - Handler for toggling read/unread status.
 * @param {function} props.onToggleBlock - Handler for blocking/unblocking a participant.
 * @param {function} props.onDeleteConversation - Handler for deleting a conversation.
 * @param {boolean} [props.isDeleting=false] - Whether a conversation is currently being deleted.
 */
export function ConversationListPresentation({
  filteredConversations,
  selectedConversationId,
  searchQuery,
  onSearchChange,
  onSelectConversation,
  onToggleRead,
  onToggleBlock,
  onDeleteConversation,
  isDeleting = false,
}) {
  const hasConversations = filteredConversations.length > 0;

  return (
    <div className="flex flex-col h-full md:bg-foreground bg-foreground transition-colors duration-200 ">
      <div className="sticky top-0 z-10 p-3 border-b bg-foreground/95 backdrop-blur-sm rounded-tl-2xl">
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
            <SearchIcon className="h-4 w-4 text-text" />
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
                onDeleteConversation={onDeleteConversation}
                isDeleting={isDeleting}
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
export default ConversationListPresentation;
