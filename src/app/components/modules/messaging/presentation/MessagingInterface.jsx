import { Button } from "@/app/components/ui/Button";
import { ChatContainer } from "../container/ChatInterfaceContainer";
import { ConversationListContainer } from "../container/ConversationListContainer";
import AddIcon from "@mui/icons-material/Add";

// Extracted New Conversation button component
const NewConversationButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    className="w-full max-w-lg px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
    aria-label="Start new conversation"
    data-testid="new-conversation-button"
  >
    <AddIcon className="h-5 w-5" aria-hidden="true" />
    <span>New Conversation</span>
  </Button>
);

export function MessagingPresentation({
  messages,
  userConversations,
  selectedConversation,
  currentUser,
  onSelectConversation,
  onMarkAsRead,
  onToggleRead,
  onToggleBlock,
  onSendMessage,
  onSetTypingIndicator,
  onBack,
  onOpenConnections,
  onLoadMoreMessages,
}) {
  const hasSelectedConversation = Boolean(selectedConversation);

  // Compute classes for responsive behavior
  const asideClasses = `
            ${
              hasSelectedConversation
                ? "translate-x-[-100%] w-0 md:translate-x-0 md:w-1/3 lg:w-1/4"
                : "translate-x-0 w-full md:w-1/3 lg:w-1/4"
            } 
            flex flex-col min-w-0 md:min-w-fit md:border-r overflow-hidden transition-all duration-300 ease-in-out
        `;

  const mainClasses = `
            ${
              hasSelectedConversation
                ? "translate-x-0 opacity-100 w-full"
                : "translate-x-full opacity-0 w-0 md:translate-x-0 md:opacity-100 md:w-2/3 lg:w-3/4"
            } 
            flex flex-col overflow-hidden transition-all duration-300 ease-in-out
        `;

  return (
    <section
      className="w-full max-w-7xl mx-auto border bg-background shadow-sm flex flex-col h-[calc(100vh-6rem)] mt-2"
      aria-label="Messaging interface"
    >
      <div className="flex w-full h-full flex-row overflow-hidden">
        {/* Conversation List Panel */}
        <aside className={asideClasses} aria-label="Conversation list">
          <div className="flex-1 overflow-hidden">
            <ConversationListContainer
              conversations={userConversations}
              onSelectConversation={onSelectConversation}
              selectedConversationId={selectedConversation?.id}
              currentUser={currentUser}
              onMarkAsRead={onMarkAsRead}
              onToggleRead={onToggleRead}
              onToggleBlock={onToggleBlock}
            />
          </div>

          <footer className="p-3.5 border-t md:bg-foreground bg-foreground/70 transition-colors duration-200 z-10 flex-shrink-0">
            <NewConversationButton onClick={onOpenConnections} />
          </footer>
        </aside>

        {/* Chat Panel */}
        <main className={mainClasses} aria-label="Chat area">
          {hasSelectedConversation ? (
            <ChatContainer
              selectedConversation={selectedConversation}
              messages={messages}
              currentUser={currentUser}
              onBack={onBack}
              onSendMessage={onSendMessage}
              onToggleBlock={onToggleBlock}
              onSetTypingIndicator={onSetTypingIndicator}
              onLoadMoreMessages={onLoadMoreMessages}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 md:opacity-100 opacity-0 transition-opacity duration-300">
              <div className="text-center mb-6">
                <h2 className="text-lg font-medium">Select a conversation</h2>
                <p className="text-muted-foreground">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
              <NewConversationButton onClick={onOpenConnections} />
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
