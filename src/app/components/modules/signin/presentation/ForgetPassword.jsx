"use client";


const ForgetPassword = ({
    handleSubmit,
    handleChange,
    email,
    error,
    loading,
}) => {

return (
        <div className="flex items-center justify-center min-h-screen bg-background ">
        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Forget Password</h2>
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
    )
}

export default ForgetPassword;