import Image from "next/image";

/**
 * @namespace PostCard
 * @component
 * 
 * A card component that displays a post with its content, media, and engagement statistics.
 */

/**
 * PostCard component - Displays a post's content, media, and engagement stats such as likes, comments, and shares.
 *
 * @param {PostCard.Props} props - The component props.
 * @param {string} props.image - The image URL representing the company or post image.
 * @param {string} props.dateTime - The date and time when the post was created.
 * @param {string} props.postText - The text content of the post.
 * @param {Array<string>} [props.postMedia=[]] - An array of media URLs (images, videos, etc.) associated with the post.
 * @param {string} props.company - The name of the company that posted the content.
 * @param {number} props.followers - The number of followers the company has.
 * @param {number} props.likes - The number of likes the post has received.
 * @param {number} props.comments - The number of comments on the post.
 * @param {number} props.shares - The number of shares the post has received.
 * @returns {JSX.Element} The rendered PostCard component.
 */

export default function PostCard({ image, dateTime, postText,postMedia, company, followers, likes, comments, shares }) {
    return (
      <div className="bg-[var(--foreground)] text-white rounded-2xl shadow-md overflow-hidden h-full border flex flex-col">
          <div className="p-4 flex-grow">
              <div className="flex items-center space-x-3 mb-2">
                  <img
                      src={image}
                      alt="Event Image"
                      className="object-cover w-16 h-16"
                  />
                  <div>
                      <h2 className="text-xl font-bold text-[var(--text)]">{company}</h2>
                      <p className="text-sm text-[var(--text)]">{followers} followers</p>
                      <p className="text-sm text-gray-400">{new Date(dateTime).toLocaleString()}</p>
                  </div>
              </div>
                {postText && (
                <p className="text-[var(--text)] leading-tight mb-2">{postText}</p>
                )}
                {Array.isArray(postMedia) && postMedia.length > 0 && postMedia[0] ? (
                <div className="relative w-full h-64 mt-4 rounded-xl overflow-hidden">
                    <Image
                    src={postMedia[0]}
                    alt="Post Media"
                    layout="fill"
                    objectFit="cover"
                    />
                </div>
                ) : null}
          </div>
          <div className="flex items-center px-4 py-2 text-sm text-gray-400">
              <p>{likes} likes {" "}. </p>
              <p>{comments} comments{" "} . </p>
              <p>{shares} shares</p>
          </div>
        </div>
    );
  }