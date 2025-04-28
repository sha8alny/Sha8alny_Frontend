import VerifiedIcon from '@mui/icons-material/Verified';
const VerifyEmail =() => {
    return(
        <div className="flex items-center justify-center min-h-screen bg-background ">
        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto">
             <h2 className="text-xl font-bold text-center text-secondary">Email Has Been Verified Successfully <VerifiedIcon/></h2>
            </div>
            </div>
            </div>

    )
}


export default VerifyEmail