import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge"; 
import { Modal, Box, Button, Typography } from "@mui/material";

export default function SideBarModal({ open, onClose, type, onDeactivate, onCreatePost }) {
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
                <Button  className="cursor-pointer" onClick={onClose} ><CloseIcon className="text-white"/></Button>
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
                        <Button variant="contained" sx={{background:"var(--secondary)", mr:2}} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button variant="outlined" sx={{color: "var(--secondary)"}} onClick={onDeactivate}>
                            Deactivate
                        </Button>
                    </div>
                </>):(
                    //Create Part
                    <>
                    <div className="text-text">
                        <ul className="flex flex-col space-y-3 p-2">
                            <button className="flex flex-col gap-1 hover:bg-[var(--foreground)] cursor-pointer p-2" onClick={onCreatePost}> 
                                <div className="flex items-center gap-2 hover:underline">
                                    <PostAddOutlinedIcon style={{fontSize:"20px"}}/>
                                    <span>Start a Post</span>
                                </div>
                                <span className="text-xs pr-24">Share content to connect with your followers</span>
                            </button>
                            <button className="flex flex-col gap-1 hover:bg-[var(--foreground)] p-2 cursor-pointer">
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