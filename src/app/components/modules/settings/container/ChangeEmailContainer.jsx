import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ChangeEmailForm from "../presentation/ChangeEmailFrom"
import VerificationCodeForm from "../presentation/VerificationCodeForm";
import { checkEmail, sendVerificationEmail, verifyEmail, updateEmail } from "../../../../services/userManagement";
import { useToast } from "@/app/context/ToastContext";

/**
 * @namespace settings
 * @module settings
 */
/**
 * ChangeEmailContainer component handles the multi-step logic for changing the user's email.
 * Steps: 1) Check email validity, 2) Send verification code, 3) Verify code, 4) Update email
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.toggleForm - Function to toggle the visibility of the form
 * @returns {JSX.Element} The rendered ChangeEmailContainer component
 */
const ChangeEmailContainer = ({ toggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const showToast = useToast();
  const queryClient = useQueryClient();
  const validateInitialForm = () => {
    let newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }
    if (!password.trim()) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerificationCode = () => {
    let newErrors = {};
    if (!verificationCode.trim()) {
      newErrors.verificationCode = "Verification code is required";
    } else if (!/^\d{6}$/.test(verificationCode)) {
      newErrors.verificationCode = "Verification code must be 6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkEmailMutation = useMutation({
    mutationFn: () => checkEmail({ email, password }),
    onSuccess: () => {
      sendVerificationEmailMutation.mutate();
    },
    onError: (error) => {
      showToast(error.message || "Failed to validate email", false);
    },
  });

  const sendVerificationEmailMutation = useMutation({
    mutationFn: () => sendVerificationEmail(email),
    onSuccess: () => {
      setCurrentStep(2);
      showToast("Verification code sent to your email");
    },
    onError: () => {
      showToast("Failed to send verification email", false);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: () => verifyEmail(email, verificationCode),
    onSuccess: () => {
      updateEmailMutation.mutate();
    },
    onError: () => {
      showToast("Invalid verification code", false);
    },
  });

  const updateEmailMutation = useMutation({
    mutationFn: () => updateEmail({ email, password }),
    onSuccess: () => {
      showToast("Email updated successfully");
      queryClient.invalidateQueries("emailSettings")
      toggleForm();
    },
    onError: (error) => {
      showToast(error.message || "Failed to update email", false);
    },
  });

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (validateInitialForm()) {
      checkEmailMutation.mutate();
    }
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    if (validateVerificationCode()) {
      verifyEmailMutation.mutate();
    }
  };

  const isLoading = 
    checkEmailMutation.isPending || 
    sendVerificationEmailMutation.isPending || 
    verifyEmailMutation.isPending || 
    updateEmailMutation.isPending;

  return (
    <>
      {currentStep === 1 ? (
        <ChangeEmailForm
          toggleForm={toggleForm}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          errors={errors}
          handleSubmit={handleInitialSubmit}
          isLoading={isLoading}
        />
      ) : (
        <VerificationCodeForm
          toggleForm={toggleForm}
          email={email}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          errors={errors}
          handleSubmit={handleVerificationSubmit}
          isLoading={isLoading}
          handleBackClick={() => setCurrentStep(1)}
        />
      )}
    </>
  );
};

export default ChangeEmailContainer;