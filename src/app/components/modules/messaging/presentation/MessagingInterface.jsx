// MessagingPresentation.jsx
import { Button } from "@/app/components/ui/Button";
import { ChatContainer } from "../container/ChatInterfaceContainer";
import { ConversationListContainer } from "../container/ConversationListContainer";
import AddIcon from '@mui/icons-material/Add'; // Import MUI Add icon

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
}) {
    const hasSelectedConversation = Boolean(selectedConversation);

    return (
        <section 
            className="w-full max-w-7xl mx-auto border bg-background shadow-sm flex flex-col h-[calc(100vh-6rem)] mt-2" // Adjusted height for top navbar
            aria-label="Messaging interface"
        >
            <div className="flex w-full h-full flex-row overflow-hidden">
                {/* Conversation List Panel */}
                <aside 
                    className={`${hasSelectedConversation ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-1/3 lg:w-1/4 md:border-r overflow-hidden`}
                    aria-label="Conversation list"
                >
                    <div className="flex-1 overflow-hidden ">
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
                        <Button 
                            onClick={onOpenConnections}
                            className="w-full px-4 py-2 rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                            aria-label="Start new conversation"
                        >
                            <AddIcon className="h-5 w-5" aria-hidden="true" />
                            <span>New Conversation</span>
                        </Button>
                    </footer>
                </aside>

                {/* Chat Panel */}
                <main 
                    className={`${hasSelectedConversation ? 'flex' : 'hidden md:flex'} flex-col w-full md:w-2/3 lg:w-3/4 overflow-hidden`}
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
                        <div className="hidden md:flex flex-col items-center justify-center h-full p-4">
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