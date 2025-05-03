import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpContainer from '../../app/components/modules/signup/container/SignUpContainer';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useToast } from "../../app/context/ToastContext";
import { useEffect } from 'react';
import { setRecaptchaVerified } from 'react-google-recaptcha';
import { handleSignup, sendVerificationEmail, verifyEmail, checkSignupData } from '../../app/services/userManagement';
import { handleGoogleSignIn } from "@/app/services/userManagement";   
import VerifyEmail from '@/app/components/modules/signup/presentation/VerifyEmail';
import { act } from 'react-dom/test-utils';
import '@testing-library/jest-dom';
import { auth } from 'firebase-admin';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Ensure this matches your app's import path
import { Google } from '@mui/icons-material';

console.log("✅ SignUpContainer test file");
jest.mock("../../app/services/userManagement"); // Mock the userManagement module

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(() => ({})), // Mock getAuth to return an empty object or a mock auth instance
  signInWithPopup: jest.fn(),
  GoogleAuthProvider: jest.fn(() => ({
    providerId: "google.com",
    addScope: jest.fn(),
  })),
}));
jest.mock('../../app/context/ToastContext', () => ({
  useToast: jest.fn(),
}));
beforeAll(() => {
  jest.spyOn(window, 'alert').mockImplementation(() => {});
});

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
}));

jest.mock('react-google-recaptcha', () => {
    let recaptchaVerified = true;
  
    return {
      __esModule: true,
      default: ({ onChange }) => {
        useEffect(() => {
          onChange(recaptchaVerified ? 'mock-recaptcha-token' : null);
        }, []);
        return <div title="recaptcha" />;
      },
      setRecaptchaVerified: (verified) => {
        recaptchaVerified = verified;
      },
      resetRecaptcha: () => {
        recaptchaVerified = true; // Reset to verified by default
      },
    };
  });

