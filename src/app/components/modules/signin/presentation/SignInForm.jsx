"use client";

/**
 * @namespace signin
 * @module signin
 */
/**
 * SignInForm component
 * 
 * This component renders a sign-in form with fields for email, password, and a "Remember Me" checkbox.
 * It includes form validation and handles input changes.
 * 
 * @component
 * @param {Object} props - The properties object.
 * @param {string} props.email - The email entered by the user.
 * @param {Function} props.setEmail - The function to set the email state.
 * @param {string} props.password - The password entered by the user.
 * @param {Function} props.setPassword - The function to set the password state.
 * @param {boolean} props.rememberMe - The state indicating if the "Remember Me" checkbox is checked.
 * @param {Function} props.setRememberMe - The function to set the "Remember Me" state.
 * @param {Function} props.handleSubmit - The function to handle form submission.
 * @param {boolean} props.isSubmitting - The state indicating if the form is being submitted.
 * 
 * @example
 * return (
 *   <SignInForm
 *     email={email}
 *     setEmail={setEmail}
 *     password={password}
 *     setPassword={setPassword}
 *     rememberMe={rememberMe}
 *     setRememberMe={setRememberMe}
 *     handleSubmit={handleSubmit}
 *     isSubmitting={isSubmitting}
 *   />
 * )
 */

const SignInForm = ({
    email,
    password,
    rememberMe,
    setRememberMe,
    handleSubmit,
    isSubmitting,
    error,
    handleChange,
    handleGoogleSignIn,
    showForm,
}) => {

return(
    <div className="relative flex items-center justify-center min-h-screen bg-background ">
            {/* Centered logo that moves left */}
            <div
        className={`absolute transition-transform duration-1000 ease-in-out
            top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            ${showForm ? "lg:-translate-x-[55vw] md:-translate-x-[67vw] sm:-translate-x-[60vw] translate-x-[-52vw] sm:translate-y-[-32vw] translate-y-[-120vw]" : ""} 
            xl:w-250 xl:h-250 md:w-150 md:h-150 w-100 h-100`}
        >
        <img
          src="/lightmode.svg"
          alt="App Logo"
          className="w-full h-full object-contain dark:hidden"
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
            ? "opacity-100 sm:translate-x-[20vw] translate-x-0 sm:translate-y-0 translate-y-[10vh]"
            : "opacity-0 translate-x-full"
        } w-full max-w-md ml-auto z-10`}
      >

        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-30 h-15  text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Sign In</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="mb-4">
                <label htmlFor="email" className="block text-text text-sm font-semibold mb-2"> Email </label>
                <input
                    data-testid="email-input"
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
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
                    placeholder="Password"
                    value={password}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                />
                {error.password && <p className="text-red-500 mt-1">{error.password}</p>}
                </div>
                <div>
                <input
                    data-testid="remember-me-checkbox"
                    id="rememberMe" 
                    type="checkbox"
                    value={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className=" w-3 h-3 accent-secondary"/>
                <label htmlFor="rememberMe" className="ml-2 text-text text-sm">Remember Me</label>
                <a href="/forget-password" className="ml-20 text-left text-secondary hover:underline text-sm">
                 Forget password?
                </a>
                </div>
                <button
                    data-testid="submit-button"
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
                    data-testid="google-signin-button"
                    type="button"
                    className="w-full bg-secondary hover:opacity-70 text-background font-semibold p-3 rounded-lg transition duration-300"
                    onClick={handleGoogleSignIn}>
                  <img src="/google-color-svgrepo-com.svg" alt="Google Logo" className="w-6 h-6 inline-block mr-2.5" />

                    Continue with Google
                </button>
            </form>
            <p className="text-center text-sm text-text mt-4">
                New shaغalny member?{" "}
                <a href="/signup" className="text-secondary hover:underline">
                 Join the community 
                </a>
            </p>
        </div>
        </div>
        </div>
);
};

export default SignInForm;