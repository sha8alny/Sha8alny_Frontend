/**
 * @namespace company-page-author
 * @module company-page-author
 */
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RepeatIcon from '@mui/icons-material/Repeat';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

function Post({username, followers, text, imageUrl,videoUrl, likes, liked, comments=[], onLike, onComment, logo}){
    return(
        <div className=" text-text mt-2">
            {/*Post Container*/}
            <div className="bg-[var(--foreground)] mt-4 border rounded-lg p-4">
                <div className="flex items-center gap-4 ">
                    {logo ? (
                            <img 
                                src={logo} 
                                alt="company-logo" 
                                className="rounded-full w-[40px] h-[40px] object-cover" 
                            />
                        ) : (
                            <ImageOutlinedIcon style={{ fontSize: "56px", color: "gray" }} />
                        )
                    }
                    <div className="flex flex-col ">
                        <p>{username.charAt(0).toUpperCase()+username.slice(1)|| "Company Name"}</p>
                        <p className="text-xs text-gray-300"> {followers} followers</p>
                    </div>
                </div>
                <div className="mt-2 p-2">
                    <p className="mt-2 text-white">{text}</p>
                    {imageUrl && imageUrl.trim() !== null? (
                        <img src={imageUrl} alt="" className="w-full h-full rounded-lg mt-2" />
                    ) : null}
                    {videoUrl && videoUrl.trim() !== "" ? (
                        <video controls className="w-full rounded-lg mt-2">
                            <source src={videoUrl} type="video/mp4" />
                            <source src={videoUrl} type="video/webm" />
                        </video>
                    ) : null}
                </div>
                <div className="flex flex-row justify-between items-center mt-2 border-t border-[var(--secondary)] pt-2 ">
                    <button data-testid="like-button" className="relative group" onClick={onLike}>
                        {liked ? <FavoriteIcon className="text-red-500 cursor-pointer" /> : <FavoriteBorderIcon className="cursor-pointer" />}
                        <span className="text-xs text-white ml-1">{likes}</span>
                    </button>
                    <button data-testid="comment-modal" className="relative group" onClick={onComment}>
                        <ChatBubbleOutlineIcon className="cursor-pointer"/>
                        <span className="text-xs text-white ml-1">{comments.length}</span>
                    </button>
                    <div className="relative group">
                        <RepeatIcon  className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-white text-xs transition-opacity duration-200 "> Repost</span>
                    </div>
                    <div className="relative group">
                        <BookmarkBorderIcon  className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-white text-xs transition-opacity duration-200 "> Bookmark</span>
                    </div>
                    <div className="relative group">
                        <IosShareIcon  className="cursor-pointer group"/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-white text-xs transition-opacity duration-200 "> Share</span>
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Post;