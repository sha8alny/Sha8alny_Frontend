
"use client";
const ProfileCard = ({
    name,
    title,
    profilePic,
    coverPic,
    buttonText,
    showButton
}) => {
return(
    <div className="w-[250px] bg-foreground shadow-lg rounded-lg overflow-hidden border border-secondary">
    <div className="h-30">
        {/* // cover image */}
        <img
        src={coverPic}
        alt="cover"
        className="w-full h-full object-cover"
        />
        {/* // remove button */}
        <button className="ml-51 bg-None hover:bg-background text-secondary border-1 border-secondary p-1 h-8 w-8 rounded-2xl  mt-2">✖</button>
    </div>

    <div className="p-4 text-center flex flex-col flex-wrap justify-center border-secondary border-t">
        <div className="flex justify-center mb-0 mt-0 h-20"> 
            {/* // profile image */}
            <img 
            src={profilePic}
            alt="profile"
            className="w-35 h-35 rounded-full border-2 border-secondary  left-1/2 transform  -translate-y-1/2 -top-10"
            />
        </div>
        <h2 className="text-2xl font-semibold text-text ">{name}</h2>
        <p className="text-text text-sm font-thin break-words whitespace-normal w-full">{title}</p>
        {showButton && (
        <button className="bg-None hover:bg-background text-secondary border-1 border-secondary p-2 rounded-lg mt-2">{buttonText}</button>
        )}
    </div>         
    </div> 
)
}

export default ProfileCard;








