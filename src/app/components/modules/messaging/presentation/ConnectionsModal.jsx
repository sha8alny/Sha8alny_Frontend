import React from "react";

export function ConnectionsModal({ loading, connections, onClose, onSelect }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Select a Connection</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-200"
            data-testid="connections-modal-close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading connections...</p>
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-8">
            <p>No connections found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {connections.map((connection) => (
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
    </div>
  );
}

function ConnectionItem({ connection, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-md cursor-pointer"
      data-testid={props["data-testid"]}
    >
      <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
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
      <div>
        <p className="font-medium">{connection.name || connection.username}</p>
        <p className="text-sm text-gray-500">
          {connection.headline || "Connection"}
        </p>
      </div>
    </div>
  );
}
