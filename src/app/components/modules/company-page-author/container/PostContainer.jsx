"use client";
import {Bookmark, ChartNoAxesColumn, ChevronRight, Eye, Heart, MessageSquare,Repeat,Share,} from "lucide-react";
import { Trash2 } from "lucide-react"; 
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Post({ username,logo, cardInfo }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(cardInfo.likes);
  const [isShared, setIsShared] = useState(false);
  const [checkComments, setCheckComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(cardInfo.comments || []);
  const [repostsCount, setRepostsCount] = useState(cardInfo.reposts || 0);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    const newCommentObj = {
      name: "Current User", 
      photo: "https://picsum.photos/50", 
      timePosted: new Date().toISOString(),
      post: newComment,
      likes: 0,
    };
    setComments([newCommentObj, ...comments]);
    setNewComment("");
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleDeleteComment = (index) => {
    setComments((prevComments) => prevComments.filter((_, i) => i !== index));
  };

  const handleRepost = () => {
    setIsShared(!isShared);
    setRepostsCount((prev) => (isShared ? prev - 1 : prev + 1));
  };

  const optimiseViews = (views) => {
    const formatNumber = (value, unit) => {
      const formattedValue = value % 1 === 0 ? value : value.toFixed(1);
      return `${formattedValue}${unit}`;
    }

    if (views < 1000) return views.toLocaleString();
    if (views < 1_000_000) return formatNumber(views / 1000, 'K');
    if (views < 1_000_000_000) return formatNumber(views / 1_000_000, 'M');
    return formatNumber(views / 1_000_000_000, 'B');
  }


  return (
    <div className="flex flex-col mt-4 mb-2 gap-2 h-max items-center p-4 rounded-2xl border border-[#111111] bg-[var(--foreground)] w-full">
      <section className="flex gap-2 items-center justify-between w-full">
        <section className="flex gap-2">
          <div className="size-9 relative bg-gray-600 rounded-full">
              <Image
              src={logo?.trim() ? logo : "/default-logo.png"}
              alt="User Avatar"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-left">
            <div className="flex gap-1">
              <div className="text-lg text-[var(--text)] self-center">{username ? username.charAt(0).toUpperCase() + username.slice(1): "Company Name"}</div>
              <div className="text-xs self-center text-gray-300">
                {cardInfo.relation}
              </div>
            </div>
            <div className="text-xs text-gray-300">{cardInfo.job}</div>
          </div>
        </section>
        <section className="self-start flex gap-2">
        <div className="text-sm text-gray-300">
          {compareDate(cardInfo.timePosted)?.split(' ')[0]?.substring(0, 3) || "N/A"}
        </div>
          <button className="text-xs text-gray-300">•••</button>
        </section>
      </section>
      <div className="p-2 text-left w-full">
        <p className="text-left mb-2 text-[var(--text)]">{cardInfo.description}</p>
      </div>
      <section className="flex gap-2 w-full">
        <div className="flex gap-2 w-2/3 justify-between">
          <button onClick={handleLike} className="flex gap-1 hover:bg-gray-700 p-2 rounded-md duration-200 items-center">
            <Heart className={`${isLiked ? "text-red-500 fill-current transition-colors duration-300" : "text-[var(--text)]"} size-5`} />
            <p className="text-sm font-semibold text-gray-300">{likesCount}</p>
          </button>
          <button
            onClick={() => setCheckComments(!checkComments)}
            className="flex gap-1 hover:bg-gray-700 p-2 rounded-md duration-200 items-center"
          >
            <MessageSquare
              className={`${checkComments
                ? "fill-current text-gray-400 transition-colors duration-300"
                : "text-[var(--text)]"
                } size-5`}
            />
            <p className="text-sm font-semibold text-[var(--text)]">
              {comments.length}
            </p>
          </button>
          <button
            onClick={() => handleRepost()}
            className="flex gap-1 hover:bg-gray-700 p-2 rounded-md duration-200 items-center"
          >
            <Repeat
              className={`size-5 ${isShared ? "text-green-500 transition-colors duration-300" : "text-[var(--text)]"
                }`}
            />
            <p className="text-sm font-semibold text-gray-300">
              {repostsCount}
            </p>
          </button>
          <button className="flex gap-1 text-[var(--text)] hover:bg-gray-700 p-2 rounded-md duration-200 items-center">
            <ChartNoAxesColumn className="size-5" />
            <p className="text-sm font-semibold text-gray-300">
              {optimiseViews(cardInfo.views)}
            </p>
          </button>
        </div>
        <div className="flex w-1/3 gap-1 justify-end">
          <button>
            <Bookmark className="hover:-translate-y-1 text-[var(--text)] duration-200 ease-in-out size-5" />
          </button>
          <button>
            <Share className="hover:-translate-y-1 text-[var(--text)] duration-200 ease-in-out size-5" />
          </button>
        </div>
      </section>
      {checkComments && (
        <section className="flex flex-col gap-2 w-full pt-4 border-t border-gray-700">
          <div className="flex gap-2">
            <div className="size-8 relative bg-gray-600 rounded-full">
              <Image
                src={"https://picsum.photos/id/19/500/200"}
                alt="User Avatar"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full placeholder:text-gray-300 bg-transparent border border-[#111111] rounded-lg px-3 py-1 focus:outline-hidden focus:border-gray-500 text-[var(--text)]"
            />
            <button onClick={() => { handleAddComment(); setCheckComments(comments.length + 1); }}className="size-8 p-1 hover:bg-gray-600 rounded-lg duration-200 ease-in-out text-gray-300">
              <ChevronRight />
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {comments.map((comment, index) => (
              <Comment key={index} comment={comment} index={index} onDelete={handleDeleteComment} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const Comment = ({ comment, index, onDelete }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };
  return (
    <div className="flex gap-2 mb-1">
      <div className="self-center size-8 relative">
        <Image
          src={comment.photo}
          alt="Comment Avatar"
          fill
          className="rounded-full"
        />
      </div>
      <div className="flex w-full text-[var(--text)]">
        <div className="flex flex-col">
          <div className="flex gap-2 items-center">
            <button className="text-sm hover:underline font-semibold">
              {comment.name}
            </button>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-xs text-gray-400">
              {compareDate(comment.timePosted)}
            </span>
          </div>
          <p className="text-sm">{comment.post}</p>
        </div>
        <div className="flex gap-3 items-center ml-auto">
          <button onClick={handleLike} className="flex flex-col hover:bg-gray-600 p-1 rounded-md duration-200">
            <Heart className={`${isLiked ? "text-red-500 fill-current transition-colors duration-300" : ""} size-4`} />
            <p className="text-xs font-semibold text-gray-300">{likesCount}</p>
          </button>
          <button onClick={() => onDelete(index)} className="text-[var(--text)] mb-4 hover:text-red-500 duration-200">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};


const compareDate = (date) => {
  const INTERVALS = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  const diff = (Date.now() - new Date(date).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  for (const [unit, seconds] of Object.entries(INTERVALS)) {
    const value = Math.floor(diff / seconds);
    if (value >= 1) {
      const abbreviation = unit === "minute" ? "min" : unit[0];
      return `${value}${abbreviation} ago`;
    }
  }
};