"use client";
import { useState, useRef } from "react";
import WritePost from "../presentation/WritePost";

/**
 * @namespace WritePostComponents
 */

/**
 * WritePostContainer component manages the state and actions for composing a post.
 * It handles the text input, media uploads (images and videos), and submits the post data.
 *
 * @component
 *
 * @param {Object} props - The props for the WritePostContainer component.
 * @param {Object} props.company - The company object containing company details.
 * @param {function} props.onPostSubmit - The function to handle post submission. It receives form data as a parameter.
 * @param {string} props.logo - The company logo URL.
 *
 * @returns {JSX.Element} The rendered WritePostContainer component.
 */

export default function WritePostContainer({ company, onPostSubmit, logo }) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState(null);
  const [tags, setTags] = useState([]);
  const [taggedUsers, setTaggedUsers] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState(null);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const imageUpload = (e) => {
    const selectedFile = e.target.files[0];
    console.log("Image selected", e.target.files[0]);
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setImages([selectedFile]);
    }
  };

  const videoUpload = (e) => {
    const selectedFile = e.target.files[0];
    console.log("video selected", e.target.files[0]);
    if (selectedFile && selectedFile.type.startsWith("video/")) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setVideos([selectedFile]);
    }
  };

  const triggerFileInput = (fileType) => {
    if (fileType === "image") imageInputRef.current?.click();
    if (fileType === "video") videoInputRef.current?.click();
  };

  const handleSubmit = async () => {
    console.log("Videos:", videos);
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
    console.log(company)
    const postJSON = {
      text: text,
      fullName: company.name,
      headline: company.industry,
      profilePicture: company.logo,
      isFollowed: false,
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
      isCompany: true,
      reaction: null,
      keywords: tags,
      tags: taggedUsers,
    };
    onPostSubmit(formData, postJSON);
  };
  return (
    <div className="max-w-2xl mx-auto mb-10">
      <WritePost
        company={company}
        text={text}
        setText={setText}
        onImageUpload={imageUpload}
        preview={preview}
        triggerFileInput={triggerFileInput}
        imageInputRef={imageInputRef}
        videoUpload={videoUpload}
        videoInputRef={videoInputRef}
        onSubmit={handleSubmit}
        logo={logo}
      />
    </div>
  );
}
