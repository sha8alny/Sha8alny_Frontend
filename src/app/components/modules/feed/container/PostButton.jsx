import DialogMod from "@/app/components/ui/DialogMod";
import { fetchUserConnections } from "@/app/services/userProfile";
import { createPost, getTags } from "@/app/services/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import PostButtonPresentation from "../presentation/PostButtonPresentation";
import { useToast } from "@/app/context/ToastContext";
import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import { XIcon } from "lucide-react";
import { DescriptionOutlined } from "@mui/icons-material";

export default function PostButton({ userInfo }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [taggedUser, setTaggedUser] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState(null);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);
  const [taggedUserPopoverOpen, setTaggedUserPopoverOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState("");
  const [schedulePopoverOpen, setSchedulePopoverOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  const toast = useToast();
  const queryClient = useQueryClient();

  const handlePostMutation = useMutation({
    mutationFn: (formData) => createPost(formData),
    onSuccess: (response) => {
      if (!scheduledDate && !scheduledTime) {
        const newPostData = {
          postId: response.postId,
          text: text,
          keywords: tags,
          media: response.media,
          username: userInfo.username,
          profilePicture: userInfo.profilePicture,
          fullName: userInfo.name,
          headline: userInfo.headline,
          time: new Date().toISOString(),
          tags: taggedUsers.map((user) => ({
            username: user.username,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
          })),
          numLikes: 0,
          numCelebrates: 0,
          numLoves: 0,
          numSupports: 0,
          numFunnies: 0,
          numInsightfuls: 0,
          numComments: 0,
          numShares: 0,
          isSaved: false,
          connectionDegree: 0,
          isCompany: false,
          reaction: null,
        };

        queryClient.setQueryData(["posts"], (oldData) => {
          if (!oldData) return { pages: [[newPostData]], pageParams: [null] };

          return {
            ...oldData,
            pages: [
              Array.isArray(oldData.pages[0])
                ? [newPostData, ...oldData.pages[0]]
                : oldData.pages[0],
              ...oldData.pages.slice(1),
            ],
          };
        });
      }
      setText("");
      setImages([]);
      setVideos(null);
      setError(null);
      setTaggedUsers([]);
      setTags([]);
      setTaggedUser("");
      setDocument(null);
      setTagInput("");
      setScheduledDate(null);
      setScheduledTime("");
      toast("Post created successfully!");
      setIsLoading(false);
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error mutation:", error);

      setText("");
      setImages([]);
      setError(null);
      setVideos(null);
      setTaggedUsers([]);
      setDocument(null);
      setTags([]);
      setTaggedUser("");
      setTagInput("");
      setScheduledDate(null);
      setScheduledTime("");
      toast("Error creating post. Please try again.", false);
      setIsLoading(false);
      setTimeout(() => {
        setOpen(false);
      }, 2000);
    },
  });

  const handlePost = useCallback(() => {
    if (text.trim() === "" && images.length === 0 && !videos && !document) {
      setError("Please add text or media to your post.");
      return;
    }
    if (text.length > 1000) {
      setError("Post text is too long. Please keep it under 1000 characters.");
      return;
    }
    setError(null);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("text", text);
    if (tags.length > 0) {
      tags.forEach((tag) => {
        formData.append("keywords", tag);
      });
    }
    if (taggedUsers.length > 0) {
      taggedUsers.forEach((user) => {
        formData.append("tags", user._id);
      });
    }
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("media", image);
      });
    }
    if (videos) {
      formData.append("media", videos);
    }
    if (document) {
      formData.append("media", document);
    }
    if (scheduledDate && scheduledTime) {
      const scheduledDateTime = new Date(scheduledDate);
      const [hours, minutes] = scheduledTime.split(":");
      scheduledDateTime.setHours(
        parseInt(hours, 10),
        parseInt(minutes, 10),
        0,
        0
      );
      formData.append("scheduledTime", scheduledDateTime.toISOString());
    }
    handlePostMutation.mutate(formData);
  }, [
    text,
    tags,
    taggedUsers,
    images,
    videos,
    document,
    scheduledDate,
    scheduledTime,
    handlePostMutation,
  ]);

  const handleAddMedia = useCallback(
    (media) => {
      const MAX_SIZE = 50 * 1024 * 1024;
      const MAX_IMAGE_COUNT = 20;
      const MAX_VIDEO_COUNT = 1;

      if (media.size > MAX_SIZE) {
        setError(
          `File too large. Please keep files under ${
            MAX_SIZE / (1024 * 1024)
          }MB.`
        );
        return;
      }

      if (media.type.startsWith("image/")) {
        const supportedImageTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!supportedImageTypes.includes(media.type)) {
          setError(
            "Unsupported image format. Please use JPEG, PNG, GIF or WebP."
          );
          return;
        }
        if (videos || document) {
          setError(
            "You can only upload one type of media (images, video, or document) at a time. Please remove other media first."
          );
          return;
        }
        if (images.length >= MAX_IMAGE_COUNT) {
          setError(`You can upload a maximum of ${MAX_IMAGE_COUNT} images.`);
          return;
        }
        setImages((prev) => [...prev, media]);
        setError(null);
      } else if (media.type.startsWith("video/")) {
        const supportedVideoTypes = ["video/mp4", "video/webm"];
        if (!supportedVideoTypes.includes(media.type)) {
          setError("Unsupported video format. Please use MP4 or WebM.");
          return;
        }
        if (images.length > 0 || document) {
          setError(
            "You can only upload one type of media (images, video, or document) at a time. Please remove other media first."
          );
          return;
        }
        if (videos) {
          setError(
            `You can only upload ${MAX_VIDEO_COUNT} video. Please remove the existing video first.`
          );
          return;
        }
        setVideos(media);
        setError(null);
      } else {
        setError(
          "Unsupported media type. Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, WebM)."
        );
      }
    },
    [images, videos, document]
  );

  const handleRemoveMedia = useCallback((index, type) => {
    if (type === "image") {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else if (type === "video") {
      setVideos(null);
    }
  }, []);

  const handleAddDocument = useCallback(
    (file) => {
      const supportedDocumentTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (images.length > 0 || videos) {
        setError(
          "You can only upload one type of media (images, video, or document) at a time. Please remove other media first."
        );
        return;
      }
      if (document) {
        setError(
          "You can only upload one document at a time. Please remove the existing document first."
        );
        return;
      }

      if (file && supportedDocumentTypes.includes(file.type)) {
        const MAX_SIZE = 50 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
          setError("File too large. Please keep files under 10MB.");
          return;
        }
        setError(null);
        setDocument(file);
      } else {
        setError("Unsupported document format. Please use PDF, DOC or DOCX.");
      }
    },
    [images, videos, document]
  );

  const handleRemoveDocument = useCallback(() => {
    setDocument(null);
  }, []);

  const handleImageInputChange = useCallback(
    (e) => {
      if (e.target.files?.length > 0) {
        Array.from(e.target.files).forEach((file) => handleAddMedia(file));
        e.target.value = null;
      }
    },
    [handleAddMedia]
  );

  const handleVideoInputChange = useCallback(
    (e) => {
      if (e.target.files?.length > 0) {
        handleAddMedia(e.target.files[0]);
        e.target.value = null;
      }
    },
    [handleAddMedia]
  );

  const handleDocumentInputChange = useCallback(
    (e) => {
      if (e.target.files?.length > 0) {
        handleAddDocument(e.target.files[0]);
        e.target.value = null;
      }
    },
    [handleAddDocument]
  );

  const handleAddTagKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " " || e.key === ",") {
        e.preventDefault();
        const trimmedTag = tagInput.trim().replace(/,/g, "");
        if (trimmedTag && !tags.includes(trimmedTag)) {
          if (trimmedTag.length > 20) {
            setError("Tag is too long. Please keep it under 20 characters.");
            return;
          }
          if (tags.length >= 10) {
            setError("You can add a maximum of 10 tags.");
            return;
          }
          setTags((prev) => [...prev, trimmedTag]);
          setTagInput("");
        } else if (!trimmedTag) {
          setTagInput("");
        }
      }
    },
    [tagInput, tags]
  );

  const handleAddTagClick = useCallback(() => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      if (trimmedTag.length > 20) {
        setError("Tag is too long. Please keep it under 20 characters.");
        return;
      }
      if (tags.length >= 10) {
        setError("You can add a maximum of 10 tags.");
        return;
      }
      setTags((prev) => [...prev, trimmedTag]);
      setTagInput("");
    } else if (!trimmedTag) {
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setTags((prevTags) => prevTags.filter((t) => t !== tagToRemove));
  }, []);

  const handleAddTaggedUser = useCallback(() => {
    if (
      taggedUser &&
      !taggedUsers.some((user) => user._id === taggedUser._id)
    ) {
      if (taggedUsers.length >= 5) {
        setError("You can tag a maximum of 5 users.");
        return;
      }
      setTaggedUsers((prev) => [...prev, taggedUser]);
      setTaggedUser("");
      setSearchResults([]);
      setTaggedUserPopoverOpen(false);
    }
  }, [taggedUser, taggedUsers]);

  const handleRemoveTaggedUser = useCallback((userIdToRemove) => {
    setTaggedUsers((prevUsers) =>
      prevUsers.filter((user) => user._id !== userIdToRemove)
    );
  }, []);

  const handleTagUserClick = useCallback(
    (user) => {
      if (taggedUsers.some((u) => u._id === user._id)) {
        return; // User already tagged
      }

      if (taggedUsers.length >= 5) {
        setError("You can tag a maximum of 5 users.");
        return;
      }

      setTaggedUsers((prev) => [...prev, user]);
      setTaggedUser("");
      setSearchResults([]);
      setTaggedUserPopoverOpen(false);
    },
    [taggedUsers]
  );

  const handleUserSearch = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await getTags(query);
      setSearchResults(results || []);
    } catch (error) {
      console.error("Error searching for users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const imagePreviews = useMemo(() => {
    return images?.map((image, index) => (
      <div
        key={`${image.name}-${index}-${image.lastModified}`}
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
          onClick={() => handleRemoveMedia(index, "image")}
        >
          &times;
        </Button>
      </div>
    ));
  }, [images, handleRemoveMedia]);

  const videoPreview = useMemo(() => {
    if (!videos) return null;
    const videoUrl = URL.createObjectURL(videos);
    return (
      <div className="relative w-24 min-h-24 bg-gray-700 rounded-lg mb-4">
        <video
          key={videos.name + videos.lastModified}
          src={videoUrl}
          controls
          className="rounded-lg w-full h-full object-cover aspect-video"
        ></video>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 rounded-full bg-foreground text-primary hover:bg-foreground/80 dark:hover:bg-foreground/80 cursor-pointer"
          onClick={() => handleRemoveMedia(0, "video")}
        >
          &times;
        </Button>
      </div>
    );
  }, [videos, handleRemoveMedia]);

  const documentPreview = useMemo(() => {
    if (!document) return null;
    return (
      <div className="relative w-full max-w-sm bg-primary/10 rounded-lg p-3 mb-4 flex items-center gap-3 border border-foreground/20">
        <div className="flex-shrink-0">
          <DescriptionOutlined className="text-secondary h-8 w-8" />
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-medium text-primary truncate">
            {document.name}
          </p>
          <p className="text-xs text-muted">
            {(document.size / 1024).toFixed(1)} KB •{" "}
            {document.name.split(".").pop().toUpperCase()}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-6 w-6 rounded-full bg-foreground text-primary hover:bg-foreground/80"
          onClick={handleRemoveDocument}
        >
          <XIcon className="h-3 w-3" />
        </Button>
      </div>
    );
  }, [document, handleRemoveDocument]);

  return (
    <DialogMod
      open={open}
      onOpenChange={setOpen}
      useRegularButton
      buttonClass="w-full shadow-md my-2 h-14 bg-secondary hover:bg-secondary/90 cursor-pointer ease-in-out duration-500 text-background border dark:border-[#111] rounded-2xl font-bold p-2"
      buttonData="Post"
      className="bg-foreground"
      AlertContent={
        <PostButtonPresentation
          text={text}
          setText={setText}
          onPost={handlePost}
          onRemoveMedia={handleRemoveMedia}
          images={images}
          videos={videos}
          document={document}
          onRemoveDocument={handleRemoveDocument}
          onImageInputChange={handleImageInputChange}
          onVideoInputChange={handleVideoInputChange}
          onDocumentInputChange={handleDocumentInputChange}
          tagInput={tagInput}
          setTagInput={setTagInput}
          onAddTagKeyDown={handleAddTagKeyDown}
          onAddTagClick={handleAddTagClick}
          onRemoveTag={handleRemoveTag}
          tags={tags}
          taggedUser={taggedUser}
          setTaggedUser={setTaggedUser}
          taggedUsers={taggedUsers}
          onAddTaggedUser={handleAddTaggedUser}
          onRemoveTaggedUser={handleRemoveTaggedUser}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          fileInputRef={fileInputRef}
          videoInputRef={videoInputRef}
          documentInputRef={documentInputRef}
          userInfo={userInfo}
          isLoading={isLoading}
          error={error}
          tagPopoverOpen={tagPopoverOpen}
          setTagPopoverOpen={setTagPopoverOpen}
          taggedUserPopoverOpen={taggedUserPopoverOpen}
          setTaggedUserPopoverOpen={setTaggedUserPopoverOpen}
          imagePreviews={imagePreviews}
          videoPreview={videoPreview}
          documentPreview={documentPreview}
          scheduledDate={scheduledDate}
          setScheduledDate={setScheduledDate}
          scheduledTime={scheduledTime}
          setScheduledTime={setScheduledTime}
          schedulePopoverOpen={schedulePopoverOpen}
          setSchedulePopoverOpen={setSchedulePopoverOpen}
          handleUserSearch={handleUserSearch}
          handleTagUserClick={handleTagUserClick}
          isSearching={isSearching}
        />
      }
    />
  );
}
