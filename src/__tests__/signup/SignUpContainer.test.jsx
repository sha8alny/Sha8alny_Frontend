import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpContainer from '../../app/components/modules/signup/container/SignUpContainer';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useToast } from "../../app/context/ToastContext";
import { useEffect } from 'react';
import { setRecaptchaVerified } from 'react-google-recaptcha';
import '@testing-library/jest-dom';

console.log("✅ SignUpContainer test file");

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

  it('renders the signup form correctly', () => {
    render(<SignUpContainer />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Admin')).toBeInTheDocument();
    expect(screen.getByLabelText('Remember Me')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('updates input fields on user input', () => {
    render(<SignUpContainer />);
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText('Admin'));
    fireEvent.click(screen.getByLabelText(/remember me/i));

    expect(screen.getByLabelText(/username/i)).toHaveValue('testUser');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
    expect(screen.getByLabelText('Admin')).toBeChecked();
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

  it('calls the signup mutation function on valid form submission', async () => {
    setRecaptchaVerified(true); // Ensure reCAPTCHA is verified
    render(<SignUpContainer />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByLabelText('Admin'));
    fireEvent.click(screen.getByLabelText(/remember me/i));

    // Wait for reCAPTCHA simulation
    await waitFor(() => {
      expect(screen.getByTitle('recaptcha')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          username: 'testUser',
          email: 'user@example.com',
          password: 'password',
          isAdmin: true,
          recaptcha: 'mock-recaptcha-token',
          rememberMe: true,
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function), // Allow onSuccess option
          onError: expect.any(Function), // Allow onError option
        })
      );

    console.log("✅ mockMutate calls:", mockMutate.mock.calls);
  });

  it('show the success toast redirects to the complete profile on successful registration', async () => {
    const successMock = jest.fn((data, options) => {
      console.log('✅ Mutation data:', data);
      console.log('✅ Mutation options:', options);
  
      // Ensure onSuccess callback is called if it exists
      options?.onSuccess();
    });
  
    useMutation.mockReturnValue({
      mutate: successMock,
      isPending: false,
    });
  
    render(<SignUpContainer />);
  
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
  
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
  
    await waitFor(() => {
      expect(successMock).toHaveBeenCalledTimes(1);
      expect(mockShowToast).toHaveBeenCalledWith("Registration Successful & Auto-Login Successful!");
      expect(mockPush).toHaveBeenCalledWith('/complete-profile');
    });
  });
  it('shows an alert toast if reCAPTCHA is not verified', async () => {
    setRecaptchaVerified(false); // Simulate unverified reCAPTCHA
  
    render(<SignUpContainer />);
  
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });

  
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
  
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please verify that you are not a robot');
    });
  });

  it('shows an alert on sign-up error', async () => {
    setRecaptchaVerified(true); // Ensure reCAPTCHA is verified
  
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
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong-password' } });
  
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
  
    // Wait for alert to be triggered
    await waitFor(() => {
      expect(errorMock).toHaveBeenCalledTimes(1);
      expect(mockShowToast).toHaveBeenCalledWith("Email or Username already taken!", false);
      });
  });
  it("shows error for invalid email format", async () => {
    render(<SignUpContainer />);

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "password123" },
    });

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
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText("Password must be 6 characters or more.")).toBeInTheDocument();
      expect(mockMutate).not.toHaveBeenCalled(); // Ensure signup is not triggered
    });
  });
});
