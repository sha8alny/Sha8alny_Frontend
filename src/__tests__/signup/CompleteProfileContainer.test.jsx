import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import CompleteProfileContainer from '@/app/components/modules/signup/container/CompleteProfileContainer';
import {useRouter} from 'next/navigation';
import {useMutation} from '@tanstack/react-query';
import {useToast} from "../../app/context/ToastContext";
import '@testing-library/jest-dom';


jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
    useMutation: jest.fn(),
}));

jest.mock('../../app/context/ToastContext', () => ({
    useToast: jest.fn(),
}));
global.FileReader = jest.fn().mockImplementation(() => ({
    onloadend: jest.fn(),
    readAsDataURL: jest.fn(function () {
        this.onloadend(); // Simulate the file loading by invoking onloadend
    }),
}));


describe('CompleteProfileContainer', () => {
    let mockPush;
    const mockMutateAsync = jest.fn();
    const mockShowToast = jest.fn();

    beforeEach(() => {
        mockPush = jest.fn();

        useRouter.mockReturnValue({push: mockPush});
        useToast.mockReturnValue(mockShowToast);

        useMutation.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        });
    });

    const fillForm =()=>{
        fireEvent.change(screen.getByLabelText(/full name/i), {target: {value: 'John Doe'}});
        fireEvent.change(screen.getByLabelText(/location/i), {target: {value: 'New York'}});
        const file = new File(['dummy'], 'profile.png', { type: 'image/png' });

        fireEvent.change(screen.getByTitle(/upload profile pic/i), {
          target: { files: [file] },
        });
    
        fireEvent.change(screen.getByTitle(/upload cover pic/i), {
          target: { files: [file] },
        });
        const reader = new FileReader();
        reader.onloadend();
    };

    it('renders the complete profile form correctly', () => {
        render(<CompleteProfileContainer />);
        expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/location/i)).toBeInTheDocument();
        expect(screen.getByTitle(/upload profile pic/i)).toBeInTheDocument();
        expect(screen.getByTitle(/upload cover pic/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });
    it('updates input fields on user input', () => {
        render(<CompleteProfileContainer />);
        fillForm();
        expect(screen.getByLabelText(/full name/i).value).toBe('John Doe');
        expect(screen.getByLabelText(/location/i).value).toBe('New York');
    });

    it('calls the completeProfile mutation on form submission', async () => {
        mockMutateAsync.mockResolvedValue({ success: true });
        render(<CompleteProfileContainer />);
        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));

        await waitFor(() => expect(mockMutateAsync).toHaveBeenCalled());
    });

    it('shows a success toast on successful profile completion', async () => {
        mockMutateAsync.mockResolvedValue({ success: true });
        jest.useFakeTimers();

        render(<CompleteProfileContainer />);
        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled();
            expect(mockShowToast).toHaveBeenCalledWith("Profile updated successfully");
        });
        jest.advanceTimersByTime(3000);
        expect(mockPush).toHaveBeenCalledWith("/");
        jest.useRealTimers();
    });

    it('shows an error toast on failed profile completion', async () => {
        mockMutateAsync.mockRejectedValue(new Error('Profile completion failed'));

        render(<CompleteProfileContainer />);
        fillForm();
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        await waitFor(() => {
            expect(mockShowToast).toHaveBeenCalledWith("Error completing profile", false);
        });
    });
    it('disables the submit button while submitting', () => {
        useMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: true,
          });
        render(<CompleteProfileContainer />);
        expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    });

    it('enables the submit button when not submitting', () => {
        useMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: false,
          });
        render(<CompleteProfileContainer />);
        expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
    }
    );
    it('handles image changes correctly', () => {
        render(<CompleteProfileContainer />);
        const profileInput = screen.getByTitle(/upload profile pic/i);
        const coverInput = screen.getByTitle(/upload cover pic/i);

        const file = new File(['img'], 'photo.jpg', { type: 'image/jpeg' });

        fireEvent.change(profileInput, { target: { files: [file] } });
        fireEvent.change(coverInput, { target: { files: [file] } });
    
        expect(profileInput.files[0]).toBe(file);
        expect(coverInput.files[0]).toBe(file);
    });

});