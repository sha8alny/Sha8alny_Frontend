import { Separator } from "@/app/components/ui/Separator";
import Image from "next/image";
import {
  AccessTimeOutlined,
  ImageOutlined,
  LocalOfferOutlined,
  PersonAddOutlined,
  VideocamOutlined,
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
  onAddMedia,
  onRemoveMedia,
  images,
  videos,
  error,
  onAddTag,
  onRemoveTag,
  tags,
  setTags,
  taggedUser,
  setTaggedUser,
  taggedUsers,
  onAddTaggedUser,
  onRemoveTaggedUser,
  searchResults,
  setSearchResults,
  currentState,
  fileInputRef,
  videoInputRef,
  userInfo,
  isLoading,
  tagPopoverOpen,
  setTagPopoverOpen,
  taggedUserPopoverOpen,
  setTaggedUserPopoverOpen,
  tagInput,
  setTagInput,
}) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center gap-2">
        <div className="relative size-10 bg-gray-700 rounded-full">
          <Image
            src={userInfo?.profilePicture}
            fill
            alt="User Avatar"
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <h4 className="text-primary text-start font-bold">{userInfo?.name}</h4>
          <p className="text-sm text-muted">{userInfo?.headline}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2 text-primary">
        <textarea
          className="resize-none h-20 w-full border-0 bg-foreground text-primary rounded-lg p-2 focus:outline-none focus:ring-0"
          placeholder="What do you want to talk about?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {/* Media Preview */}
        <div className="flex gap-2 flex-wrap">
          {images?.map((image, index) => (
            <div
              key={index}
              className="relative size-12 bg-gray-700 rounded-lg"
            >
              <Image
                src={URL.createObjectURL(image)}
                fill
                alt="Media Preview"
                className="rounded-lg object-cover"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-foreground text-primary hover:bg-foreground/80 dark:hover:bg-foreground/80 cursor-pointer"
                onClick={() => onRemoveMedia(index, "image")}
              >
                &times;
              </Button>
            </div>
          ))}
          {/* For single video file */}
          {videos && (
            <div className="relative w-24 min-h-24 bg-gray-700 rounded-lg mb-4">
              <video
                src={URL.createObjectURL(videos)}
                controls
                className="rounded-lg"
              ></video>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6 rounded-full bg-foreground text-primary hover:bg-foreground/80 dark:hover:bg-foreground/80 cursor-pointer"
                onClick={() => onRemoveMedia(0, "video")}
              >
                &times;
              </Button>
            </div>
          )}
        </div>
        {/* Display tags and tagged users if any */}
        {(tags.length > 0 || taggedUsers.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div
                key={tag}
                className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-2xl text-background dark:text-primary"
              >
                <span className="text-background dark:text-primary font-semibold text-xs flex items-center">
                  #{tag}
                </span>

                <button
                  onClick={() => onRemoveTag(tag)}
                  className="px-1 py-1 rounded-full hover:bg-background/20 duration-200 cursor-pointer ml-1"
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
              >
                <Avatar className="h-5 w-5 mr-1">
                  <AvatarImage src={user?.profilePicture} alt={user?.fullName} />
                  <AvatarFallback>{user?.fullName?.substring(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                {user?.fullName}
                <button
                  onClick={() => onRemoveTaggedUser(user?._id)}
                  className="h-4 w-4 rounded-full hover:bg-primary/20 duration-200 cursor-pointer flex items-center justify-center ml-1"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}
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
              onClick={() => {
                fileInputRef.current?.click();
              }}
            >
              <ImageOutlined sx={{ fontSize: "1rem" }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-blue-500 cursor-pointer"
              onClick={() => {
                videoInputRef.current?.click();
              }}
            >
              <VideocamOutlined sx={{ fontSize: "1rem" }} />
            </Button>

            {/* Tag popover */}
            <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-yellow-500 cursor-pointer"
                >
                  <LocalOfferOutlined sx={{ fontSize: "1rem" }} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-3" align="start">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    Add tags to your post
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={onAddTag}
                      className="flex-1 h-9 px-3 rounded-md border border-input bg-transparent text-sm ring-offset-background"
                      placeholder="Add a tag..."
                    />
                    <Button
                      size="sm"
                      disabled={!tagInput.trim()}
                      onClick={() => {
                        if (
                          tagInput.trim() &&
                          !tags.includes(tagInput.trim())
                        ) {
                          setTags([...tags, tagInput.trim()]);
                          setTagInput("");
                        }
                      }}
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
            >
              <AccessTimeOutlined sx={{ fontSize: "1rem" }} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-purple-500 cursor-pointer"
            >
              <PersonAddOutlined sx={{ fontSize: "1rem" }} />
            </Button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          variant="ghost"
          disabled={isLoading}
          className="w-full mt-2 h-12 cursor-pointer rounded-2xl bg-secondary hover:bg-secondary/90 hover:text-background dark:hover:bg-secondary/90 dark:hover:text-background text-background font-bold"
          onClick={onPost}
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
        onChange={(e) => {
          if (e.target.files.length > 0) {
            Array.from(e.target.files).forEach((file) => onAddMedia(file));
          }
        }}
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={(e) => {
          if (e.target.files.length > 0) {
            onAddMedia(e.target.files[0]);
          }
        }}
      />
    </div>
  );
}
