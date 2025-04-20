
"use client";
import { Button } from "./Button";
const ProfileCard = ({
    name,
    title,
    profilePic,
    coverPic,
    buttonText,
    buttonAction,
    showButton,
    showRemoveButton,
}) => {
return(
    <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-background shadow-lg rounded-lg overflow-hidden border border-secondary">
    <div className="sm:h-35 md:h-40 lg:h-30 rounded-t-lg overflow-hidden">
        {/* // cover image */}
        <div className="relative w-full h-32 sm:h-40 md:h-48">
        <img
        src={coverPic || "https://operaparallele.org/wp-content/uploads/2023/09/Placeholder_Image.png"}
        alt="cover"
        className="w-full h-full object-cover"
        />
        {/* // remove button */}
        {showRemoveButton && (
        <Button className="absolute top-2 right-2 text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200 border-1 border-secondary p-1 h-8 w-8 rounded-full  mt-2"
        data-testid="x-button"
        >✖</Button>
        )}
        
    </div>
    </div>

    <div className="p-4 text-center flex flex-col items-center border-secondary border-t">
        <div className="relative -mt-16 sm:-mt-20 w-24 h-24 md:w-36 md:h-36 sm:w-28 sm:h-28 lg:w-40 lg:h-40"> 
            {/* // profile image */}
            <img 
            src={profilePic || "https://www.gravatar.com/avatar/?d=mp&s=200"}
            alt="profile"
            className="w-full h-full rounded-full border-2 border-secondary object-cover "
            />
        </div>
        <h2 className="text-lg sm:text-md font-semibold text-text mt-2">{name}</h2>
        <p className="text-sm sm:text-md font-thin text-text break-words whitespace-normal max-w-xs sm:max-w-sm ">{title}</p>
        {showButton && (
        <Button 
        data-testid="action-button"
        onClick={buttonAction}
        className="text-background bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors duration-200 mt-2">{buttonText}</Button>
        
        )}
    </div>         
    </div> 
)
}

export default ProfileCard;








