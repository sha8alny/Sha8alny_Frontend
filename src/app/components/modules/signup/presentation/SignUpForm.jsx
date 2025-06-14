"use client";
import ReCAPTCHA from "react-google-recaptcha";

/**
 * @namespace signup
 * @module signup
 */
/**
 * SignUpForm component
 * 
 * This component renders a sign-up form with fields for username, email, password, and an admin checkbox.
 * It includes form validation and a reCAPTCHA for bot protection.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {Object} props.formData - The form data state.
 * @param {Object} props.error - The error state.
 * @param {Function} props.handleSubmit - The function to handle form submission.
 * @param {Function} props.handleChange - The function to handle input changes.
 * @param {boolean} props.isSubmitting - The state indicating if the form is being submitted.
 * @param {Function} props.onRecaptchaChange - The function to handle reCAPTCHA changes.
 * 
 * @example
 * return (
 *   <SignUpForm
 *     formData={formData}
 *     error={error}
 *     handleSubmit={handleSubmit}
 *     handleChange={handleChange}
 *     isSubmitting={isSubmitting}
 *     onRecaptchaChange={onRecaptchaChange}
 *   />
 * )
 */
const SignUpForm = ({
    formData,
    confirmPassword,
    error,
    handleSubmit,
    handleChange,
    isSubmitting,
    onRecaptchaChange,
    onGoogleSignUp,
    showForm,
}) => {

    return(
        <div className="relative flex items-center jusifty-center min-h-screen bg-background flex-col">
        {/* Centered logo that moves left */}
        <div
        className={`absolute transition-transform duration-1000 ease-in-out
            top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            ${showForm ? "lg:-translate-x-[55vw] md:-translate-x-[63vw] sm:-translate-x-[60vw] translate-x-[-52vw] sm:translate-y-[-25vw] translate-y-[-127vw]" : ""} 
            xl:w-250 xl:h-250 md:w-120 md:h-120 w-100 h-100`}
        >
        <img
            src="/lightmode.svg"
            alt="App Logo"
            className="w-full h-full object-contain dark:hidden shadow"
        />
        <img
            src="/darkmode.svg"
            alt="App Logo"
            className="w-full h-full object-contain hidden dark:block"
        />
        </div>
        {/* Form wrapper */}
        <div
        className={`transition-all duration-1000 ease-in-out ${
          showForm
            ? "opacity-100 lg:translate-x-[-15vw] md:translate-x-[-4vw] sm:translate-x-[-15vw] translate-x-[4vw] sm:translate-y-[-5vw] translate-y-[10vh]"
            : "opacity-0 translate-x-full"
        } w-full max-w-md ml-auto z-10`}
      >
            <h2 className="text-3xl font-bold text-center text-secondary mt-30 sm:mr-0 mr-9">Achieve The Best Professional Experience</h2>
            <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary sm:w-115 w-95 mt-9 mb-10">
            <div className="flex items-center justify-center w-30 h-15 text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Sign Up</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="mb-4">
                <label htmlFor="username" className="block text-text text-sm font-semibold mb-2"> Username </label>
                <input
                    data-testid="username-input"
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                {error.username && <p className="text-red-500 mt-1">{error.username}</p>}
                </div>
                <div className="mb-4">
                <label htmlFor="email" className="block text-text text-sm font-semibold mb-2"> Email </label>
                <input
                    data-testid="email-input"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                {error.email && <p className="text-red-500 mt-1">{error.email}</p>}
                
                </div>
                <div className="mb-4">
                <label htmlFor="password" className="block text-text text-sm font-semibold mb-2"> Password </label>
                <input
                    data-testid="password-input"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={8}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                 {error.password && <p className="text-red-500 mt-1">{error.password}</p>}
           
                </div>
                <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-text text-sm font-semibold mb-2"> Confirm Password </label>
                <input
                    data-testid="confirm-password-input"
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={handleChange}
                    minLength={8}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                {error.confirmPassword && <p className="text-red-500 mt-1">{error.confirmPassword}</p>}
                </div>
                <div className="flex justify-between items-center">
                {/* <div className="w-1/3">
                <input
                    data-testid="isAdmin-input"
                    id="isAdmin"
                    type="checkbox"
                    name="isAdmin"
                    value={formData.isAdmin}
                    onChange={handleChange}
                    className=" w-3 h-3 accent-secondary"/>
                <label htmlFor="isAdmin" className="ml-2 text-secondary font-semibold text-sm">Admin</label>
                </div> */}
                <div className="w-1/3">
                <input
                    data-testid="remember-me-input"
                    id="rememberMe"
                    type="checkbox"
                    name="rememberMe"
                    value={formData.rememberMe}
                    onChange={handleChange}
                    className=" w-3 h-3 accent-secondary"/>
                <label htmlFor="rememberMe" className="ml-2 text-secondary font-semibold text-sm">Remember Me</label>
                </div>
                </div>
                <ReCAPTCHA
                    data-testid="recaptcha-input"
                    title="recaptcha"
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onChange={(token) => {
                        onRecaptchaChange(token);
                    }}
                    />

                <button
                    data-testid="submit-button"
                    name="Register"
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
                    data-testid="google-signup-button"
                    type="button"
                    className="w-full bg-secondary hover:opacity-70 text-background font-semibold p-3 rounded-lg transition duration-300"
                    onClick={onGoogleSignUp}>
                  <img src="/google-color-svgrepo-com.svg" alt="Google Logo" className="w-6 h-6 inline-block mr-2.5" />

                    Continue with Google
                </button>
            </form>
            <p className="text-center text-sm text-text mt-4">
                Already A Member?{" "}
                <a href="/signin" className="text-secondary hover:underline" data-testid="signin">
                 Sign In 
                </a>
            </p>
        </div>  
        {/* <div className="mb-30">
        <p className="text-center text-sm text-text mb-10">
        Looking to create a page for a business?{" "}
                <a href="#" className="text-secondary hover:underline">
                 Get Help 
                </a>
            </p>  
            </div>  */}
           </div>
        </div>
    );
};


export default SignUpForm