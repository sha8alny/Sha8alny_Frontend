import BackButton from "./BackButton";
import { Input } from "@/app/components/ui/Input";
import { Label } from "@/app/components/ui/Label";
import { Button } from "@/app/components/ui/Button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/app/components/ui/Input-otp";
/**
 * @namespace settings
 * @module settings
 */
/**
 * VerificationCodeForm component allows users to enter the verification code
 * sent to their email to complete the email change process.
 *
 * @param {Object} props - The properties object.
 * @param {Function} props.toggleForm - Function to exit the entire form flow.
 * @param {Function} props.handleBackClick - Function to go back to the previous step.
 * @param {string} props.email - The email being verified.
 * @param {string} props.verificationCode - The verification code value.
 * @param {Function} props.setVerificationCode - Function to set the verification code.
 * @param {Object} props.errors - Object containing validation errors.
 * @param {Function} props.handleSubmit - Function to handle form submission.
 * @param {boolean} props.isLoading - Boolean indicating if the form is in a loading state.
 *
 * @returns {JSX.Element} The VerificationCodeForm component.
 */
const VerificationCodeForm = ({
  toggleForm,
  handleBackClick,
  email,
  verificationCode,
  setVerificationCode,
  errors,
  handleSubmit,
  isLoading,
}) => {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[725px] mx-auto">
      <BackButton handler={handleBackClick} />
      <h1 className="text-xl font-semibold">Verify your email</h1>
      
      <div className="text-sm">
        <p>We've sent a verification code to: <span className="font-medium">{email}</span></p>
        <p className="mt-2">Please enter the 6-digit code to verify your email address.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label className="flex items-center">
            Verification code <span className="text-destructive ml-1">*</span>
          </Label>
          <InputOTP 
            maxLength={6}
            value={verificationCode} 
            onChange={setVerificationCode}
            data-testid="verification-code-input"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {errors.verificationCode && (
            <p className="text-sm text-destructive">{errors.verificationCode}</p>
          )}
        </div>
        
        <Button
          type="submit"
          data-testid="verify-email-button"
          disabled={isLoading}
          className="w-full bg-secondary text-background cursor-pointer hover:bg-secondary/80 transition-colors duration-200"
        >
          {isLoading ? "Verifying..." : "Verify Email"}
        </Button>
      </form>
    </div>
  );
};

export default VerificationCodeForm;
