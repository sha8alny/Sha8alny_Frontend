import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge"; 
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import { Modal, Box, Button, Typography } from "@mui/material";
/**
 * @namespace SideBarModal
 * @component
 * 
 * A modal component that displays either a "deactivate page" prompt or options to create posts and jobs. 
 * The content of the modal depends on the `type` prop passed to it.
 * 
 * The modal can be used to either deactivate a page (removes access to the page) or to create posts/jobs.
 */
/**
 * SideBarModal component displays a modal with different content based on the type passed to it.
 * The modal can either show a "deactivate page" prompt or options to create posts and jobs.
 *
 * @param {SideBarModal.Props} props - The props for the SideBarModal component.
 * @param {boolean} props.open - Determines if the modal is open or closed.
 * @param {Function} props.onClose - The function to call when the modal should be closed.
 * @param {string} props.type - The type of modal to show. It can either be "deactivate" or "create".
 * @param {Function} props.onDeactivate - The function to call when the user confirms deactivation.
 * @param {Function} props.onCreatePost - The function to call when the user wants to create a post.
 * @param {Function} props.openJobsPage - The function to call when the user wants to post a job.
 *
 * @returns {JSX.Element} The rendered SideBarModal component.
 */
/**
 * @typedef {Object} SideBarModal.Props
 * @property {boolean} open - Determines if the modal is open or closed.
 * @property {Function} onClose - The function to call when the modal should be closed.
 * @property {string} type - The type of modal to show. It can either be "deactivate" or "create".
 * @property {Function} onDeactivate - The function to call when the user confirms deactivation.
 * @property {Function} onCreatePost - The function to call when the user wants to create a post.
 * @property {Function} openJobsPage - The function to call when the user wants to post a job.
 */

export default function SideBarModal({ open, onClose, type, onDeactivate, onCreatePost, openJobsPage }) {
    return(
        <Modal open={open} onClose={onClose} aria-labelledby="deactivate-modal" data-testid="deactivate-modal">
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
            <div className="text-text flex items-center justify-between border-b">
                <Typography variant="h6" className="text-lg font-semibold">{type==="deactivate" ?"Deactivate Page" :"Create Page"}</Typography>
                <Button  className="cursor-pointer" onClick={onClose} data-testid="closeModal-button"><CloseIcon className="text-white"/></Button>
            </div>
                {type==="deactivate" ?(
                <>
                    <div className="text-text">
                        <Typography variant="body1" sx={{ mt:2}}>
                        <strong>We're sorry to see you go</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mt:1, mb:1}} >Deactivating will remove the page entirely from Shaغalny. Once deactivated, you and other admins will no longer have access to the Page. <a href="#" className="text-[var(--secondary)]"> Learn more</a></Typography>
                        <Typography variant="body2" sx={{ mb:1 }}><strong>You and other admins will lose acsess to...</strong></Typography>
                        <ul className="mb-3 space-y-2">
                            <li className="flex gap-2 items-center"><LanguageIcon style={{fontSize:"20px"}}/>Page URL</li>
                            <li className="flex gap-2 items-center"><SearchIcon style={{fontSize:"20px"}}/>Search listings</li>
                            <li className="flex gap-2 items-center"><BadgeIcon style={{fontSize:"20px"}}/> Employee associations</li>
                        </ul>
                    </div>
                    <div className="border-t pt-2 ">
                        <Button variant="contained" data-testid="cancelDeactivate-button" sx={{background:"var(--secondary)", mr:2}} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="outlined" data-testid="deactivate-button" sx={{color: "var(--secondary)"}} onClick={onDeactivate}>
                            Deactivate
                        </Button>
                    </div>
                </>):(
                    //Create Part
                    <>
                    <div className="text-text">
                        <ul className="flex flex-col space-y-3 p-2">
                            <button className="flex flex-col gap-1 hover:bg-[var(--foreground)] cursor-pointer p-2" data-testid="createPost-button" onClick={onCreatePost}> 
                                <div className="flex items-center gap-2 hover:underline">
                                    <PostAddOutlinedIcon style={{fontSize:"20px"}}/>
                                    <span>Start a Post</span>
                                </div>
                                <span className="text-xs pr-24">Share content to connect with your followers</span>
                            </button>
                            <button className="flex flex-col gap-1 hover:bg-[var(--foreground)] p-2 cursor-pointer" data-testid="postJob-button" onClick={openJobsPage}>
                                <div className="flex items-center gap-2 hover:underline">
                                    <WorkOutlineOutlinedIcon style={{fontSize:"20px"}} />
                                    <span>Post a free job</span>
                                </div>
                                <span className="text-xs pr-42">Raech more qualified applicants</span>
                            </button>
                        </ul>
                    </div>
                </>
                )}
            </Box>
        </Modal>
    );
}