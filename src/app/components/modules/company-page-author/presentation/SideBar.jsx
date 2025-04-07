/**
 * @namespace company-page-author
 * @module company-page-author
 */
"use client";
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import EditIcon from '@mui/icons-material/Edit';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';


function SideBar({company, menuItems=[], isActive, isModalOpen, setModalOpen, onChangeCover,  onChangeLogo, coverInputRef,  logoInputRef,fileusername, OpenCompanyUserPage}){
    return (
        <aside className="bg-[var(--foreground)] text-text w-70px flex flex-col mt-5 mx-3 space-y-4 border rounded-lg p-4">
            {/*Logo and cover image for company*/}
            <div className="relative mb-0 max-h-[160px]">
                <div className="w-[250px] h-[120px] bg-gray-700 rounded-lg flex justify-center items-center overflow-hidden  relative">
                    {company?.cover ? (
                        <img src={company?.cover} alt="cover" className="w-full h-full object-cover" />
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
                    <p className="text-2xl font-bold w-full">{fileusername ? fileusername.charAt(0).toUpperCase() + fileusername.slice(1): "Company Name"}</p>
                    <p className="text-xs"> {company?.numFollowers}</p>
                </div>
                <div className="border-b border-[var(--secondary)] pb-2 flex flex-row justify-between items-center">
                    <button className="flex items-center gap-2 group cursor-pointer w-fit px-2 py-1 rounded-md transition-all relative" onClick={()=>setModalOpen("create")}>
                        <AddIcon className="transition-transform duration-200 group-hover:scale-110"/>
                        <span className="absolute left-full ml-2 text-[var(--text)] text-xs px-2 py-1  opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm">Create </span>
                    </button>
                    <button className="flex items-center gap-2 group cursor-pointer w-fit px-2 py-1 rounded-md transition-all" onClick={OpenCompanyUserPage}>
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
                    className={`group flex items-center rounded-lg gap-2 p-2 mb-1 transition-colors duration-200 ${isActive(item.href)? "bg-[var(--secondary)] text-white": "hover:bg-[var(--secondary)]"}`} onClick={item.action ? item.action : undefined}>
                        {item.icon} {item.name}
                    </Link>))
                }
                <div>
                    <button
                    className="w-full cursor-pointer flex items-center space-x-2 rounded-lg p-2 text-[var(--text)] hover:bg-[var(--secondary)] transition-colors mt-2"
                    onClick={() => console.log("Logout clicked")}
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