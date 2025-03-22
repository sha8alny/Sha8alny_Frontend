
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
    <div className="max-w-xl sm:max-w-2xl md:max-w-lg bg-foreground shadow-lg rounded-lg overflow-hidden border border-secondary">
    <div className="h-30">
        {/* // cover image */}
        <div className="relative h-32 sm:h-40 md:h-48">
        <img
        src={coverPic}
        alt="cover"
        className="w-full h-full object-cover"
        />
        {/* // remove button */}
        <button className="absolute top-2 right-2 bg-None hover:bg-background text-secondary border-1 border-secondary p-1 h-8 w-8 rounded-2xl  mt-2">✖</button>
    </div>
    </div>

    <div className="p-4 text-center flex flex-col flex-wrap justify-center border-secondary border-t">
        <div className="flex justify-center -mt-16 sm:-mt-20"> 
            {/* // profile image */}
            <img 
            src={profilePic}
            alt="profile"
            className="w-35 h-35 sm:h-37 sm:w-37 rounded-full border-2 border-secondary "
            />
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-text ">{name}</h2>
        <p className="text-text text-sm sm:text-base font-thin break-words whitespace-normal w-full">{title}</p>
        {showButton && (
        <button 
        onClick={buttonAction}
        className="bg-None hover:bg-background text-secondary border-1 border-secondary p-2 rounded-lg mt-2">{buttonText}</button>
        )}
    </div>         
    </div> 
)
}

export default ProfileCard;








