export default function LandingPage({goToSignIn, goToSignUp, handleGoogleLogIn}){
    return(
        <div className="flex flex-1 flex-col-reverse md:flex-row items-center justify-center p-8">
            {/*Left section*/}
            <div className="w-full md:w-1/2 flex flex-col items-start justify-center space-y-6 max-w-xl">
                <h1 className="text-5xl text-text font-xl ">Welcome to your professional community</h1>
                <div className="text-text flex flex-col space-y-4 w-full max-w-md">
                    <button className="flex items-center justify-center rounded-full w-full border border-text p-3 cursor-pointer font-medium hover:bg-secondary hover:border-secondary transition-all" onClick={handleGoogleLogIn}>
                    <img src="/google-color-svgrepo-com.svg" alt="Google Logo" className="w-6 h-6 inline-block mr-2.5" />Continue with Google</button>
                    <button className="flex items-center justify-center rounded-full w-full border border-text p-3 cursor-pointer font-medium hover:bg-secondary hover:border-secondary transition-all" onClick={goToSignIn}>Sign in with email</button>
                </div>
                <div className="items-center justify-center text-center max-w-md">
                    <p className="text-sm text-muted-foreground">By clicking Continue to join or sign in, you agree to Shaغalny's 
                        <a href="/user-agreement" className="text-secondary hover:underline transition-all duration-150 cursor-pointer "> User Agreement, </a>
                        <a href="/privacy-policy" className="text-secondary hover:underline transition-all duration-150 cursor-pointer">Privacy Policy, </a> and  
                        <a href="/cookie-policy" className="text-secondary hover:underline transition-all duration-150 cursor-pointer"> Cookie Policy.</a></p>
                    <p className="text-text pt-4">New to Shaغalny? <span className="text-secondary cursor-pointer hover:underline transition-all duration-150 cursor-pointer" onClick={goToSignUp}>Join now</span></p>
                </div>
            </div>
            {/*Right section*/}
            <div className="flex justify-center w-full md:w-1/2">
                <img src="/Landing.png" alt="Landing Image" className="w-[700px] min-h-68 "/>
            </div>
        </div>
    );
}