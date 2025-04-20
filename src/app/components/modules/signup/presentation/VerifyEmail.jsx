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
    handleResendEmail

}) => {
    return(
        <div className="flex items-center justify-center min-h-screen bg-background ">
        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Verify Email</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-center w-70 h-5  text-background rounded-full mx-auto">
            <h2 className="text-l font-bold text-center text-text">Enter The Verification Code:</h2>
            </div>
             <div className="flex items-center justify-center w-70 h-15  text-text rounded-full mx-auto">
            <InputOTP 
            data-testid="otp-input"
            maxLength={6}
            value={verifyCode}
            onChange={(value) => setVerifyCode(value )}
            >
            <InputOTPGroup >
                <InputOTPSlot index={0} inputMode="numeric" pattern="[0-9]*" />
                <InputOTPSlot index={1} inputMode="numeric" pattern="[0-9]*" />
                <InputOTPSlot index={2} inputMode="numeric" pattern="[0-9]*"/>
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
                <InputOTPSlot index={3} inputMode="numeric" pattern="[0-9]*"/>
                <InputOTPSlot index={4} inputMode="numeric" pattern="[0-9]*"/>
                <InputOTPSlot index={5} inputMode="numeric" pattern="[0-9]*"/>
            </InputOTPGroup>
            </InputOTP>
            </div>
            {verifyCodeError && (
                <p className="text-red-500 text-sm mt-2">
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
                    Code Expired?
                    <button
                        onClick={handleResendEmail}
                        className="text-secondary font-semibold hover:underline"
                        disabled={loading}>
                            {loading ? "Resending..." : "Resend Code"}

                        </button>

                </p>
                <p className="text-center text-text text-sm mt-4">
                    Incorrect Account Info? 
                    <a href="/signup" className="text-secondary font-semibold hover:underline"> Sign Up</a>
                </p>
            </form>

            </div>
            </div>

    )
}


export default VerifyEmail