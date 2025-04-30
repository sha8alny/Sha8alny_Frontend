"use client";
import { useState, useRef} from "react";
import { usePathname, useRouter } from "next/navigation";
import SideBar from "../presentation/SideBar";
import SideBarModal from "../presentation/SideBarModal";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCompany, updateCompany } from "@/app/services/companyManagement";
import { deleteCompanyMedia } from "@/app/services/companyManagement";

/**
 * @namespace SideBarComponents
 */

/**
 * SideBarContainer component manages the logic and actions for the sidebar, including uploading media (logo, cover image), navigation, and deactivating the company page.
 * 
 * @component
 * 
 * @param {Object} props - The props for the SideBarContainer component.
 * @param {Object} props.company - The company object containing the company's details.
 * @param {function} props.setCompany - Function to update the company object.
 * @param {string} props.username - The username of the company.
 * @param {function} props.setLogo - Function to update the company logo.
 * 
 * @returns {JSX.Element} The rendered SideBarContainer component.
 */

export default function SideBarContainer({company,setCompany, username ,setLogo }){
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
                setCompany((prev) => ({...prev,cover: response.cover || newCoverURL, })); 

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
                setCompany((prev) => ({...prev,logo: response.logo || newLogoURL, }));    
            }
            catch (err) {
                console.error("Failed to upload logo:", err);
            }
        }
    };

    const handleRemoveLogo = async () => {
        try {
            await deleteCompanyMedia(username, 'logo');
            setCompany((prev) => ({...prev,logo: null,}));
            setLogo(null);
        } catch (error) {
            console.error("Error removing logo:", error);
        }
    };
    
    const handleRemoveCover = async () => {
        try {
            await deleteCompanyMedia(username, 'cover');
            setCompany((prev) => ({...prev,cover: null,}));
            setCoverPreview(null);
        } catch (error) {
            console.error("Error removing cover image:", error);
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
        router.push(`/company/${username}/user/posts`);
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
        {name: "Followers", href:`/company/${username}/admin/followers`, icon: <GroupIcon style={{fontSize:"20px"}}/> },
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
            handleLogout={handleLogout} onRemoveLogo={handleRemoveLogo} onRemoveCover={handleRemoveCover}
            />

            <SideBarModal open={isModalOpen} onClose={()=>setModalOpen(false)} type={modalType} onDeactivate={handleConfirmDeactivate} onCreatePost={OpenPostsPage} openJobsPage={OpenJobsPage}/> 
        </div>
    );

}