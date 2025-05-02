"use client";
import Link from 'next/link'
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent } from "@/app/components/ui/Card";
import { Tooltip, TooltipTrigger, TooltipContent } from '@/app/components/ui/Tooltip';
import { Button } from '@/app/components/ui/Button';
import ClearIcon from '@mui/icons-material/Clear';
import { Upload, Trash2 } from 'lucide-react';
import Image from 'next/image';

/**
 * SideBar component displays a sidebar with a company's details, logo, cover image,
 * and various navigation menu items. It allows the user to edit the company's logo and
 * cover image, and provides options to view the company as a member, create new content, 
 * and log out.
 *
 * @namespace Sidebar
 * @component
 * 
 * @param {Object} props - The props for the SideBar component.
 * @param {Object} props.company - The company details.
 * @param {Array} props.menuItems - The list of menu items to display in the sidebar.
 * @param {Function} props.isActive - A function that determines if a menu item is active.
 * @param {Function} props.setModalOpen - A function to open the modal for creating new content.
 * @param {Function} props.onChangeCover - Function to handle changing the cover image.
 * @param {Function} props.onChangeLogo - Function to handle changing the logo image.
 * @param {Object} props.coverInputRef - Ref for the cover image input element.
 * @param {Object} props.logoInputRef - Ref for the logo image input element.
 * @param {Function} props.OpenCompanyUserPage - Function to navigate to the company user page.
 * @param {Function} props.handleLogout - Function to handle user logout.
 * @param {Function} props.onRemoveLogo - Function to remove the company logo.
 * @param {Function} props.onRemoveCover - Function to remove the company cover image.
 * 
 * @returns {JSX.Element} The rendered SideBar component.
 */


export default function SideBar({company, menuItems=[], isActive, setModalOpen, onChangeCover,  onChangeLogo, coverInputRef,  logoInputRef, OpenCompanyUserPage, handleLogout, onRemoveLogo, onRemoveCover}){
    const [isEditingLogo, setIsEditingLogo] = useState(false)
    const [isEditingCover, setIsEditingCover] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    return (
        <aside className="bg-[var(--foreground)] text-text w-70px flex flex-col mt-5 mx-3 space-y-4 border rounded-lg p-4">
            {/*Logo and cover image for company*/}
            <div className="relative mb-0 max-h-[160px]">
                <div className="w-full h-[120px] bg-gray-700 rounded-lg flex justify-center items-center overflow-hidden  relative">
                    {/*Cover */}
                    <img src={company?.cover || "/placeholder.svg"} alt="cover" className="w-full h-full" />
                    <div className="absolute right-2 top-2 flex gap-2">
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-foreground backdrop-blur-sm cursor-pointer" onClick={() => setIsEditingCover(true)}>
                                <CameraAltRoundedIcon className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit cover image</TooltipContent>
                        </Tooltip>

                        {company?.cover && onRemoveCover && (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full bg-red-500/80 backdrop-blur-sm cursor-pointer" onClick={onRemoveCover}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove cover image</TooltipContent>
                        </Tooltip>
                        )}
                    </div>
                </div>
                <input id="upload-cover" type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" ref={coverInputRef} onChange={onChangeCover} />
                <div className="absolute left-4 bottom-[50px] w-[80px] h-[80px] bg-gray-700 rounded-lg flex justify-center items-center overflow-hidden relative">
                    {/*Logo */}
                    <img src={company?.logo || "/placeholder.svg"} alt="logo" className="w-24 h-24 object-cover rounded-lg"/>
                    <div className="absolute right-0 bottom-0 flex gap-1 p-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="secondary" className="h-6 w-6 rounded-full bg-foreground backdrop-blur-sm cursor-pointer" onClick={() => setIsEditingLogo(true)}>
                                    <EditIcon style={{ fontSize: "14px" }} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit logo</TooltipContent>
                        </Tooltip>

                        {company?.logo && onRemoveLogo && (
                            <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size="icon" variant="destructive" className="h-6 w-6 rounded-full bg-red-500/80 backdrop-blur-sm cursor-pointer" onClick={onRemoveLogo}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove logo</TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <input id="upload-logo" data-testid="upload-logo" type="file" className="hidden" accept="image/png, image/jpg, image/jpeg" ref={logoInputRef} onChange={onChangeLogo} />
            </div>

            {/* Logo Edit Modal */}
            {isEditingLogo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 rounded-lg">
                    <Card className="w-full max-w-md bg-foreground">
                    <CardContent className="p-4 ">
                        <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-medium">Edit Logo</h3>
                        <Button className="cursor-pointer" size="icon" variant="ghost" onClick={() => setIsEditingLogo(false)}>
                            <ClearIcon className="h-4 w-4" />
                        </Button>
                        </div>

                        <div className="mb-4">
                        <div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-lg border bg-gray-50">
                            {company?.logo ? (
                            <Image src={company?.logo || "/placeholder.svg"} alt="Logo preview" width={128} height={128} className="h-full w-full object-cover"/>
                            ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <p className="text-sm text-muted-foreground">No logo selected</p>
                            </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <input ref={logoInputRef} type="file" accept="image/png, image/jpg, image/jpeg" onChange={onChangeLogo} className="hidden" id="logo-upload"/>
                            <Button variant="default" onClick={() => logoInputRef.current?.click()} className="w-full bg-secondary cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Logo
                            </Button>
                            <Button variant="outline" className="cursor-pointer" onClick={() => setIsEditingLogo(false)} disabled={isLoading}>
                                Cancel
                            </Button>
                        </div>
                        </div>
                    </CardContent>
                    </Card>
                </div>
            )}

            {/* Cover Edit Modal */}
            {isEditingCover && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 rounded-lg">
                <Card className="w-full max-w-md bg-foreground">
                <CardContent className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-medium">Edit Cover Image</h3>
                    <Button className="cursor-pointer" size="icon" variant="ghost" onClick={() => setIsEditingCover(false)}>
                        <ClearIcon className="h-4 w-4" />
                    </Button>
                    </div>

                    <div className="mb-4">
                    <div className="mx-auto mb-4 h-40 w-full overflow-hidden rounded-lg border bg-gray-50">
                        {company?.cover ? (
                        <Image src={company?.cover || "/placeholder.svg"} alt="Cover preview" width={400} height={160} className="h-full w-full object-cover"/>
                        ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <p className="text-sm text-muted-foreground">No cover image selected</p>
                        </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <input ref={coverInputRef} type="file" accept="image/png, image/jpg, image/jpeg" onChange={onChangeCover}  className="hidden" id="cover-upload"/>
                        <Button variant="default" onClick={() => coverInputRef.current?.click()} className="w-full bg-secondary cursor-pointer">
                            <Upload className="mr-2 h-4 w-4" />
                                Upload Cover Image
                            </Button>
                        <Button variant="outline" className="cursor-pointer" onClick={() => setIsEditingCover(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </CardContent>
            </Card>
            </div>
            )}

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