import {
  Search,
  PersonOff,
  MoreHoriz,
  Close,
  ArrowBack,
} from "@mui/icons-material";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/app/components/ui/Avatar";
import { Button } from "@/app/components/ui/Button";
import { Briefcase, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/Dialog";
const BlockedUserItem = ({ user, onUnblockClick, navigateToProfile }) => {
  return (
    <div
      onClick={() => navigateToProfile(user?.username)}
      className="bg-foreground text-text dark:border-gray-500 hover:bg-hover p-3 py-3 cursor-pointer duration-200 rounded-xl"
    >
      <div className="flex items-start gap-3 rounded-lg ">
        <Avatar className="w-10 h-10 cursor-pointer">
          <AvatarImage src={user.profilePicture} alt={user.name} />
          <AvatarFallback>
            {user.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3
              className="text-sm font-medium cursor-pointer hover:underline"
              onClick={() => navigateToProfile(user?.username)}
            >
              {user.name}
            </h3>
          </div>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <Briefcase className="h-3 w-3" /> {user.headline}
          </p>
          <p className="text-gray-400 text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" /> {user.location}
          </p>
        </div>
        <Button
          size="sm"
          className="rounded-full text-xs h-7 px-3 bg-secondary text-background hover:bg-secondary/80 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onUnblockClick(user.id);
          }}
        >
          {" "}
          Unblock
        </Button>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="p-4 border border-gray-500 dark:border-gray-200 rounded-lg"
        >
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-500 dark:bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-500 dark:bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-500 dark:bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-500 dark:bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex items-center">
              <div className="h-8 bg-gray-500 dark:bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center py-16 border-2 border-dashed border-gray-400 dark:border-gray-200 rounded-lg">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <PersonOff fontSize="large" className="text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-text mb-2">No blocked users</h3>
      <p className="text-gray-500 max-w-md mx-auto">
        When you block someone, they'll appear here. Blocked users cannot view
        your profile or connect with you.
      </p>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, name }) => {
  if (!isOpen) return null;

  return (
    <Dialog
      className="text-text"
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-text">Unblock {name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to unblock {name}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-6">
          <Button
            className="text-text cursor-pointer"
            variant="outline"
            onClick={onClose}
          >
            Keep Blocked
          </Button>
          <Button
            className="cursor-pointer bg-red-700 font-semibold hover:bg-red-700/70 dark:bg-red-400 dark:hover:bg-red-300"
            onClick={onConfirm}
          >
            Yes, I am sure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const BlockedUsersPresentation = ({
  blockedUsers,
  isLoading,
  isError,
  searchTerm,
  onSearchChange,
  onUnblockClick,
  onBackClick,
  isModalOpen,
  userToUnblock,
  closeModal,
  confirmUnblock,
  navigateToProfile,
}) => {
  return (
    <div className="p-6 bg-background text-text border border-gray-200 rounded-lg shadow">
      <div className="flex flex-row  mb-6">
        <button
          onClick={onBackClick}
          className="mb-3 sm:mb-0 sm:mr-3 p-2 rounded-full cursor-pointer"
          aria-label="Go back"
        >
          <ArrowBack />
        </button>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-2xl font-bold text-text text-center sm:text-left">
              Manage blocked users
            </h1>
          </div>
          <div className="text-sm text-gray-500 text-center sm:text-right mt-2 sm:mt-0">
            {blockedUsers.length} {blockedUsers.length === 1 ? "user" : "users"}{" "}
            blocked
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search fontSize="small" className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search blocked users"
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <div className="text-center py-8 text-red-500">
          Error loading blocked users. Please try again.
        </div>
      ) : blockedUsers.length > 0 ? (
        <div className="space-y-4">
          {blockedUsers.map((user) => (
            <BlockedUserItem
              key={user.id}
              user={user}
              onUnblockClick={onUnblockClick}
              navigateToProfile={navigateToProfile}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmUnblock}
        name={userToUnblock?.name || ""}
      />
    </div>
  );
};

export default BlockedUsersPresentation;
