
"use client";
import { Button } from "./Button";
import {  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel  } from "./AlertDialog";
import { useEffect,useState } from "react";
import { getConnectionMutuals } from "@/app/services/connectionManagement";
const ProfileCard = ({
    username,
    name,
    title,
    profilePic,
    coverPic,
    numberOfConnections,
    buttonText,
    buttonAction,
    showButton,
    showRemoveButton,
    onRemove,
    removeLoading,
    openDeleteDialog,
    setOpenDeleteDialog,
    getConnectionDegree,
    type
}) => {
    const [mutualConnections, setMutualConnections] = useState({ count: 0, connections: [] });  
    useEffect(() => {
        if(type === "applicant") return;
        const fetchMutualConnections = async () => {
          const mutuals = await getConnectionMutuals(username);
          setMutualConnections(mutuals);
        };
        fetchMutualConnections();
      }, [getConnectionMutuals, username]);
    
return(
    <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-background shadow-lg rounded-lg overflow-hidden border ">
    <div className="h-28 sm:h-32 md:h-37 lg:h-27 rounded-t-lg overflow-hidden">
        {/* // cover image */}
        <div className="relative w-full h-32 sm:h-40 md:h-48">
        <img
        src={coverPic || "https://operaparallele.org/wp-content/uploads/2023/09/Placeholder_Image.png"}
        alt="cover"
        className="w-full h-full object-cover"
        />
        {/* // remove button */}
        {showRemoveButton && (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogTrigger asChild>
        <Button className="absolute top-2 right-2 text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200 border-1 border-secondary p-1 h-8 w-8 rounded-full  mt-2 text-sm"
        data-testid="x-button"
        onClick={()=>setOpenDeleteDialog(true)}
        >✖</Button>
        </AlertDialogTrigger>
        <AlertDialogContent >
        <AlertDialogHeader>
        <AlertDialogTitle className="text-secondary">Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription className="text-text">
        This action cannot be undone. This will permanently delete this account from your network. </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
        <AlertDialogCancel 
        className=" bg-foreground rounded-2xl font-semibold cursor-pointer hover:bg-primary/70 dark:bg-foreground dark:hover:bg-red-300 hover:text-background text-text"
        onClick={() => {
            setOpenDeleteDialog(false);
        }}
        data-testid="cancel-button"
        >Cancel</AlertDialogCancel>
        <button
        data-testid="confirm-delete"
        onClick={onRemove}
        disabled={removeLoading}
        className="bg-secondary rounded-2xl text-background hover:bg-secondary/80 text-sm font-semibold p-2"
        >
        {removeLoading ? "Removing..." : "Confirm Remove"}
        
        </button>
        </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
        )}

        
    </div>
    </div>

    <div className="p-4 text-center flex flex-col items-center ">
        <div className="relative -mt-12 sm:-mt-16 w-20 h-20 md:w-32 md:h-32 sm:w-24 sm:h-24 lg:w-36 lg:h-36"> 
            {/* // profile image */}
            <a
            data-testid="profile-link"
            href={`/u/${username}`}>
           <img 
            src={profilePic || "https://www.gravatar.com/avatar/?d=mp&s=200"}
            alt="profile"
            className="w-full h-full rounded-full border-2 object-cover "
            />
            </a>
        </div>
        <a href={`/u/${username}`} data-testid="profile-route" className="text-lg sm:text-md font-semibold text-text mt-2">{name} 
        {getConnectionDegree && <span className="text-sm font-bold text-muted-foreground"> •{getConnectionDegree}</span>}</a>
        <p className="text-sm sm:text-md font-thin text-text break-words whitespace-normal max-w-xs sm:max-w-sm ">{title}</p>
        {(!(type === "applicant"))&& (mutualConnections?.count !== undefined)&& (
        <p className="text-xs sm:text-sm font-semibold text-secondary break-words whitespace-normal max-w-xs sm:max-w-sm ">{mutualConnections.count > 10 ? '10+' : mutualConnections.count} mutual connections</p>
        )}
        <p className="text-xs sm:text-sm font-bold text-secondary break-words whitespace-normal max-w-xs sm:max-w-sm ">{numberOfConnections} connections</p>
        {showButton && (
        <Button 
        data-testid="action-button"
        onClick={buttonAction}
        className="text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200 mt-2 text-sm px-3 py-1">{buttonText}</Button>
        
        )}
    </div>         
    </div> 
)
}

export default ProfileCard;








