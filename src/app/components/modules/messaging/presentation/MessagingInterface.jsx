// MessagingPresentation.jsx
import { Button } from "@/app/components/ui/Button";
import { ChatContainer } from "../container/ChatInterfaceContainer";
import { ConversationListContainer } from "../container/ConversationListContainer";
import AddIcon from '@mui/icons-material/Add'; // Import MUI Add icon

export function MessagingPresentation({
    messages,
    userConversations,
    selectedConversation,
    selectedConversationId,
    currentUser,
    onSelectConversation,
    onMarkAsRead,
    onMarkAsUnread,
    onToggleBlock,
    onSendMessage,
    onSetTypingIndicator,
    onBack,
    onOpenConnections,
    isMobile
}) {
    const hasSelectedConversation = Boolean(selectedConversation);

    return (
        <section 
            className="mx-auto max-w-7xl rounded-lg border bg-background shadow-sm h-[calc(100vh-4rem)]"
            aria-label="Messaging interface"
        >
            <div className="flex w-full h-full flex-col md:flex-row">
                {/* Conversation List Panel */}
                <aside 
                    className={`${hasSelectedConversation ? 'hidden md:block' : 'block'} w-full md:w-1/3 md:border-r flex flex-col`}
                    aria-label="Conversation list"
                >
                    <div className="flex flex-col h-full overflow-hidden">
                        <ConversationListContainer
                            conversations={userConversations}
                            onSelectConversation={onSelectConversation}
                            selectedConversationId={selectedConversationId}
                            currentUser={currentUser}
                            onMarkAsRead={onMarkAsRead}
                            onMarkAsUnread={onMarkAsUnread}
                            onToggleBlock={onToggleBlock}
                        />
                        
                        <footer className="p-4 mt-auto border-t sticky bottom-0 bg-background z-10">
                            <Button 
                                onClick={onOpenConnections}
                                className="w-full px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                                aria-label="Start new conversation"
                            >
                                <AddIcon className="h-5 w-5" aria-hidden="true" />
                                <span>New Conversation</span>
                            </Button>
                        </footer>
                    </div>
                </aside>

                {/* Chat Panel */}
                <main 
                    className={`${hasSelectedConversation ? 'block' : 'hidden md:block'} w-full md:w-2/3`}
                    aria-label="Chat area"
                >
                    {hasSelectedConversation ? (
                        <ChatContainer
                            selectedConversation={selectedConversation}
                            messages={messages}
                            currentUser={currentUser}
                            onBack={onBack}
                            onSendMessage={onSendMessage}
                            onToggleBlock={onToggleBlock}
                            onSetTypingIndicator={onSetTypingIndicator}
                        />
                    ) : (
                        <div className="hidden md:flex flex-col items-center justify-center h-full">
                            <div className="text-center mb-6">
                                <h2 className="text-lg font-medium">Select a conversation</h2>
                                <p className="text-muted-foreground">
                                    Choose a conversation from the list to start messaging
                                </p>
                            </div>
                            <Button 
                                onClick={onOpenConnections}
                                className="px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
                                aria-label="Start new conversation"
                            >
                                <AddIcon className="h-5 w-5" aria-hidden="true" />
                                <span>New Conversation</span>
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </section>
    );
}
