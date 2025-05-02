import React from "react";
import { Separator } from "@/app/components/ui/Separator";
import {
  AccessTimeOutlined,
  ImageOutlined,
  LocalOfferOutlined,
  PersonAddOutlined,
  VideocamOutlined,
  DescriptionOutlined,
} from "@mui/icons-material";
import { Button } from "@/app/components/ui/Button";
import { XIcon } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/Avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/Popover";
import { Badge } from "@/app/components/ui/Badge";
import { Calendar } from "@/app/components/ui/Calendar2";
import { format } from "date-fns";
import { Search } from "lucide-react";

export default function PostButtonPresentation({
  text,
  setText,
  onPost,
  onRemoveMedia,
  onRemoveDocument,
  onImageInputChange,
  onVideoInputChange,
  onDocumentInputChange,
  tagInput,
  setTagInput,
  onAddTagKeyDown,
  onAddTagClick,
  onRemoveTag,
  tags,
  taggedUser,
  setTaggedUser,
  taggedUsers,
  onAddTaggedUser,
  onRemoveTaggedUser,
  searchResults,
  setSearchResults,
  fileInputRef,
  videoInputRef,
  documentInputRef,
  userInfo,
  isLoading,
  error,
  tagPopoverOpen,
  setTagPopoverOpen,
  taggedUserPopoverOpen,
  setTaggedUserPopoverOpen,
  imagePreviews,
  videoPreview,
  documentPreview,
  scheduledDate,
  setScheduledDate,
  scheduledTime,
  setScheduledTime,
  schedulePopoverOpen,
  setSchedulePopoverOpen,
  handleUserSearch,
  handleTagUserClick,
}) {
  return (
    <div
      className="flex flex-col gap-2 w-full"
      data-testid="post-button-presentation"
    >
      <div className="flex items-center gap-2">
        <div className="relative size-10 bg-gray-700 rounded-full">
          <Avatar className="size-10" data-testid="user-avatar">
            <AvatarImage src={userInfo?.profilePicture} alt={userInfo?.name} />
            <AvatarFallback>
              {userInfo?.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <h4
            className="text-primary text-start font-bold"
            data-testid="user-name"
          >
            {userInfo?.name}
          </h4>
          <p className="text-sm text-muted" data-testid="user-headline">
            {userInfo?.headline}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2 text-primary">
        <textarea
          className="resize-none h-20 w-full border-0 bg-foreground text-primary rounded-lg p-2 focus:outline-none focus:ring-0"
          placeholder="What do you want to talk about?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          data-testid="post-textarea"
        />
        <div className="flex gap-2 flex-wrap" data-testid="media-previews">
          {imagePreviews}
          {videoPreview}
          {documentPreview}
        </div>
        {(tags.length > 0 || taggedUsers.length > 0) && (
          <div
            className="mt-4 flex flex-wrap gap-2"
            data-testid="tags-and-users-container"
          >
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-2xl text-background dark:text-primary"
                data-testid={`tag-${tag}`}
              >
                <span className="text-background dark:text-primary/80 self-center font-semibold text-xs flex items-center">
                  #{tag}
                </span>
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="px-1 py-1 rounded-full hover:bg-background/20 duration-200 cursor-pointer ml-1"
                  data-testid={`remove-tag-${tag}`}
                >
                  <XIcon className="size-3" />
                </button>
              </Badge>
            ))}
            {taggedUsers.map((user) => (
              <Badge
                key={user?._id}
                className="flex items-center gap-1 px-2 py-1 bg-secondary/10 rounded-2xl text-primary font-semibold"
                data-testid={`tagged-user-${user?._id}`}
              >
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="hover:underline cursor-pointer">
                  {user?.name}
                </span>
                <button
                  onClick={() => onRemoveTaggedUser(user?._id)}
                  className="h-4 w-4 rounded-full hover:bg-primary/20 duration-200 cursor-pointer flex items-center justify-center ml-1"
                  data-testid={`remove-tagged-user-${user?._id}`}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {scheduledDate && scheduledTime && (
          <div className="mt-2">
            <Badge
              variant="outline"
              className="bg-secondary/90 font-semibold dark:text-background flex items-center gap-1"
            >
              <AccessTimeOutlined sx={{ fontSize: "0.8rem" }} />
              Scheduled for {format(scheduledDate, "MMMM d, yyyy")} at{" "}
              {format(new Date(`1970-01-01T${scheduledTime}:00`), "hh:mm a")}
              <button
                onClick={() => {
                  setScheduledDate(null);
                  setScheduledTime("");
                }}
                className="h-4 w-4 rounded-full hover:bg-primary/20 duration-200 cursor-pointer flex items-center justify-center ml-1"
                data-testid="remove-scheduled-time"
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          </div>
        )}
        <Separator />
        <div className="flex gap-2 mt-4 justify-between items-center">
          <span className="text-sm font-semibold">Add to your post</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-green-500 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              data-testid="add-image-button"
            >
              <ImageOutlined sx={{ fontSize: "1rem" }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-blue-500 cursor-pointer"
              onClick={() => videoInputRef.current?.click()}
              data-testid="add-video-button"
            >
              <VideocamOutlined sx={{ fontSize: "1rem" }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-orange-500 cursor-pointer"
              onClick={() => documentInputRef.current?.click()}
              data-testid="add-document-button"
            >
              <DescriptionOutlined sx={{ fontSize: "1rem" }} />
            </Button>
            <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-yellow-500 cursor-pointer"
                  data-testid="add-tag-popover-trigger"
                >
                  <LocalOfferOutlined sx={{ fontSize: "1rem" }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-3 pointer-events-auto"
                align="start"
                data-testid="add-tag-popover-content"
              >
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    Add tags to your post
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={onAddTagKeyDown}
                      className="flex-1 h-9 px-3 rounded-md border border-input bg-transparent text-sm ring-offset-background"
                      placeholder="Add a tag..."
                      data-testid="tag-input"
                    />
                    <Button
                      size="sm"
                      disabled={!tagInput.trim()}
                      onClick={onAddTagClick}
                      data-testid="add-tag-button"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover
              open={schedulePopoverOpen}
              onOpenChange={setSchedulePopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-red-500 cursor-pointer"
                  data-testid="schedule-post-button"
                >
                  <AccessTimeOutlined sx={{ fontSize: "1rem" }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-3 pointer-events-auto"
                align="end"
                data-testid="schedule-popover-content"
              >
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Schedule your post</h4>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className="text-xs text-muted mb-2">Select date</p>
                      <Calendar
                        mode="single"
                        selected={scheduledDate}
                        onSelect={setScheduledDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-2">Select time</p>
                      <input
                        type="time"
                        className="w-full h-9 px-3 rounded-md border border-input bg-transparent text-sm mb-4"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        data-testid="schedule-time-input"
                      />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover
              open={taggedUserPopoverOpen}
              onOpenChange={setTaggedUserPopoverOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-purple-500 cursor-pointer"
                  data-testid="tag-user-button"
                >
                  <PersonAddOutlined sx={{ fontSize: "1rem" }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-3 pointer-events-auto"
                align="start"
                data-testid="tag-user-popover-content"
              >
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    Tag people in your post
                  </h4>
                  <div className="flex items-center gap-2 border rounded-md px-3 py-2">
                    <Search className="h-4 w-4 text-muted" />
                    <input
                      type="text"
                      value={taggedUser}
                      onChange={(e) => {
                        setTaggedUser(e.target.value);
                        handleUserSearch(e.target.value);
                      }}
                      className="flex-1 border-none bg-transparent text-sm focus:outline-none"
                      placeholder="Search for people..."
                      data-testid="tag-user-search"
                    />
                  </div>
                  {/* Skeleton loading state */}
                  {taggedUser &&
                    taggedUser.length > 1 &&
                    searchResults.length === 0 && (
                      <div
                        className="mt-2 max-h-60 overflow-y-auto space-y-2"
                        data-testid="user-search-skeleton"
                      >
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 p-2 rounded-md animate-pulse"
                          >
                            <div className="h-8 w-8 rounded-full bg-secondary/30"></div>
                            <div className="flex flex-col space-y-1.5 flex-1">
                              <div className="h-3 bg-secondary/30 rounded w-24"></div>
                              <div className="h-2 bg-secondary/20 rounded w-40"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  {/* Search results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-60 overflow-y-auto">
                      {searchResults.map((user) => (
                        <div
                          key={user._id}
                          className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md cursor-pointer transition-colors"
                          onClick={() => handleTagUserClick(user)}
                          data-testid={`user-search-result-${user._id}`}
                        >
                          <Avatar className="h-8 w-8 ring-1 ring-secondary/10">
                            <AvatarImage
                              src={user.profilePicture}
                              alt={user.name}
                            />
                            <AvatarFallback className="text-xs bg-secondary/5">
                              {user.name?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">
                              {user.name}
                            </span>
                            {user.headline && (
                              <span className="text-xs text-muted truncate max-w-[180px]">
                                {user.headline}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* No results state - only show when there was an attempt to search */}
                  {taggedUser &&
                    taggedUser.length > 2 &&
                    searchResults.length === 0 && (
                      <div className="mt-2 p-3 text-center border rounded-md bg-muted/10">
                        <p className="text-xs text-muted mb-1">
                          No users found
                        </p>
                        <p className="text-[11px] text-muted">
                          Try a different search term
                        </p>
                      </div>
                    )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm" data-testid="error-message">
            {error}
          </p>
        )}
        <Button
          variant="ghost"
          disabled={isLoading}
          className="w-full mt-2 h-12 cursor-pointer rounded-2xl bg-secondary hover:bg-secondary/90 hover:text-background dark:hover:bg-secondary/90 dark:hover:text-background text-background font-bold"
          onClick={onPost}
          data-testid="post-submit-button"
        >
          {isLoading ? "Posting..." : "Post"}
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={onImageInputChange}
        data-testid="image-input"
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={onVideoInputChange}
        data-testid="video-input"
      />
      <input
        type="file"
        ref={documentInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={onDocumentInputChange}
        data-testid="document-input"
      />
    </div>
  );
}
