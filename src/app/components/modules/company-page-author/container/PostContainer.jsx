"use client";
import { useState } from "react";
import { useEffect } from "react";
import Post from "../presentation/Post";
import { Modal, Box, Button, Typography, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getLikes } from "@/app/services/post";
import { unlikePost,likePost } from "@/app/services/post";
import { addComment, deleteComment, likeComment, getComments } from "@/app/services/post";


/**
 * PostContainer Component
 * @component
 * @param {Object} props - Component props
 * @param {string} props.username - Username of the post owner
 * @param {number} props.followers - Number of followers of the user
 * @param {Array} props.posts - List of posts to be displayed
 * @param {string} props.logoPreview - URL of the user's logo
 * @returns {JSX.Element} - Rendered component
 */
/**
 * Opens the comment modal for a post
 * @param {number} postId - The ID of the post
 */
/**
 * Handles like/unlike for a post
 * @param {number} postId - The ID of the post to like/unlike
 */
/**
 * Handles deleting a comment from a post
 * @param {number} postId - The ID of the post
 * @param {number} commentId - The ID of the comment to delete
 */
/**
 * Handles liking a comment
 * @param {number} postId - The ID of the post
 * @param {number} commentId - The ID of the comment to like
 */
function PostContainer({username,followers, posts, logoPreview}){
    const [likes , setLikes] = useState({});
    const [liked, setLiked]= useState({});
    const [likedComments, setLikedComments]= useState({});
    const [comments, setComments] = useState({});
    const [isModalOpen, setModalOpen] = useState(false); 
    const [currentPostId, setCurrentPostId] = useState(null);
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        if (!Array.isArray(posts)) return; 
        posts.forEach(async (post) => {
            try {
                const likesData = await getLikes(post.id);
                setLikes((prevLikes) => ({ ...prevLikes, [post.id]: likesData.count || 0 }));
            } catch (error) {
                console.error("Error fetching likes:", error);
            }
        });
    }, [posts]);

    const handleOpenModal = (postId) => {
        setCurrentPostId(postId);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCommentText("");
    };

    const handleLike = async (postId) => {
        try {
            if (liked[postId]) {
                await unlikePost(postId);
                setLikes((prevLikes) => ({ ...prevLikes, [postId]: prevLikes[postId] - 1 }));
            } else {
                await likePost(postId);
                setLikes((prevLikes) => ({ ...prevLikes, [postId]: prevLikes[postId] + 1 }));
            }
            setLiked((prevLiked) => ({ ...prevLiked, [postId]: !prevLiked[postId] }));
        } catch (error) {
            console.error("Error updating like status:", error);
        }
    };

    const handleComment = async () => {
        if (commentText.trim() ) {
            try {
                await addComment(currentPostId, commentText);
                const updatedComments = [...(comments[currentPostId] || []), { text: commentText }];
                setComments((prev) => ({ ...prev, [currentPostId]: updatedComments }));
                setCommentText("");
            } catch (error) {
                console.error("Error adding comment:", error);
            }
        }
    };

    const handleDeleteComment = async (postId, commentId) => {
        try {
            await deleteComment(postId, commentId);
            setComments((prev) => ({...prev, [postId]: prev[postId]?.filter((comment) => comment.id !== commentId), }));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleLikeComment = async (postId, commentId) => {
        try {
            await likeComment(postId, commentId);
            setLikedComments((prev) => ({
                ...prev,
                [commentId]: !prev[commentId]
            }));
        } catch (error) {
            console.error("Error liking comment:", error);
        }
    };


    return(
        <div>
            {Array.isArray(posts) && posts.length > 0 ? (
                posts.map((post,index) => (
                    <Post
                        key={post.id ?? `post-${index}`}
                        username={username}
                        followers={followers}
                        text={post.text?.trim()}
                        imageUrl={post.imageUrl?.trim()||null}
                        likes={likes[post.id]} liked={liked[post.id]} comments={comments[post.id]} onLike={()=>handleLike(post.id)} onComment={()=>handleOpenModal(post.id)}
                        logoPreview={logoPreview}
                    />
                ))
            ) : (
                <p className="text-gray-500 text-center mt-4">No posts available</p>
            )}
            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 500,
                    bgcolor: "var(--background)",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    textAlign: "left"
                }}>
                <div className="flex items-center justify-between border-b mb-2">
                    <Typography variant="h6" className="text-lg font-semibold">Add a comment</Typography>
                    <Button  className="cursor-pointer" onClick={() => setModalOpen(false)} ><CloseIcon className="text-white"/></Button>
                </div>
                <div>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="Write your comment..."
                        sx={{"& .MuiInputBase-input::placeholder": { color: "white", opacity: 1 },
                        "& .MuiInputBase-input": { color: "white" }}}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                </div>
                <div className="border-t pt-2 mt-2">
                    <Button variant="outlined" sx={{color: "var(--secondary)", mr:2}} onClick={handleComment}>
                        Submit
                    </Button>
                    <Button variant="contained" sx={{background:"var(--secondary)"}} onClick={handleCloseModal}>
                        Cancel
                    </Button>
                </div>
                {comments[currentPostId]?.map((comment, index) => (
                        <div key={index} className="mt-2 p-2 border border-gray-700 rounded-lg flex justify-between">
                            <Typography className="text-white">{comment.text}</Typography>
                            <div className="flex gap-2">
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => handleDeleteComment(currentPostId, comment.id)}>
                                    <DeleteIcon sx={{color: "var(--secondary)"}}/>
                                </Button>
                                <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => handleLikeComment(currentPostId, comment.id)}>
                                    {likedComments[comment.id] ? (
                                        <FavoriteIcon sx={{ color: "var(--secondary)" }} />
                                    ) : (
                                        <FavoriteBorderIcon sx={{ color: "var(--secondary)" }} />
                                    )}
                                </Button>
                            </div>
                        </div>
                    ))}
                </Box>
            </Modal>
        </div>
    );

}
export default PostContainer;