"use client";

import { Target } from "lucide-react";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "../../../ui/Input-otp"


const ResetPassword =({
    newPassword,
    resetCode,
    handleChange,
    handleSubmit,
    loading,
    passwordError,
    resetCodeError,
    isFormValid

}) => {
    return(
        <div className="flex items-center justify-center min-h-screen bg-background ">
        <div className="bg-foreground p-8 rounded-lg shadow-2xl shadow-secondary w-96">
            <div className="flex items-center justify-center w-70 h-15  text-background rounded-full mx-auto">
             <h2 className="text-3xl font-bold text-center text-secondary">Reset Password</h2>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <div className="flex items-center justify-center w-70 h-5  text-background rounded-full mx-auto">
            <h2 className="text-l font-bold text-center text-text">Enter The Reset Code:</h2>
            </div>
             <div className="flex items-center justify-center w-70 h-15  text-text rounded-full mx-auto">
            <InputOTP 
            maxLength={6}
            value={resetCode}
            onChange={(value) => handleChange("resetCode",value )}
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
            {resetCodeError && (
                <p className="text-red-500 text-sm mt-2">
                    {resetCodeError}
                </p>
            )}
                <input
                    type="password"
                    placeholder="New Password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => handleChange("newPassword", e.target.value)}
                    className="w-full p-3 border-gray-300 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-secondary bg-background text-text"
                    required
                />
                {passwordError && (
                    <p className="text-red-500 text-sm mt-2">
                        {passwordError}
                    </p>
                )}

                <button
                    type="submit"
                    className={`bg-secondary text-background rounded-md px-4 py-2 hover:bg-secondary-light transition duration-300 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading || !isFormValid}
                >
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
                <p className="text-center text-text text-sm mt-4">
                    Reset Code Expired Or Incorrect Email?{""}
                    <a href="/forget-password" className="text-secondary font-semibold hover:underline">
                      Try Again 
                    </a>
                </p>
                <p className="text-center text-text text-sm mt-4">
                    Remembered your password? 
                    <a href="/signin" className="text-secondary font-semibold hover:underline"> Sign In</a>
                </p>
            </form>

            </div>
            </div>

    )
}


export default ResetPassword