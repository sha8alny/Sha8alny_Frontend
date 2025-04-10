/**
 * PostCard component - Displays a social media-style post with company info, image, and engagement stats.
 *
 * @component
 * @param {Object} props - The props for the component.
 * @param {string} props.image - The URL of the image associated with the post.
 * @param {string|Date} props.dateTime - The date and time when the post was created.
 * @param {string} props.postText - The text content of the post.
 * @param {string} props.company - The name of the company that posted.
 * @param {number} props.followers - Number of followers the company has.
 * @param {number} props.likes - Number of likes the post received.
 * @param {number} props.comments - Number of comments on the post.
 * @param {number} props.shares - Number of times the post was shared.
 * @returns {JSX.Element} The rendered post card component.
 */

export default function PostCard({ image, dateTime, postText, company, followers, likes, comments, shares }) {
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
              <h3 className="text-[var(--text)] leading-tight mb-2">{postText}</h3>
          </div>
          <div className="flex items-center px-4 py-2 text-sm text-gray-400">
              <p>{likes} likes . </p>
              <p>{comments} comments . </p>
              <p>{shares} shares</p>
          </div>
      </div>
    );
  }