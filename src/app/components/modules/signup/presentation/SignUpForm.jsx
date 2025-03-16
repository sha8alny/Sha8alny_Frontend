"use client";
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from "react";


const SignUpForm = ({handleSubmit, isSubmitting}) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptcha, setRecaptcha] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validateEmail=(value)=>{
        setEmail(value);
        if(!emailRegex.test(value)){
            setEmailError("Please enter a valid email address.")
        }else{
            setEmailError("");
        }
    };
    const validatePassword = (value)=>{
        setPassword(value);
        if(value.length<6){
            setPasswordError("Password must be 6 characters or more");
        }else{
            setPasswordError("")
        };
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if (emailError || passwordError) return;
        handleSubmit({username, email, password, recaptcha});
    };
    return(
        <div className="flex items-center jusifty-center min-h-screen bg-background flex-col">
            <h2 className="text-3xl font-bold text-center text-secondary mt-30">Achieve The Best Professional Experience</h2>
            <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-115 mt-9 mb-10">
            <div className="flex items-center justify-center w-30 h-15  text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Sign Up</h2>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="mb-4">
                <label className="block text-text text-sm font-semibold mb-2"> Username </label>
                <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                </div>
                <div className="mb-4">
                <label className="block text-text text-sm font-semibold mb-2"> Email </label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                {emailError && <p className="text-red-500 mt-1">{emailError}</p>}
                
                </div>
                <div className="mb-4">
                <label className="block text-text text-sm font-semibold mb-2"> Password </label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => validatePassword(e.target.value)}
                    minLength={6}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                 {passwordError && <p className="text-red-500 mt-1">{passwordError}</p>}

                </div>
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={(value) => setRecaptcha(value)}
                    />

                <button
                    type="submit"
                    className="w-full bg-secondary hover:opacity-70 text-background font-semibold p-3 rounded-lg transition duration-300"
                    disabled={isSubmitting}
                    >
                    {isSubmitting? "Registering...": "Register"}
                </button>
                <div className="flex items-center ">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-2 text-gray-500 text-sm">Or</span>
                <div className="flex-grow h-px bg-gray-300"></div>
                </div>
                <button
                    type="button"
                    className="w-full bg-secondary hover:opacity-70 text-background font-semibold p-3 rounded-lg transition duration-300"
                    onClick={()=>alert("Google Sign In coming soon")}>
                  <img src="/google-color-svgrepo-com.svg" alt="Google Logo" className="w-6 h-6 inline-block mr-2.5" />

                    Continue with Google
                </button>
            </form>
            <p className="text-center text-sm text-text mt-4">
                Already A Member?{""}
                <a href="/signin" className="text-secondary hover:underline">
                 sign in 
                </a>
            </p>
        </div>  
        <div className="mb-30">
        <p className="text-center text-sm text-text mb-10">
        Looking to create a page for a business?{""}
                <a href="#" className="text-secondary hover:underline">
                 Get Help 
                </a>
            </p>  
            </div> 
           </div>
    );
};


export default SignUpForm