import DialogMod from "@/app/components/ui/DialogMod";
import { fetchUserConnections } from "@/app/services/getUserConnections";
import { createPost } from "@/app/services/post";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import PostButtonPresentation from "../presentation/PostButtonPresentation";

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
  const [error, setError] = useState(null);
  const [currentState, setCurrentState] = useState(0);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

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
      setTimeout(() => {
        setOpen(false);
        setCurrentState(0);
      }, 2000);
      queryClient.invalidateQueries(["posts"]);
    },
    onError: () => {
      setCurrentState(3);
      setText("");
      setImages([]);
      setError(null);
      setVideos(null);
      setTimeout(() => {
        setOpen(false);
        setCurrentState(0);
      }, 2000);
    },
  });

  const handlePost = () => {
    if (text.trim() === "" && images.length === 0 && !videos) {
      setError("Please add text or media to your post.");
      return;
    }
    setError(null);
    const formData = new FormData();
    formData.append("text", text);
    formData.append("keywords", tags);
    formData.append("tags", taggedUsers);
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append("media", image);
      });
    }
    if (videos) {
      formData.append("media", videos);
    }
    console.log(formData);
    handlePostMutation.mutate(formData);
  };

  const handleAddMedia = (media) => {
    if (media.type.startsWith("image/")) {
      if (videos) {
        setError("You can only upload one type of media at a time.");
        return;
      }
      setImages((prev) => [...prev, media]);
      setError(null);
    } else if (media.type.startsWith("video/")) {
      if (images.length > 0) {
        setError("You can only upload one type of media at a time.");
        return;
      }
      setVideos(media);
      setError(null);
    } else {
      setError("Unsupported media type. Please upload an image or video.");
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

  const handleRemoveTag = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
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
      buttonClass="w-full drop-shadow-lg h-14 bg-primary hover:bg-primary/90 cursor-pointer ease-in-out duration-500 text-background border border-[#111] rounded-full font-bold p-2"
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
        />
      }
    />
  );
}
