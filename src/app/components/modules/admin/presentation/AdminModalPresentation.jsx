import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/Dialog";

/**
 * @namespace admin
 * @module admin
 */

/**
 * AdminModalPresentation component that renders the UI for adding a new administrator.
 * This presentation component is responsible for rendering the admin selection modal
 * and forwarding user interactions to handler functions.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls whether the modal is open or closed
 * @param {Function} props.onOpenChange - Function to handle modal open state changes
 * @param {string} props.searchTerm - The current search term input by the user
 * @param {Function} props.onSearchChange - Handler for search input changes
 * @param {Array} props.users - List of users matching the search criteria
 * @param {boolean} props.isLoading - Indicates whether user search is in progress
 * @param {Object} props.selectedUser - The currently selected user, if any
 * @param {Function} props.onUserSelect - Handler for when a user is selected
 * @param {Function} props.onRemoveUser - Handler for removing the selected user
 * @param {Function} props.onAddAdmin - Handler for the add admin action
 * @param {boolean} props.isPending - Indicates whether admin creation is in progress
 * @returns {JSX.Element} The modal dialog UI for admin creation
 */
function AdminModalPresentation({
  open,
  onOpenChange,
  searchTerm,
  onSearchChange,
  users,
  isLoading,
  selectedUser,
  onUserSelect,
  onRemoveUser,
  onAddAdmin,
  isPending
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} data-testid="admin-modal">
      <DialogContent className="sm:max-w-[425px]" data-testid="admin-modal-content">
        <DialogHeader>
          <DialogTitle className="text-text" data-testid="admin-modal-title">Add Administrator</DialogTitle>
          <DialogDescription data-testid="admin-modal-description">
            Grant administrative privileges to a user.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          <div className="space-y-4 text-text">
            <div className="space-y-2">
              <label htmlFor="user-search" className="text-sm font-medium" data-testid="search-label">
                Search for a User
              </label>

              <div className="relative">
                <input
                  id="user-search"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Type to search users..."
                  value={searchTerm}
                  onChange={onSearchChange}
                  data-testid="user-search-input"
                />
              </div>

              {selectedUser && (
                <div className="mt-2 flex items-center gap-2 p-2 border rounded-md bg-muted/50" data-testid="selected-user-container">
                  <Avatar className="h-8 w-8" data-testid="selected-user-avatar">
                    <AvatarImage
                      src={selectedUser.profilePicture || "/placeholder.svg"}
                      alt={selectedUser.name}
                    />
                    <AvatarFallback>{selectedUser.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1" data-testid="selected-user-info">
                    <div className="font-medium" data-testid="selected-user-name">{selectedUser.name}</div>
                    <div className="text-xs text-muted-foreground" data-testid="selected-user-email">{selectedUser.email}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onRemoveUser}
                    className="h-8 w-8 p-0"
                    data-testid="remove-selected-user-btn"
                  >
                    <span className="sr-only">Remove</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </Button>
                </div>
              )}

              {searchTerm.length > 1 && !selectedUser && (
                <div className="relative mt-2 border rounded-md max-h-[200px] overflow-y-auto" data-testid="search-results-container">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-4" data-testid="search-loading-indicator">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  ) : users?.length > 0 ? (
                    <ul className="py-1" data-testid="user-results-list">
                      {users?.map((user) => (
                        <li key={user._id} data-testid={`user-item-${user._id}`}>
                          <button
                            className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2"
                            onClick={() => onUserSelect(user)}
                            data-testid={`select-user-btn-${user._id}`}
                          >
                            <Avatar className="h-8 w-8" data-testid={`user-avatar-${user._id}`}>
                              <AvatarImage
                                src={user.profilePicture || "/placeholder.svg"}
                                alt={user.name}
                              />
                              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span data-testid={`user-name-${user._id}`}>{user.name}</span>
                              <span className="text-xs text-muted-foreground" data-testid={`user-email-${user._id}`}>{user.email}</span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-3 py-2 text-sm text-center text-muted-foreground" data-testid="no-users-found">
                      No users found.
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2" data-testid="admin-info-text">
                Administrators have full access to manage users, content, and system settings.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button 
            className="text-text cursor-pointer" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            data-testid="cancel-button"
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            onClick={onAddAdmin}
            disabled={!selectedUser || isPending}
            data-testid="add-admin-button"
          >
            {isPending ? (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" data-testid="add-admin-loading" />
            ) : null}
            Add Administrator
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminModalPresentation;
