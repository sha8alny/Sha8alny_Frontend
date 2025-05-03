export default function LandingPage({goToSignIn, goToSignUp, handleGoogleLogIn}){
    return(
        <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 py-12 md:py-20 gap-10 max-w-7xl mx-auto">
            {/*Left section*/}
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center space-y-6 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-xl text-text ">Welcome to your professional community</h1>
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
            <div className="flex justify-center w-full md:w-1/2 md:flex hidden">
                <img src="/Landing.png" alt="Landing Image" className="w-full max-w-[500px] md:max-w-[600px] lg:max-w-[700px] h-auto"/>
            </div>
        </div>
    );
}