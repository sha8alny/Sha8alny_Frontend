import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignInContainer from '@/app/components/modules/signin/container/SignInContainer';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useToast } from "../../app/context/ToastContext";
import { useEffect } from 'react';

import '@testing-library/jest-dom';

console.log("✅ SignInContainer test file");

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

  

describe('SignInContainer', () => {
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

  it('renders the signin form correctly', () => {
    render(<SignInContainer />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Remember Me')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
  });

  it('updates input fields on user input', () => {

    render(<SignInContainer />);
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByLabelText(/remember me/i));

    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByLabelText(/password/i)).toHaveValue('password123');
    expect(screen.getByLabelText(/remember me/i)).toBeChecked();
  });


  it('calls the signin mutation function on valid form submission', async () => {
    render(<SignInContainer />);

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
    fireEvent.click(screen.getByLabelText(/remember me/i));

    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'user@example.com',
          password: 'password',
          rememberMe: true,
        }),
        expect.objectContaining({
          onSuccess: expect.any(Function), // Allow onSuccess option
          onError: expect.any(Function), // Allow onError option
        }),
      );

    console.log("✅ mockMutate calls:", mockMutate.mock.calls);
  });

  it('redirects to the Home page on successful login', async () => {
    const successMock = jest.fn((data, options) => {
      console.log('✅ Mutation data:', data);
      console.log('✅ Mutation options:', options);
  
      // Ensure onSuccess callback is called if it exists
      options?.onSuccess({ success: true });
    });
  
    useMutation.mockReturnValue({
      mutate: successMock,
      isPending: false,
    });

    jest.useFakeTimers();
  
    render(<SignInContainer />);
  
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
  
    await waitFor(() => {
      expect(successMock).toHaveBeenCalledTimes(1);
      expect(mockShowToast).toHaveBeenCalledWith("Welcome back!");
    });
    jest.advanceTimersByTime(3000);
    expect(mockPush).toHaveBeenCalledWith('/');
    jest.useRealTimers();
  });

  it('shows an alert on sign-in error', async () => {
  
    // Simulate the mutation throwing an error and trigger the onError callback
    const errorMock = jest.fn((_, { onError }) => {
      onError({success:false,message:"Incorrect email or password"});
    });
  
    useMutation.mockReturnValue({
      mutate: errorMock,
      isPending: false,
    });
  
    render(<SignInContainer />);
  
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrong-password' } });
  
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
  
    // Wait for alert to be triggered
    await waitFor(() => {
      expect(errorMock).toHaveBeenCalledTimes(1);
      expect(mockShowToast).toHaveBeenCalledWith("Incorrect email or password", false);
    });
  });
  
  

});


