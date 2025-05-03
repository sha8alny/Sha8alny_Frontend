"use client";

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "../../../ui/Input-otp"


const VerifyEmail =({
    verifyCode,
    setVerifyCode,
    handleSubmit,
    loading,
    verifyCodeError,
    isFormValid,
    handleResendEmail,
    emailToVerify

}) => {
    return(
        <div className="relative flex items-center justify-center min-h-screen bg-background ">
        <div className="absolute top-1/2 left-1/2 transform lg:-translate-x-[55vw] md:-translate-x-[60vw] sm:-translate-x-[60vw] translate-x-[-49vw] xl:translate-y-[-31vw] md:translate-y-[-30vw] sm:translate-y-[-32vw] translate-y-[-120vw] 
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
        <div className="w-full max-w-md ml-auto xl:translate-x-[-13vw] md:translate-x-[2vw] sm:translate-x-[-10vw] translate-x-[3.5vw] xl:translate-y-[2vw] md:translate-y-[2vw] sm:translate-y-[13vw] translate-y-[10vh] opacity-100 z-10">
   
        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Verify Email</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <h2 className="text-sm font-bold text-center text-text">We have sent a verification code to <strong className="text-secondary hover:underline">{emailToVerify}</strong></h2>
            <div className="flex items-center justify-center w-70 h-5  text-background rounded-full mx-auto">
            <h2 className="text-l font-bold text-center text-text">Enter The Verification Code:</h2>
            </div>
             <div className="flex items-center justify-center w-70 h-15  text-text rounded-full mx-auto">
            <InputOTP 
            maxLength={6}
            value={verifyCode}
            onChange={(value) => setVerifyCode(value )}
            >
            <InputOTPGroup >
                <InputOTPSlot data-testid="otp-input-0" index={0} inputMode="numeric" pattern="[0-9]*" />
                <InputOTPSlot data-testid="otp-input-1" index={1} inputMode="numeric" pattern="[0-9]*" />
                <InputOTPSlot data-testid="otp-input-2" index={2} inputMode="numeric" pattern="[0-9]*"/>
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot data-testid="otp-input-3" index={3} inputMode="numeric" pattern="[0-9]*"/>
                <InputOTPSlot data-testid="otp-input-4" index={4} inputMode="numeric" pattern="[0-9]*"/>
                <InputOTPSlot data-testid="otp-input-5" index={5} inputMode="numeric" pattern="[0-9]*"/>
            </InputOTPGroup>
            </InputOTP>
            </div>
            {verifyCodeError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                    {verifyCodeError}
                </p>
            )}

                <button
                    data-testid="verify-button"
                    type="submit"
                    className={`bg-secondary text-background rounded-md px-4 py-2 hover:bg-secondary-light transition duration-300 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading || !isFormValid}
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
                <p className="text-center flex flex-col text-text text-sm mt-4">
                    Code Expired or Didn't Recieve an Email?
                    <button
                        onClick={handleResendEmail}
                        className="text-secondary font-semibold hover:underline"
                        disabled={loading}>
                            {loading ? "Resending..." : "Resend Email"}

                        </button>

                </p>
                <p className="text-center text-text text-sm mt-4">
                If you still didn't receive the email, please make sure you entered the correct email address.
                </p>
                <p className="text-center text-text text-sm mt-4">
                    Incorrect Account Info? 
                    <a href="/signup" className="text-secondary font-semibold hover:underline"> Sign Up</a>
                </p>
            </form>

            </div>
            </div>
        </div>

    )
}


export default VerifyEmail