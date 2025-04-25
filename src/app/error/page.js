import NewReleasesIcon from '@mui/icons-material/NewReleases';
const VerifyError =() => {
    return(
        <div className="flex items-center justify-center min-h-screen bg-background ">
        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto">
             <h2 className="text-xl font-bold text-center text-text">Error in verification Or Email already verified <NewReleasesIcon className='text-red-500'/></h2>
            </div>
            </div>
            </div>

    )
}


export default VerifyError