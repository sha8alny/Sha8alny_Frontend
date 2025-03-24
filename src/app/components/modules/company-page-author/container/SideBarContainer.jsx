"use client";
import { useState, useRef} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SideBar from "../presentation/SideBar";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from "@mui/icons-material/Search";
import BadgeIcon from "@mui/icons-material/Badge"; 
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';
import { Modal, Box, Button, Typography } from "@mui/material";
import { deleteCompany } from "@/app/services/companyManagment";


/**
 * SideBarContainer component provides navigation and company management functionalities,
 * including file uploads, modal handling, and page deactivation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.username - The username of the company.
 * @returns {JSX.Element} The rendered SideBarContainer component.
 */

/**
 * Handles the upload of a cover image and sets its preview.
 * @param {Event} e - The file input change event.
 */

/**
 * Handles the upload of a logo image and sets its preview.
 * @param {Event} e - The file input change event.
 */

/**
 * Triggers the file input for cover image upload.
 */

/**
 * Triggers the file input for logo image upload.
 */

/**
 * Opens a modal with the specified type.
 * @param {string} type - The type of the modal (e.g., "deactivate").
 */

/**
 * Confirms the deactivation of the company page by calling deleteCompany service.
 * Closes the modal upon successful deletion.
 * @async
 * @throws {Error} If the company deletion fails.
 */

/** 
 * List of sidebar menu items with their respective icons and actions.
 * @type {Array<{name: string, href: string, icon: JSX.Element, action?: Function}>}
 */



function SideBarContainer({username, logoPreview, logoInputRef, logoUpload}){
    console.log("username in sidebar container", username);
    const pathname= usePathname();
    const [active, setActive] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false); 
    const [modalType, setModalType] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const coverInputRef = useRef(null);
    console.log("Current logoPreview:", logoPreview);
    
    const coverUpload = (e) => {
        const selectedFile=e.target.files[0];
        if (selectedFile){
          setCoverPreview(URL.createObjectURL(selectedFile))
        }
    };
    const triggerCoverInput = () => {
        coverInputRef.current?.click();
    };

    const triggerLogoInput = () => {
        logoInputRef.current?.click();
    };

    const handleOpenModal = (type) => {
        setModalType(type);
        setModalOpen(true);
    };

    const handleConfirmDeactivate = async() => {
        try {
            setModalOpen(false); 
            await deleteCompany(username);
        } catch (error) {
            console.error("Error deactivating company:", error);
        }
    };

    const menuItems =[
        {name: "Dashborad", href:`/company-page-author/${username}`,icon: <GridViewOutlinedIcon style={{fontSize:"20px"}}/> },
        {name: "Page Posts", href:"/posts-page" , icon: < PostAddOutlinedIcon style={{fontSize:"20px"}}/>},
        {name: "Analytics",href:"#", icon:<ShowChartOutlinedIcon style={{fontSize:"20px"}}/> },
        {name: "Feed",href:"#", icon: <DynamicFeedOutlinedIcon style={{fontSize:"20px"}} />},
        {name: "Activity",href:"#", icon: <NotificationsOutlinedIcon style={{fontSize:"20px"}}/>},
        {name: "Inbox", href:"#", icon: <ArchiveOutlinedIcon style={{fontSize:"20px"}}/> },
        {name: "Edit Page", href:"/edit-page", icon: <BorderColorOutlinedIcon style={{fontSize:"20px"}}/>},
        {name: "Jobs", href:"#",icon: <WorkOutlineOutlinedIcon style={{fontSize:"20px"}}/>},
        {name: "Deactivate Page", href:"#", icon: <DeleteIcon style={{fontSize:"20px"}}/>, action: () => handleOpenModal("deactivate")}
    ]
    return(
        <div>
            <SideBar menuItems={menuItems} pathname={pathname} setActive={setActive} isModalOpen={isModalOpen} setModalOpen={handleOpenModal} onChangeCover={coverUpload} onChangeLogo={logoUpload} coverpreview={coverPreview} logoPreview={logoPreview} triggerCoverInput={triggerCoverInput} triggerLogoInput={triggerLogoInput} coverInputRef={coverInputRef} logoInputRef={logoInputRef} fileusername={username}/>
            <Modal open={isModalOpen} onClose={() => setModalOpen(false)} aria-labelledby="deactivate-modal">
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
                <div className="flex items-center justify-between border-b">
                    <Typography variant="h6" className="text-lg font-semibold">{modalType==="deactivate" ?"Deactivate Page" :"Create Page"}</Typography>
                    <Button  className="cursor-pointer" onClick={() => setModalOpen(false)} ><CloseIcon className="text-white"/></Button>
                </div>
                    {modalType==="deactivate" ?(
                    <>
                        <div>
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
                            <Button variant="contained" sx={{background:"var(--secondary)", mr:2}} onClick={() => setModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button variant="outlined" sx={{color: "var(--secondary)"}} onClick={handleConfirmDeactivate}>
                                Deactivate
                            </Button>
                        </div>
                    </>):(
                        <>
                        <div>
                            <ul className="flex flex-col space-y-3 p-2">
                                <Link className="flex flex-col gap-1 hover:bg-[var(--foreground)] p-2" href="#"> 
                                    <div className="flex items-center gap-2">
                                        <PostAddOutlinedIcon style={{fontSize:"20px"}}/>
                                        <span>Start a Post</span>
                                    </div>
                                    <span className="text-xs ml-[26px]">Share content to connect with your followers</span>
                                </Link>
                                <Link className="flex flex-col gap-1 hover:bg-[var(--foreground)] p-2" href="#">
                                    <div className="flex items-center gap-2">
                                        <WorkOutlineOutlinedIcon style={{fontSize:"20px"}} />
                                        <span>Post a free job</span>
                                    </div>
                                    <span className="text-xs ml-[26px]">Raech more qualified applicants</span>
                                </Link>
                                <Link className="flex flex-col gap-1 hover:bg-[var(--foreground)] p-2" href="#">
                                    <div className="flex items-center gap-2">
                                        <FeedOutlinedIcon style={{fontSize:"20px"}}/>
                                        <span>Publish an article</span>
                                    </div> 
                                    <span className="text-xs ml-[26px]">Connect with followers through long-form content </span>
                                </Link>
                            </ul>
                        </div>
                    </>
                    )}
                </Box>
            </Modal>
        </div>
    );

}

export default SideBarContainer;