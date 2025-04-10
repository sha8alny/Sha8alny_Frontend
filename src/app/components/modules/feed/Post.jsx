"use client";
import {
  Bookmark,
  ChartNoAxesColumn,
  ChevronRight,
  Eye,
  Heart,
  MessageSquare,
  Repeat,
  Share,
  ChevronLeft,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Post({ cardInfo }) {
  const [isLiked, setisLiked] = useState(false);
  const [isShared, setisShared] = useState(false);
  const [checkComments, setCheckComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const router = useRouter();

  const handleClick = (username) => {
    router.push(`/u/${username}`);
  };

  const optimiseViews = (views) => {
    const formatNumber = (value, unit) => {
      const formattedValue = value % 1 === 0 ? value : value.toFixed(1);
      return `${formattedValue}${unit}`;
    };

    if (views < 1000) return views.toLocaleString();
    if (views < 1_000_000) return formatNumber(views / 1000, "K");
    if (views < 1_000_000_000) return formatNumber(views / 1_000_000, "M");
    return formatNumber(views / 1_000_000_000, "B");
  };

  // Handle carousel navigation
  const nextImage = () => {
    if (!cardInfo.mediaItems || !cardInfo.mediaItems.length) return;
    setCurrentImageIndex((prev) =>
      prev === cardInfo.mediaItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    if (!cardInfo.mediaItems || !cardInfo.mediaItems.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? cardInfo.mediaItems.length - 1 : prev - 1
    );
  };

  // Check if we have multiple images
  const hasMultipleImages =
    cardInfo.hasMedia && cardInfo.mediaItems && cardInfo.mediaItems.length > 1;

  return (
    <div className="flex flex-col mb-2 gap-2 h-full items-center p-4 rounded-2xl border border-[#111] bg-foreground text-primary w-full">
      <section className="flex gap-2 items-center justify-between w-full">
        <section className="flex gap-2">
          <div className="size-9 relative bg-gray-600 rounded-full">
            <Image
              src={cardInfo.image}
              alt="User Avatar"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="text-left">
            <div className="flex gap-1">
              <button
                className="hover:underline hover:cursor-pointer text-sm font-[525]"
                onClick={() => handleClick(cardInfo.username)}
              >
                {cardInfo.name}
              </button>
              <div className="text-xs self-center text-gray-300">•</div>
              <div className="text-xs self-center text-gray-300">
                {cardInfo.relation}
              </div>
            </div>
            <div className="text-xs text-gray-300">{cardInfo.job}</div>
          </div>
        </section>
        <section className="self-start flex gap-2">
          <div className="text-sm text-gray-300">
            {compareDate(cardInfo.timePosted).split(" ")[0].substring(0, 3)}
          </div>
          <button className="text-xs text-gray-300">•••</button>
        </section>
      </section>
      <p className="self-start">{cardInfo.description}</p>

      {cardInfo.hasMedia && (
        <div
          className="w-full relative rounded-lg overflow-hidden"
          style={{ height: "300px" }}
        >
          {/* Image Carousel */}
          {hasMultipleImages && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="size-5 text-white" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full z-10 hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="size-5 text-white" />
              </button>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
                {cardInfo.mediaItems.map((_, idx) => (
                  <div
                    key={idx}
                    className={`size-2 rounded-full ${
                      idx === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                    onClick={() => setCurrentImageIndex(idx)}
                  />
                ))}
              </div>
            </>
          )}

          {/* Current image */}
          <Image
            src={
              hasMultipleImages
                ? cardInfo.mediaItems[currentImageIndex]
                : cardInfo.media
            }
            className="w-full h-full object-contain"
            alt="Post Image"
            fill
          />
        </div>
      )}

      <section className="flex gap-2 w-full">
        <div className="flex gap-2 w-2/3 justify-between">
          <button
            onClick={() => setisLiked(!isLiked)}
            className="flex gap-1 hover:bg-gray-700 p-2 rounded-md duration-200 items-center"
          >
            <Heart
              className={`${
                isLiked
                  ? "text-red-500 fill-current transition-colors duration-300"
                  : ""
              } size-5`}
            />
            <p className="text-sm font-semibold text-gray-300">
              {cardInfo.likes}
            </p>
          </button>
          <button
            onClick={() => setCheckComments(!checkComments)}
            className="flex gap-1 hover:bg-gray-700 p-2 rounded-md duration-200 items-center"
          >
            <MessageSquare
              className={`${
                checkComments
                  ? "fill-current text-gray-400 transition-colors duration-300"
                  : ""
              } size-5`}
            />
            <p className="text-sm font-semibold text-gray-300">
              {cardInfo.comments.length}
            </p>
          </button>
          <button
            onClick={() => setisShared(!isShared)}
            className="flex gap-1 hover:bg-gray-700 p-2 rounded-md duration-200 items-center"
          >
            <Repeat
              className={`size-5 ${
                isShared ? "text-green-500 transition-colors duration-300" : ""
              }`}
            />
            <p className="text-sm font-semibold text-gray-300">
              {cardInfo.reposts}
            </p>
          </button>
          <button className="flex gap-1 hover:bg-gray-700 p-2 rounded-md duration-200 items-center">
            <ChartNoAxesColumn className="size-5" />
            <p className="text-sm font-semibold text-gray-300">
              {optimiseViews(cardInfo.views)}
            </p>
          </button>
        </div>
        <div className="flex w-1/3 gap-1 justify-end">
          <button>
            <Bookmark className="hover:-translate-y-1 duration-200 ease-in-out size-5" />
          </button>
          <button>
            <Share className="hover:-translate-y-1 duration-200 ease-in-out size-5" />
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
              placeholder="Write a comment..."
              className="w-full placeholder:text-gray-300 bg-transparent border border-[#111111] rounded-lg px-3 py-1 focus:outline-hidden focus:border-gray-500"
            />
            <button className="size-8 p-1 hover:bg-gray-600 rounded-lg duration-200 ease-in-out text-gray-300">
              <ChevronRight />
            </button>
          </div>
          <div className="flex flex-col gap-4 mt-4">
            {cardInfo.comments.map((comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const Comment = ({ comment }) => {
  const [isLiked, setIsLiked] = useState(false);
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
      <div className="flex w-full">
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
          <p className="text-sm text-gray-300">{comment.post}</p>
        </div>
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="flex flex-col ml-auto hover:bg-gray-600 p-1 rounded-md duration-200"
        >
          <Heart
            className={`${
              isLiked
                ? "text-red-500 fill-current transition-colors duration-300"
                : ""
            } size-4`}
          />
          <p className="text-xs font-semibold text-gray-300">{comment.likes}</p>
        </button>
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
