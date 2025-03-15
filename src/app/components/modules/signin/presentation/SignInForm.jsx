"use client";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";


const SignInForm = ({handleSubmit,isSubmitting}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [recaptcha, setRecaptcha] = useState("");

    
    const onSubmit = (e) => {
        e.preventDefault();
        handleSubmit({email, password, recaptcha});
    };

return(
    <div className="flex items-center justify-center min-h-screen bg-background ">
        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-30 h-15  text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Sign In</h2>
            </div>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="mb-4">
                <label className="block text-text text-sm font-semibold mb-2"> Email </label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                </div>
                <div className="mb-4">
                <label className="block text-text text-sm font-semibold mb-2"> Password </label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                </div>
                <div>
                <input
                    type="checkbox"
                    // value={rememberMe}
                    // onChange={(e) => setRememberMe(e.target.checked)}
                    className=" w-4 h-4 accent-secondary"/>
                <label htmlFor="rememberMe" className="ml-2 text-text text-sm">Remember Me</label>
                <a href="#" className="ml-22 text-left text-secondary hover:underline text-sm">
                 Forget password?
                </a>
                </div>
                <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={(value) => setRecaptcha(value)}
                    />
                <button
                    type="submit"
                    className="w-full bg-secondary hover:opacity-70 text-background font-semibold p-3 rounded-lg transition duration-300"
                    disabled={isSubmitting}>
                        {isSubmitting ? "Signing In..." : "Sign In"}
                  </button>
                <div className="flex items-center ">
                <div className="flex-grow h-px bg-gray-300"></div>
                <span className="px-2 text-gray-500 text-sm">Or</span>
                <div className="flex-grow h-px bg-gray-300"></div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-secondary hover:opacity-70 text-background font-semibold p-3 rounded-lg transition duration-300">
                  <img src="/google-color-svgrepo-com.svg" alt="Google Logo" className="w-6 h-6 inline-block mr-2.5" />

                    Continue with Google
                </button>
            </form>
            <p className="text-center text-sm text-text mt-4">
                New shaغalny member?{""}
                <a href="#" className="text-secondary hover:underline">
                 join the community 
                </a>
            </p>
        </div>
    </div>
);
};

export default SignInForm;