"use client";
import { useState, useRef} from "react";
import { usePathname, useRouter } from "next/navigation";
import SideBar from "../presentation/SideBar";
import SideBarModal from "../presentation/SideBarModal";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import DynamicFeedOutlinedIcon from "@mui/icons-material/DynamicFeedOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCompany, updateCompany } from "@/app/services/companyManagement";


/**
 * @namespace company-page-author
 * @module company-page-author
 */
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

function SideBarContainer({company,setCompany, username ,setLogo }){
    const pathname= usePathname();
    const isActive = (href) => pathname.startsWith(href);
    const [isModalOpen, setModalOpen] = useState(false); 
    const [modalType, setModalType] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const coverInputRef = useRef(null);
    const logoInputRef = useRef(null);
    const router = useRouter(); 

    const coverUpload = async(e) => {
        const selectedFile=e.target.files[0];
        if (selectedFile){
            const newCoverURL = URL.createObjectURL(selectedFile);
            setCoverPreview(newCoverURL);
            try{
                const formData = new FormData();
                formData.append("cover", selectedFile);
                const response = await updateCompany(username, formData);
                setCompany((prev) => ({
                    ...prev,
                    cover: response.cover || newCoverURL, 
                })); 

            }catch (err) { 
                console.error("Failed to upload cover:", err);
            }
        }
    };
    
    const logoUpload = async(e) => {
        const file = e.target.files[0];
        if (file) {
            const newLogoURL = URL.createObjectURL(file);
            setLogo(newLogoURL);
            try{
                const formData = new FormData();
                formData.append("logo", file);
                const response = await updateCompany(username, formData);
                setCompany((prev) => ({
                    ...prev,
                    logo: response.logo || newLogoURL, 
                }));    
            }
            catch (err) {
                console.error("Failed to upload logo:", err);
            }
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
            await deleteCompany(username);
            setModalOpen(false); 
            router.push("/business");
        } catch (error) {
            console.error("Error deactivating company:", error);
        }
    };

    const OpenCompanyUserPage=()=>{
        router.push(`/company/${username}/user/about`);
    };

    const OpenPostsPage=()=>{
        router.push(`/company/${username}/admin/posts`);
        setModalOpen(false);
    }

    const OpenJobsPage =()=>{
        router.push(`/company/${username}/admin/company-author`);
        setModalOpen(false);
    }

    const handleLogout = () => {
        router.push(`/business`);
    }

    const menuItems =[
        {name: "Dashboard", href:`/company/${username}/admin/dashboard`,icon: <GridViewOutlinedIcon style={{fontSize:"20px"}}/> },
        {name: "Page Posts", href:`/company/${username}/admin/posts` , icon: < PostAddOutlinedIcon style={{fontSize:"20px"}}/>},
        {name: "Feed",href:"#", icon: <DynamicFeedOutlinedIcon style={{fontSize:"20px"}} />},
        {name: "Activity",href:"#", icon: <NotificationsOutlinedIcon style={{fontSize:"20px"}}/>},
        {name: "Inbox", href:"#", icon: <ArchiveOutlinedIcon style={{fontSize:"20px"}}/> },
        {name: "Edit Page", href:`/company/${username}/admin/edit`, icon: <BorderColorOutlinedIcon style={{fontSize:"20px"}}/>},
        {name: "Jobs", href:`/company/${username}/admin/company-author`,icon: <WorkOutlineOutlinedIcon style={{fontSize:"20px"}}/>},
        {name: "Deactivate Page", href:"#", icon: <DeleteIcon style={{fontSize:"20px"}}/>, action: () => handleOpenModal("deactivate")}
    ]
    return(
        <div>
            <SideBar company={company} menuItems={menuItems}
            isActive={isActive} setModalOpen={handleOpenModal} 
            onChangeCover={coverUpload} onChangeLogo={logoUpload} 
            triggerCoverInput={triggerCoverInput} triggerLogoInput={triggerLogoInput} 
            coverInputRef={coverInputRef} logoInputRef={logoInputRef} 
            fileusername={username} OpenCompanyUserPage={OpenCompanyUserPage}
            handleLogout={handleLogout}/>

            <SideBarModal open={isModalOpen} onClose={()=>setModalOpen(false)} type={modalType} onDeactivate={handleConfirmDeactivate} onCreatePost={OpenPostsPage} openJobsPage={OpenJobsPage}/> 
        </div>
    );

}

export default SideBarContainer;