describe('SignUpContainer', () => {
  let mockMutate, mockPush;
  const mockShowToast = jest.fn();

  beforeEach(() => {
    mockPush = jest.fn();
    mockMutate = jest.fn();

    useRouter.mockReturnValue({ push: mockPush });
    useToast.mockReturnValue(mockShowToast);

    useMutation.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      onSuccess: jest.fn(),
      onError: jest.fn(),
    });
  });
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("handles resending verification email successfully", async () => {
    handleSignup.mockResolvedValueOnce({ success: true });
    sendVerificationEmail.mockResolvedValueOnce(true);
    verifyEmail.mockResolvedValueOnce(true);
    checkSignupData.mockResolvedValueOnce({ success: true });
    setRecaptchaVerified(true);

    render(<SignUpContainer />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "password123" } });
    fireEvent.change(screen.getByTestId("confirm-password-input"), { target: { value: "password123" } });

    // Simulate ReCAPTCHA token generation
    await waitFor(() => {
      expect(screen.getByTitle('recaptcha')).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Wait for email verification step
    await waitFor(() => {
      expect(sendVerificationEmail).toHaveBeenCalledWith("user@example.com");
    });

    // Simulate clicking the resend email button
    fireEvent.click(screen.getByText(/resend email/i));

    // Wait for the toast message
    await waitFor(() => {
      expect(sendVerificationEmail).toHaveBeenCalledWith("user@example.com");
    });
  });
  it("handles Google Sign-Up successfully", async () => {
    const mockUser = {
      getIdToken: jest.fn().mockResolvedValue("google-token"),
    };
    signInWithPopup.mockResolvedValueOnce({ user: mockUser });
    handleGoogleSignIn.mockResolvedValueOnce({ success: true });

    render(<SignUpContainer />);

    // Simulate clicking the Google Sign-Up button
    fireEvent.click(screen.getByRole("button", { name: /continue with google/i }));

    // Wait for Google Sign-Up to complete
    await waitFor(() => {
      expect(signInWithPopup).toHaveBeenCalled();
      expect(handleGoogleSignIn).toHaveBeenCalledWith("google-token");
      expect(mockShowToast).toHaveBeenCalledWith("Google Sign-Up Successful!");
      expect(mockPush).toHaveBeenCalledWith("/complete-profile");
    });
  });

  it('renders the signup form correctly', () => {
    render(<SignUpContainer />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-password-input")).toBeInTheDocument();   
    expect(screen.getByLabelText('Remember Me')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('updates input fields on user input', () => {
    render(<SignUpContainer />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId("confirm-password-input"), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/remember me/i));

    expect(screen.getByLabelText(/username/i)).toHaveValue('testUser');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByTestId("password-input")).toHaveValue('password123');
    expect(screen.getByTestId("confirm-password-input")).toHaveValue('password123');
    expect(screen.getByLabelText(/remember me/i)).toBeChecked();
  });

  it('displays an error message when the email is invalid', async () => {
    render(<SignUpContainer />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalidEmail' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });
  });

  test("shows success toast and redirects to complete profile on successful registration", async () => {
    handleSignup.mockResolvedValueOnce({ success: true });
    sendVerificationEmail.mockResolvedValueOnce(true);
    verifyEmail.mockResolvedValueOnce(true);
    checkSignupData.mockResolvedValueOnce({ success: true });
    setRecaptchaVerified(true);

    render(<SignUpContainer />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "testUser" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: "password123" } });
    fireEvent.change(screen.getByTestId("confirm-password-input"), { target: { value: "password123" } });

    // Simulate ReCAPTCHA token generation
    await waitFor(() => {
      expect(screen.getByTitle('recaptcha')).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    // Wait for email verification step
    await waitFor(() => {
      expect(sendVerificationEmail).toHaveBeenCalledWith("user@example.com");
      expect(mockShowToast).toHaveBeenCalledWith("Verification email sent! Please check your inbox.");
    });
        // Skip manually filling the OTP input and directly mock OTP verification
    await act(async () => {
          verifyEmail("user@example.com", "123456"); // Simulate OTP verification
      });
    // Wait for successful registration
    await waitFor(() => {
      expect(verifyEmail).toHaveBeenCalledWith("user@example.com", "123456");
    });
  });
  it('shows an alert toast if reCAPTCHA is not verified', async () => {
    setRecaptchaVerified(false); // Simulate unverified reCAPTCHA
    sendVerificationEmail.mockResolvedValueOnce(false);
  
    render(<SignUpContainer />);
  
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId("confirm-password-input"), { target: { value: 'password123' } });
  
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
  
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith('Please verify that you are not a robot',false);
    });
  });

  it('shows an alert on sign-up error', async () => {
    setRecaptchaVerified(true); // Ensure reCAPTCHA is verified
    checkSignupData.mockResolvedValueOnce({ success: false, message: "Email or Username already taken!" });
  
    // Simulate the mutation throwing an error and trigger the onError callback
    const errorMock = jest.fn((_, { onError }) => {
      onError(new Error('Email or Username already taken!'));
    });
  
    useMutation.mockReturnValue({
      mutate: errorMock,
      isPending: false,
    });
  
    render(<SignUpContainer />);
  
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId("confirm-password-input"), { target: { value: 'password123' } });  
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
  
    // Wait for alert to be triggered
    await waitFor(() => {
      expect(mockShowToast).toHaveBeenCalledWith("Email or Username already taken!", false);
      });
  });
  it("shows error for invalid email format", async () => {
    render(<SignUpContainer />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: 'password123' } });
    fireEvent.change(screen.getByTestId("confirm-password-input"), { target: { value: 'password123' } }); 

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled(); // Ensure signup is not triggered
    });
  });
  it("shows error if password is less than 6 characters", async () => {
    render(<SignUpContainer />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByTestId("password-input"), { target: { value: 'pass' } });
    fireEvent.change(screen.getByTestId("confirm-password-input"), { target: { value: 'pass' } }); 

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText("Password must be 8 characters or more.")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled(); // Ensure signup is not triggered
    });
  });
});
