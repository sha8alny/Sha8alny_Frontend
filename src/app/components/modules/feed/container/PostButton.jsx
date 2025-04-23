import DialogMod from "@/app/components/ui/DialogMod";
import { fetchUserConnections } from "@/app/services/userProfile";
import { createPost } from "@/app/services/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import PostButtonPresentation from "../presentation/PostButtonPresentation";
import { useToast } from "@/app/context/ToastContext";
import { updateSessionTime } from "@/app/utils/sessionTime";

export default function PostButton({ userInfo }) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const [taggedUser, setTaggedUser] = useState("");
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState(null);
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);
  const [currentState, setCurrentState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);
  const [taggedUserPopoverOpen, setTaggedUserPopoverOpen] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);
  

  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: usersFound } = useQuery({
    queryKey: ["tagusers", taggedUser],
    queryFn: () => fetchUserConnections(taggedUser),
    enabled: !!taggedUser,
  });

  useEffect(() => {
    if (usersFound) {
      setSearchResults(usersFound);
    }
  }, [usersFound]);

  const handlePostMutation = useMutation({
    mutationFn: (formData) => createPost(formData),
    onSuccess: () => {
      setCurrentState(2);
      setText("");
      setImages([]);
      setVideos(null);
      setError(null);
      setTaggedUsers([]);
      setTags([]);
      setTaggedUser("");
      setTag("");
      toast("Post created successfully!");
      setTimeout(() => {
        setIsLoading(false);
        setOpen(false);
        setCurrentState(0);
      }, 2000);
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    },
    onError: () => {
      setCurrentState(3);
      setText("");
      setImages([]);
      setError(null);
      setVideos(null);
      setTaggedUsers([]);
      setTags([]);
      setTaggedUser("");
      setTag("");
      toast("Error creating post. Please try again.", false);
      setIsLoading(false);
      setTimeout(() => {
        setOpen(false);
        setCurrentState(0);
      }, 2000);
    },
  });

  const handlePost = () => {
    if (text.trim() === "") {
      setError("Please add text to your post.");
      return;
    }
    if (text.length > 1000) {
      setError("Post is too long. Please keep it under 1000 characters.");
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
    formData.append("tags", taggedUsers);
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
    console.log(formData);
    handlePostMutation.mutate(formData);
  };

  const handleAddMedia = (media) => {
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_IMAGE_COUNT = 20; // 20 images
    const MAX_VIDEO_COUNT = 1; // 1 video

    if (media.size > MAX_SIZE) {
      setError(
        `File too large. Please keep files under ${MAX_SIZE / (1024 * 1024)}MB.`
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
      if (images.length > MAX_IMAGE_COUNT) {
        setError(
          `You can only upload ${MAX_IMAGE_COUNT} image(s) at a time. Please remove the existing image(s) first.`
        );
        return;
      }

      if (videos) {
        setError(
          "You can only upload one type of media at a time. Please remove videos first."
        );
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
      if (videos) {
        setError(
          `You can only upload ${MAX_VIDEO_COUNT} video(s) at a time. Please remove the existing video(s) first.`
        );
        return;
      }

      if (images.length > 0) {
        setError(
          "You can only upload one type of media at a time. Please remove images first."
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
  };

  const handleRemoveMedia = (index) => {
    if (images.length > 0) {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else if (videos) {
      setVideos(null);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      const trimmedTag = tag.trim().replace(/,/g, "");
      if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags((prev) => [...prev, tag]);
        setTag("");
      }
    }
  };

  const handleAddDocument = (file) => {
    const supportedDocumentTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (file && supportedDocumentTypes.includes(file.type)) {
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB
      if (file.size > MAX_SIZE) {
        setError("File too large. Please keep files under 10MB.");
        return;
      }
      setError(null);
      setDocument(file);
    } else {
      setError("Unsupported document format. Please use PDF, DOC or DOCX.");
    }
  };

  const handleRemoveDocument = () => {
    setDocument(null);
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleAddTaggedUser = () => {
    if (taggedUser && !taggedUsers.includes(taggedUser)) {
      setTaggedUsers((prev) => [...prev, taggedUser]);
      setTaggedUser("");
    }
  };

  const handleRemoveTaggedUser = (index) => {
    setTaggedUsers((prev) => prev.filter((_, i) => i !== index));
  };

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
          onAddMedia={handleAddMedia}
          onRemoveMedia={handleRemoveMedia}
          images={images}
          videos={videos}
          error={error}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          tags={tags}
          setTags={setTags}
          taggedUser={taggedUser}
          setTaggedUser={setTaggedUser}
          taggedUsers={taggedUsers}
          onAddTaggedUser={handleAddTaggedUser}
          onRemoveTaggedUser={handleRemoveTaggedUser}
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          currentState={currentState}
          fileInputRef={fileInputRef}
          videoInputRef={videoInputRef}
          userInfo={userInfo}
          isLoading={isLoading}
          tagPopoverOpen={tagPopoverOpen}
          setTagPopoverOpen={setTagPopoverOpen}
          taggedUserPopoverOpen={taggedUserPopoverOpen}
          setTaggedUserPopoverOpen={setTaggedUserPopoverOpen}
          tagInput={tag}
          setTagInput={setTag}
          onAddDocument={handleAddDocument}
          onRemoveDocument={handleRemoveDocument}
          document={document}
          documentInputRef={documentInputRef}
        />
      }
    />
  );
}
