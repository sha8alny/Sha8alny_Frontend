"use client";
import Link from 'next/link'
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import EditIcon from '@mui/icons-material/Edit';


function SideBar({menuItems=[], pathname, setActive, isModalOpen, setModalOpen, onChangeCover,  onChangeLogo, coverpreview, logoPreview, triggerCoverInput,  triggerLogoInput,  coverInputRef,  logoInputRef,username}){
    return (
        <aside className="w-70px flex flex-col mt-5 mx-5 space-y-4 border border-[var(--secondary)] rounded-lg p-4">
            {/*Logo and cover image for company*/}
            <div className="relative">
                <img src={coverpreview || "/siemens_cover.jpg"}  alt="company-cover" height={120} width={250} className="rounded-lg h-[120px] w-[250px] object-cover"/>

                <label htmlFor="upload-cover" className="absolute bottom-2 right-2 cursor-pointer group p-2 bg-gray-800 rounded-full">
                    <CameraAltRoundedIcon/>
                    <span className="absolute top-full left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Edit logo
                    </span>
                </label>
                <input id="upload-cover" type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" ref={coverInputRef} onChange={onChangeCover}/>
            </div>
            <div  className="relative">
                <div className="absolute left-4 bottom-[-20px]">
                    <img src={logoPreview ||"/siemens_logo.jpg"} alt="company-logo" width={80} height={80} className="rounded-lg"/>
                    <label htmlFor="upload-logo" className="absolute bottom-[-6px] right-[-8px] cursor-pointer group p-1 bg-gray-800 rounded-full">
                        <EditIcon style={{fontSize:"20px"}}/>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Edit cover image
                        </span>
                    </label>
                    <input id="upload-logo" type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" ref={logoInputRef} onChange={onChangeLogo}/>
                </div>
            </div>
            {/*Company name*/}
            <div>
                <div className="mt-4 mb-1 border-b border-[var(--secondary)] pb-2 w-full">
                    <p className="text-lg font-semibold w-full">{username ? username.charAt(0).toUpperCase() + username.slice(1): "Company Name"}</p>
                    <p className="text-xs text-gray-300"> 7,472,293 followers</p>
                </div>
                <div className="border-b border-[var(--secondary)] pb-2 flex flex-row justify-between items-center">
                    <button className="flex items-center gap-2 group cursor-pointer w-fit px-2 py-1 rounded-md transition-all relative" onClick={()=>setModalOpen("create")}>
                        <AddIcon className="transition-transform duration-200 group-hover:scale-110"/>
                        <span className="absolute left-full ml-2 bg-gray-800 text-white text-xs px-2 py-1  opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm">Create </span>
                    </button>
                    <div className="flex items-center gap-2 group cursor-pointer w-fit px-2 py-1 rounded-md transition-all">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">View as member</span>
                        <VisibilityIcon className="transition-transform duration-200 group-hover:scale-110"/>
                    </div>
                </div>
            </div>
            {/*List of items in dashboard*/}
            <nav className="">
                {menuItems.map((item)=>(
                    <Link key={item.name} href={item.href} className={`group hover:bg-[var(--foreground)] hover:rounded-lg flex items-center gap-2 p-2 ${pathname===item.href ? "bg-[var(--secondary)] rounded-lg" :"hover:bg-[var(--foreground)]"}`} onClick={item.action ? item.action :() => setActive(item.name)} >
                        {item.icon} {item.name}
                    </Link>))
                }
                <button className="relative flex justify-end items-center cursor-pointer group">
                    <LogoutIcon />
                    <span className="absolute top-full mt-1 right-1/600 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 text-white text-xs transition-opacity duration-200 ">
                        Logout
                    </span>
                </button>
            </nav>
        </aside>
    );
}

export default SideBar;