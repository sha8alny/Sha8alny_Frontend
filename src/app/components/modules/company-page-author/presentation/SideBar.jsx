"use client";
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import EditIcon from '@mui/icons-material/Edit';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

/**
 * `SideBar` is a React functional component that displays the sidebar navigation for a company page,
 * including the company's logo, cover image, name, follower count, and menu items. It also allows the user 
 * to edit the company's logo and cover image and includes actions such as creating a post and logging out.
 * 
 * @namespace company-page-author
 * @module company-page-author
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.company - The company object containing the company's details.
 * @param {string} props.company.name - The name of the company.
 * @param {string} props.company.cover - The URL of the company's cover image.
 * @param {string} props.company.logo - The URL of the company's logo.
 * @param {number} props.company.numFollowers - The number of followers the company has.
 * @param {Array} [props.menuItems] - A list of menu items to display in the sidebar.
 * @param {boolean} props.isActive - A function that checks whether a given menu item is active.
 * @param {Function} props.setModalOpen - Function to open or close the modal.
 * @param {Function} props.onChangeCover - Function to handle cover image file changes.
 * @param {Function} props.onChangeLogo - Function to handle logo file changes.
 * @param {Object} props.coverInputRef - A ref for the cover image file input element.
 * @param {Object} props.logoInputRef - A ref for the logo file input element.
 * @param {Function} props.OpenCompanyUserPage - Function to navigate to the company user page.
 * 
 * @returns {JSX.Element} - The rendered JSX for the sidebar component.
 */


function SideBar({company, menuItems=[], isActive, setModalOpen, onChangeCover,  onChangeLogo, coverInputRef,  logoInputRef, OpenCompanyUserPage, handleLogout}){
    return (
        <aside className="bg-[var(--foreground)] text-text w-70px flex flex-col mt-5 mx-3 space-y-4 border rounded-lg p-4">
            {/*Logo and cover image for company*/}
            <div className="relative mb-0 max-h-[160px]">
                <div className="w-[250px] h-[120px] bg-gray-700 rounded-lg flex justify-center items-center overflow-hidden  relative">
                    {company?.cover ? (
                        <img src={company?.cover} alt="cover" className="w-full h-full" />
                    ) : (
                        <ImageOutlinedIcon style={{ width: "100%", height: "100px", color: "gray" }} />
                    )}
                    <label htmlFor="upload-cover" className="absolute bottom-2 right-2 cursor-pointer group p-2 bg-gray-800 rounded-full">
                        <CameraAltRoundedIcon />
                        <span className="absolute top-full left-1/2 -translate-x-1/2 bg-gray-800 text-[var(--text)] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Edit cover image
                        </span>
                    </label>
                </div>
                <input id="upload-cover" type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" ref={coverInputRef} onChange={onChangeCover} />
                <div className="absolute left-4 bottom-[50px] w-[80px] h-[80px] bg-gray-700 rounded-lg flex justify-center items-center overflow-hidden relative">
                    {company?.logo ? (
                        <img src={company?.logo} alt="logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <ImageOutlinedIcon style={{ fontSize: "70px", color: "gray" }} />
                    )}
                    <label htmlFor="upload-logo" className="absolute bottom-[-4px] right-[-4px] cursor-pointer group p-1 bg-gray-800 rounded-full z-10" >
                        <EditIcon style={{ fontSize: "18px" }} />
                        <span className="absolute top-full left-1/2 -translate-x-1/2 bg-gray-800 text-[var(--text)] text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Edit logo
                        </span>
                    </label>
                </div>
                <input id="upload-logo" data-testid="upload-logo" type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" ref={logoInputRef} onChange={onChangeLogo} />
            </div>
            {/*Company name*/}
            <div>
                <div className="text-[var(--text)] mb-1 border-b border-[var(--secondary)] pb-2 w-full">
                    <p className="text-2xl font-bold w-full">{company?.name}</p>
                    <p className="text-xs"> {company?.numFollowers} followers</p>
                </div>
                <div className="border-b border-[var(--secondary)] pb-2 flex flex-row justify-between items-center">
                    <button className="flex items-center gap-2 group cursor-pointer w-fit px-2 py-1 rounded-md transition-all relative" onClick={()=>setModalOpen("create")} data-testid="create-button">
                        <AddIcon className="transition-transform duration-200 group-hover:scale-110"/>
                        <span className="absolute left-full ml-2 text-[var(--text)] text-xs px-2 py-1  opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm">Create </span>
                    </button>
                    <button className="flex items-center gap-2 group cursor-pointer w-fit px-2 py-1 rounded-md transition-all" onClick={OpenCompanyUserPage} data-testid="view-as-member-button">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">View as member</span>
                        <VisibilityIcon className="transition-transform duration-200 group-hover:scale-110"/>
                    </button>
                </div>
            </div>
            {/*List of items in dashboard*/}
            <nav>
                {menuItems.map((item)=>(
                    <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center rounded-lg gap-2 p-2 mb-1 transition-colors duration-200 ${isActive(item.href)? "bg-[var(--secondary)] text-white": "hover:bg-[var(--secondary)]"}`} onClick={item.action ? item.action : undefined}
                    data-testid={`${item.name}-link`}>
                        {item.icon} {item.name}
                    </Link>))
                }
                <div>
                    <button
                    className="w-full cursor-pointer flex items-center space-x-2 rounded-lg p-2 text-[var(--text)] hover:bg-[var(--secondary)] transition-colors mt-2"
                    onClick={handleLogout} data-testid="logout-button"
                    >
                    <LogoutIcon className="text-[var(--text)]" />
                    <span>Logout</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
}

export default SideBar;