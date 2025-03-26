
"use client";
const ProfileCard = ({
    name,
    title,
    profilePic,
    coverPic,
    buttonText,
    buttonAction,
    showButton
}) => {
return(
    <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-foreground shadow-lg rounded-lg overflow-hidden border border-secondary">
    <div className="h-30">
        {/* // cover image */}
        <div className="relative w-full h-32 sm:h-40 md:h-48">
        <img
        src={coverPic}
        alt="cover"
        className="w-full h-full object-cover"
        />
        {/* // remove button */}
        <button className="absolute top-2 right-2 bg-transparent hover:bg-background text-secondary border-1 border-secondary p-1 h-8 w-8 rounded-full  mt-2">✖</button>
    </div>
    </div>

    <div className="p-4 text-center flex flex-col items-center border-secondary border-t">
        <div className="relative -mt-16 sm:-mt-20 w-24 h-24 sm:w-36 sm:h-36"> 
            {/* // profile image */}
            <img 
            src={profilePic}
            alt="profile"
            className="w-full h-full rounded-full border-2 border-secondary object-cover "
            />
        </div>
        <h2 className="text-lg sm:text-2xl font-semibold text-text mt-2">{name}</h2>
        <p className="text-sm sm:text-base font-thin text-text break-words whitespace-normal max-w-xs sm:max-w-sm ">{title}</p>
        {showButton && (
        <button 
        onClick={buttonAction}
        className="bg-transparent hover:bg-background text-secondary border-1 border-secondary p-2 rounded-lg mt-2 transition duration-300">{buttonText}</button>
        )}
    </div>         
    </div> 
)
}

export default ProfileCard;








