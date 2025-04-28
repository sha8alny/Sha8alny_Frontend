"use client";
import LandingPage from "../presentation/LandingPage";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { handleGoogleSignIn } from "../../../../services/userManagement";
import { auth, provider } from "@/firebase/firebase";

export default function LandingPageContainer(){
    const router = useRouter();

    const goToSignIn =()=>{
        router.push(`/signin`);
    }
    const goToSignUp =()=>{
        router.push(`/signup`);
    }

      const handleGoogleLogIn = async () => {
        try{
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const token = await user.getIdToken(true);
    
            const loginResult = await handleGoogleSignIn(token);
            if (loginResult.success) {
                toast("Welcome back!");
                setTimeout(() => {
                  if (isCompleteProfile === "false") {
                    router.push("/complete-profile");
                    return;
                  }
                  const redirectPath = Auth.getRedirectPath();
                  Auth.clearRedirectPath();
                  router.push(redirectPath);
                }, 3000);
            } else {
                toast("Error signing in with Google. Please try again.", false);
            }
        }catch(error){
            console.error("Error signing in with Google:", error);
            toast("Error signing in with Google. Please try again.", false);
        }
    };

    return(
        <div>
            <LandingPage goToSignIn={goToSignIn} goToSignUp={goToSignUp} handleGoogleLogIn={handleGoogleLogIn}/>
        </div>
    );
}