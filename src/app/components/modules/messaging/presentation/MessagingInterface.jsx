import { Button } from "@/app/components/ui/Button";
import { ChatContainer } from "../container/ChatInterfaceContainer";
import { ConversationListContainer } from "../container/ConversationListContainer";
import { MessageRequestsContainer } from "../container/MessageRequestsContainer";
import AddIcon from "@mui/icons-material/Add";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

//  New Conversation button component
const NewConversationButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    className="mx-auto w-full max-w-lg px-4 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
    aria-label="Start new conversation"
    data-testid="new-conversation-button"
  >
    <AddIcon className="h-5 w-5" aria-hidden="true" />
    <span>New Conversation</span>
  </Button>
);

//  Message Requests button component
const MessageRequestsButton = ({ onClick, requestCount }) => (
  <Button
    onClick={onClick}
    className="text-secondary-foreground w-full px-4 py-2 rounded-md bg-primary/10 hover:bg-primary/20 border border-primary/20 transition-colors flex items-center justify-center gap-2"
    variant="outline"
    data-testid="message-requests-button"
  >
    <MailOutlineIcon className="h-5 w-5" aria-hidden="true" />{" "}
    {/* Changed icon */}
    <span>Message Requests</span>
    {requestCount > 0 && (
      <span className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded-full">
        {requestCount}
      </span>
    )}
  </Button>
);
// Empty state component when no conversation is selected
const EmptyState = ({
  onOpenConnections,
  onViewRequests,
  requestCount = 0,
}) => (
  <div className="flex flex-col items-center justify-center h-full p-4 md:opacity-100 opacity-0 transition-opacity duration-300">
    <div className="text-center mb-6">
      <h2 className="text-lg font-medium text-text">Select a conversation</h2>
      <p className="text-muted-foreground">
        Choose a conversation from the list to start messaging
      </p>
    </div>
    <div className="flex flex-col gap-3 w-full max-w-lg">
      <NewConversationButton onClick={onOpenConnections} />

      <MessageRequestsButton
        onClick={onViewRequests}
        requestCount={requestCount}
      />
    </div>
  </div>
);
/**
 * @namespace messages
 * @module messages
 */
/**
 * MessagingPresentation
 *
 * Main messaging interface layout, including conversation list, chat area, and message requests.
 *
 * @param {Object} props
 * @param {Array} props.userConversations - List of user conversations.
 * @param {Object} props.selectedConversation - The currently selected conversation object.
 * @param {string} props.currentUser - The current user's identifier.
 * @param {function} props.onSelectConversation - Handler for selecting a conversation.
 * @param {function} props.onToggleRead - Handler for toggling read/unread status.
 * @param {function} props.onToggleBlock - Handler for blocking/unblocking a user.
 * @param {function} props.onDeleteConversation - Handler for deleting a conversation.
 * @param {boolean} props.isDeleting - Whether a conversation is being deleted.
 * @param {function} props.onBack - Handler for navigating back.
 * @param {function} props.onOpenConnections - Handler for opening new connections.
 * @param {function} props.onLoadMoreMessages - Handler for loading more messages in chat.
 * @param {boolean} [props.showMessageRequests=false] - Whether to show the message requests panel.
 * @param {function} props.onViewMessageRequests - Handler for viewing message requests.
 * @param {function} props.onCloseMessageRequests - Handler for closing message requests panel.
 * @param {number} [props.pendingRequestCount=0] - Number of pending message requests.
 * @param {function} props.navigateToUser - Handler for navigating to a user's profile.
 * @param {function} props.startConversation - Handler for starting a new conversation.
 */
export function MessagingPresentation({
  userConversations,
  selectedConversation,
  currentUser,
  onSelectConversation,
  onToggleRead,
  onToggleBlock,
  onDeleteConversation,
  isDeleting,
  onBack,
  onOpenConnections,
  onLoadMoreMessages,
  showMessageRequests = false,
  onViewMessageRequests,
  onCloseMessageRequests,
  pendingRequestCount = 0,
  navigateToUser,
  startConversation,
}) {
  const hasSelectedConversation = Boolean(selectedConversation);

  // Dynamic classes for responsive layout
  const asideClasses = `
    ${
      hasSelectedConversation || showMessageRequests
        ? "translate-x-[-100%] w-0 md:translate-x-0 md:w-1/3 lg:w-1/4"
        : "translate-x-0 w-full md:w-1/3 lg:w-1/4"
    }
    flex flex-col min-w-0 md:min-w-fit md:border-r overflow-hidden transition-all duration-300 ease-in-out
  `;

  const mainClasses = `
    ${
      hasSelectedConversation || showMessageRequests
        ? "translate-x-0 opacity-100 w-full"
        : "translate-x-full opacity-0 w-0 md:translate-x-0 md:opacity-100 md:w-2/3 lg:w-3/4"
    }
    flex flex-col overflow-hidden transition-all duration-300 ease-in-out
  `;

  return (
    <section
      className="w-full max-w-7xl mx-auto border bg-background shadow-2xl flex flex-col h-[calc(100vh-6rem)] mt-2 rounded-2xl"
      aria-label="Messaging interface"
    >
      <div className="flex w-full h-full flex-row overflow-hidden rounded-2xl">
        {/* Conversation List Panel */}
        <aside className={asideClasses} aria-label="Conversation list">
          <div className="flex-1 overflow-hidden">
            <ConversationListContainer
              conversations={userConversations}
              onSelectConversation={onSelectConversation}
              selectedConversationId={selectedConversation?.id}
              currentUser={currentUser}
              onToggleRead={onToggleRead}
              onToggleBlock={onToggleBlock}
              onDeleteConversation={onDeleteConversation}
              isDeleting={isDeleting}
            />
          </div>

          <footer className="p-3.5 border-t bg-foreground/70 md:bg-foreground transition-colors duration-200 z-10 flex-shrink-0 rounded-bl-2xl">
            <div className="flex items-center gap-3 md:gap-2">
              <Button
                onClick={onOpenConnections}
                className="flex-1 py-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                aria-label="Start new conversation"
                data-testid="new-conversation-button"
              >
                <AddIcon className="h-5 w-5" aria-hidden="true" />
                <span className="sm:inline">New Conversation</span>
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={onViewMessageRequests}
                className="flex-shrink-0 relative h-10 w-10 text-secondary-foreground border border-primary/20 hover:bg-primary/20 transition-colors "
                aria-label="View message requests"
                data-testid="message-requests-icon-button"
              >
                <MailOutlineIcon className="h-5 w-5" />
                {pendingRequestCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {pendingRequestCount}
                  </span>
                )}
              </Button>
            </div>
          </footer>
        </aside>

        {/* Chat Panel */}
        <main className={mainClasses} aria-label="Chat area">
          {hasSelectedConversation ? (
            <ChatContainer
              selectedConversation={selectedConversation}
              currentUser={currentUser}
              onBack={onBack}
              onToggleBlock={onToggleBlock}
              onLoadMoreMessages={onLoadMoreMessages}
            />
          ) : showMessageRequests ? (
            <MessageRequestsContainer
              currentUser={currentUser}
              onBack={onCloseMessageRequests}
              onSelectConversation={onSelectConversation}
              navigateToUser={startConversation}
            />
          ) : (
            <EmptyState
              onOpenConnections={onOpenConnections}
              onViewRequests={onViewMessageRequests}
              requestCount={pendingRequestCount}
            />
          )}
        </main>
      </div>
    </section>
  );
}
export default MessagingPresentation;
