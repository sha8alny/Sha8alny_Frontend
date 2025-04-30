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
}) {
  return (
    <div className="flex flex-col gap-2 w-full" data-testid="post-btn-root">
      <div className="flex items-center gap-2" data-testid="post-btn-header">
        <div
          className="relative size-10 bg-gray-700 rounded-full"
          data-testid="post-btn-avatar-wrapper"
        >
          <Avatar className="size-10" data-testid="post-btn-avatar">
            <AvatarImage
              src={userInfo?.profilePicture}
              alt={userInfo?.name}
              data-testid="post-btn-avatar-img"
            />
            <AvatarFallback data-testid="post-btn-avatar-fallback">
              {userInfo?.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col" data-testid="post-btn-userinfo">
          <h4
            className="text-primary text-start font-bold"
            data-testid="post-btn-username"
          >
            {userInfo?.name}
          </h4>
          <p className="text-sm text-muted" data-testid="post-btn-headline">
            {userInfo?.headline}
          </p>
        </div>
      </div>
      <div
        className="flex flex-col gap-2 mt-2 text-primary"
        data-testid="post-btn-body"
      >
        <textarea
          className="resize-none h-20 w-full border-0 bg-foreground text-primary rounded-lg p-2 focus:outline-none focus:ring-0"
          placeholder="What do you want to talk about?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          data-testid="post-btn-textarea"
        />
        <div
          className="flex gap-2 flex-wrap"
          data-testid="post-btn-media-preview"
        >
          {imagePreviews}
          {videoPreview}
          {documentPreview}
        </div>
        {(tags.length > 0 || taggedUsers.length > 0) && (
          <div
            className="mt-4 flex flex-wrap gap-2"
            data-testid="post-btn-tags-users"
          >
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-2xl text-background dark:text-primary"
                data-testid={`post-btn-tag-${tag}`}
              >
                <span className="text-background dark:text-primary font-semibold text-xs flex items-center">
                  #{tag}
                </span>
                <button
                  onClick={() => onRemoveTag(tag)}
                  className="px-1 py-1 rounded-full hover:bg-background/20 duration-200 cursor-pointer ml-1"
                  data-testid={`post-btn-tag-remove-${tag}`}
                >
                  <XIcon className="size-3" />
                </button>
              </div>
            ))}
            {taggedUsers.map((user) => (
              <Badge
                key={user?._id}
                variant="outline"
                className="flex items-center gap-1 px-2 py-1 bg-muted/50"
                data-testid={`post-btn-tagged-user-${user?._id}`}
              >
                <Avatar
                  className="h-5 w-5 mr-1"
                  data-testid="post-btn-tagged-user-avatar"
                >
                  <AvatarImage
                    src={user?.profilePicture}
                    alt={user?.fullName}
                    data-testid="post-btn-tagged-user-avatar-img"
                  />
                  <AvatarFallback data-testid="post-btn-tagged-user-avatar-fallback">
                    {user?.fullName?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {user?.fullName}
                <button
                  onClick={() => onRemoveTaggedUser(user?._id)}
                  className="h-4 w-4 rounded-full hover:bg-primary/20 duration-200 cursor-pointer flex items-center justify-center ml-1"
                  data-testid={`post-btn-tagged-user-remove-${user?._id}`}
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <Separator data-testid="post-btn-separator" />
        <div
          className="flex gap-2 mt-4 justify-between items-center"
          data-testid="post-btn-toolbar"
        >
          <span
            className="text-sm font-semibold"
            data-testid="post-btn-toolbar-label"
          >
            Add to your post
          </span>
          <div className="flex gap-2" data-testid="post-btn-toolbar-btns">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-green-500 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              data-testid="post-btn-image-btn"
            >
              <ImageOutlined sx={{ fontSize: "1rem" }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-blue-500 cursor-pointer"
              onClick={() => videoInputRef.current?.click()}
              data-testid="post-btn-video-btn"
            >
              <VideocamOutlined sx={{ fontSize: "1rem" }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-orange-500 cursor-pointer"
              onClick={() => documentInputRef.current?.click()}
              data-testid="post-btn-document-btn"
            >
              <DescriptionOutlined sx={{ fontSize: "1rem" }} />
            </Button>
            <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-yellow-500 cursor-pointer"
                  data-testid="post-btn-tag-popover-btn"
                >
                  <LocalOfferOutlined sx={{ fontSize: "1rem" }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-3"
                align="start"
                data-testid="post-btn-tag-popover-content"
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
                      data-testid="post-btn-tag-input"
                    />
                    <Button
                      size="sm"
                      disabled={!tagInput.trim()}
                      onClick={onAddTagClick}
                      data-testid="post-btn-tag-add-btn"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-red-500 cursor-pointer"
              data-testid="post-btn-schedule-btn"
            >
              <AccessTimeOutlined sx={{ fontSize: "1rem" }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-purple-500 cursor-pointer"
              data-testid="post-btn-tag-user-btn"
            >
              <PersonAddOutlined sx={{ fontSize: "1rem" }} />
            </Button>
          </div>
        </div>
        {error && (
          <p className="text-red-500 text-sm" data-testid="post-btn-error">
            {error}
          </p>
        )}
        <Button
          variant="ghost"
          disabled={isLoading}
          className="w-full mt-2 h-12 cursor-pointer rounded-2xl bg-secondary hover:bg-secondary/90 hover:text-background dark:hover:bg-secondary/90 dark:hover:text-background text-background font-bold"
          onClick={onPost}
          data-testid="post-btn-submit"
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
        data-testid="post-btn-image-input"
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={onVideoInputChange}
        data-testid="post-btn-video-input"
      />
      <input
        type="file"
        ref={documentInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={onDocumentInputChange}
        data-testid="post-btn-document-input"
      />
    </div>
  );
}
