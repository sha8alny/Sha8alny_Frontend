"use client";

/**
 * ForgetPassword component displays a form for users to request a password reset.
 * Handles user input for the email field and provides a submit button to trigger the reset process.
 *
 * @namespace signin
 * @module signin
 * @component
 *
 * @param {Object} props - The component props.
 * @param {string} props.email - The current value of the email input field.
 * @param {Function} props.setEmail - Function to update the email input field.
 * @param {boolean} props.loading - Indicates whether the password reset request is in progress.
 * @param {string|null} props.error - Error message related to the email input, if any.
 * @param {Function} props.handleChange - Function to handle changes in the email input field.
 * @param {Function} props.handleSubmit - Function to handle the form submission for password reset.
 *
 * @returns {JSX.Element} The ForgetPassword component.
 */
const ForgetPassword = ({
    handleSubmit,
    handleChange,
    email,
    error,
    loading,
}) => {

return (
        <div className="relative items-center justify-center min-h-screen bg-background ">
        <div className="absolute top-1/2 left-1/2 transform lg:-translate-x-[55vw] md:-translate-x-[63vw] sm:-translate-x-[60vw] translate-x-[-49vw] xl:translate-y-[-31vw] md:translate-y-[-20vw] sm:translate-y-[-32vw] translate-y-[-120vw] 
            xl:w-250 xl:h-250 md:w-120 md:h-120 w-100 h-100">
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
        <div className="w-full max-w-md ml-auto xl:translate-x-[-13vw] md:translate-x-[-5vw] sm:translate-x-[-10vw] translate-x-[3.5vw] xl:translate-y-[13vw] md:translate-y-[15vw] sm:translate-y-[13vw] translate-y-[35vh] opacity-100 z-10">
   
        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Forgot Password</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <input
                    data-testid="email-input"
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                    required
                />

                {error && (
                    <p className="text-red-500 text-sm mt-2">
                        {error}
                    </p>
                )}
                
                <button
                        data-testid="submit-button"
                        type="submit"
                        className={`bg-secondary text-background rounded-md px-4 py-2 hover:bg-secondary-light transition duration-300 ${
                            loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Code"}
                    </button>
                <p className="text-center text-text text-sm mt-4">
                    Remembered your password? 
                    <a href="/signin" className="text-secondary font-semibold hover:underline"> Sign In</a>
                </p>
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
    )
}

export default ForgetPassword;