import { Separator } from "@/app/components/ui/Separator";
import { Textarea } from "@/app/components/ui/Textarea";
import Image from "next/image";
import { MapPin, Smile, UserPlus, Video } from "lucide-react";
import {
  AccessTimeOutlined,
  ImageOutlined,
  LocalOfferOutlined,
  PersonAddOutlined,
  VideocamOutlined,
} from "@mui/icons-material";
import { Button } from "@/app/components/ui/Button";

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
          <h4 className="text-primary font-bold">{userInfo?.name}</h4>
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-yellow-500 cursor-pointer"
            >
                <LocalOfferOutlined sx={{ fontSize: "1rem" }} />
            </Button>
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
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        <Button
          variant="ghost"
          className="w-full mt-2 h-12 cursor-pointer rounded-full dark:text-primary bg-secondary hover:bg-secondary/70 dark:hover:bg-secondary/70 dark:hover:text-primary text-background font-bold"
          onClick={onPost}
        >
          Post
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        multiple
        onChange={onAddMedia}
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={onAddMedia}
      />
    </div>
  );
}
