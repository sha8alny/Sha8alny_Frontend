import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useState, useEffect, useRef } from "react";

export function ConnectionsModal({ 
  loading, 
  connections, 
  onClose, 
  onSelect, 
  hasMore, 
  loadingMore, 
  onLoadMore 
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const filteredConnections = searchTerm 
    ? connections.filter(c => 
        (c.name || c.username).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : connections;

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEscape);
    searchInputRef.current?.focus();
    
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        ref={modalRef}
        className="bg-foreground rounded-xl max-w-md w-full p-6 max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text">Select a Connection</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-background/80 transition-colors"
            data-testid="connections-modal-close"
            aria-label="Close"
          >
            <CloseIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search connections..."
            className="pl-10 pr-4 py-2 w-full border text-text border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-connections"
          />
        </div>

        <div className="overflow-y-auto flex-grow">
          {loading && connections.length === 0 ? (
            <div className="space-y-3 py-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConnections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? "No connections found matching your search" : "No connections found"}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filteredConnections.map((connection) => (
                <ConnectionItem
                  key={connection.id || connection.username}
                  connection={connection}
                  onClick={() => onSelect(connection)}
                  data-testid={`connection-item-${
                    connection.id || connection.username
                  }`}
                />
              ))}
            </div>
          )}
        </div>
            
        {hasMore && !searchTerm && (
          <div className="mt-4 pt-3 text-center border-t ">
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="px-4 py-2 bg-secondary max-w-3xs  rounded-md hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 w-full"
              data-testid="load-more-connections"
            >
              {loadingMore ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Loading...
                </span>
              ) : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ConnectionItem({ connection, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-background/60 rounded-lg cursor-pointer transition-colors"
      data-testid={props["data-testid"]}
    >
      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shadow-sm flex-shrink-0">
        {connection.avatar || connection.profilePicture ? (
          <img
            src={connection.avatar || connection.profilePicture}
            alt={connection.name || connection.username}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white bg-primary">
            {(connection.name || connection.username).charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-text/80 truncate">{connection.name || connection.username}</p>
        <p className="text-sm text-gray-500 truncate">
          {connection.headline || "Connection"}
        </p>
      </div>
    </div>
  );
}
