import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModCertificate from '@/app/components/modules/profile/container/ModCertificate';
import useUpdateProfile from '@/app/hooks/useUpdateProfile';
import '@testing-library/jest-dom'; // Add this import

// Mock the hooks and components
jest.mock('../../app/hooks/useUpdateProfile');
jest.mock('../../app/components/ui/DialogMod', () => ({
    __esModule: true,
    default: ({ buttonData, AlertContent }) => (
        <div>
            <button data-testid="dialog-trigger">{buttonData}</button>
            <div data-testid="dialog-content">{AlertContent}</div>
        </div>
    ),
}));
jest.mock('../../app/components/ui/EditButton', () => ({
    __esModule: true,
    default: () => <span>Edit</span>,
}));
jest.mock('../../app/components/ui/AddButton', () => ({
    __esModule: true,
    default: () => <span>Add</span>,
}));

// Set up ResizeObserver mock before tests run
beforeAll(() => {
    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

const renderWithQueryClient = (ui) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
};

describe('ModCertificate', () => {
    const mockMutate = jest.fn();
    
    beforeEach(() => {
        useUpdateProfile.mockReturnValue({
            mutate: mockMutate,
            isLoading: false,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const certificate = {
        name: 'Test Certificate',
        issuingOrganization: 'Test Org',
        issueDate: {
            month: 'January',
            year: 2020,
        },
        expirationDate: {
            month: 'December',
            year: 2025,
        },
        neverExpires: false,
        skills: ['JavaScript', 'React'],
    };

    test('renders correct button based on adding prop', () => {
        const { rerender } = renderWithQueryClient(<ModCertificate adding={true} />);
        expect(screen.getByTestId('dialog-trigger')).toBeInTheDocument();
        expect(screen.getByTestId('dialog-trigger').textContent).toContain('Add');
        
        rerender(
            <QueryClientProvider client={new QueryClient()}>
                <ModCertificate adding={false} certificate={certificate} />
            </QueryClientProvider>
        );
        expect(screen.getByTestId('dialog-trigger').textContent).toContain('Edit');
    });

    test('dialog opens when trigger button is clicked', () => {
        renderWithQueryClient(<ModCertificate adding={false} certificate={certificate} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        expect(screen.getByText('Certificate Information')).toBeInTheDocument();
    });

    test('loads certificate data in form fields when editing', () => {
        renderWithQueryClient(<ModCertificate adding={false} certificate={certificate} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        expect(screen.getByDisplayValue('Test Certificate')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Org')).toBeInTheDocument();
    });

    test('handles checkbox interaction for never expires', () => {
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        const checkbox = screen.getByRole('checkbox', { name: /this certificate does not expire/i });
        
        // Initially unchecked
        expect(checkbox.getAttribute('data-state')).toBe('unchecked');
        
        // Check it
        fireEvent.click(checkbox);
        expect(checkbox.getAttribute('data-state')).toBe('checked');
        
        // Uncheck it again
        fireEvent.click(checkbox);
        expect(checkbox.getAttribute('data-state')).toBe('unchecked');
    });

    test('skills can be added to the form', () => {
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        // Add a skill
        const skillInput = screen.getByPlaceholderText(/add a skill/i);
        fireEvent.change(skillInput, { target: { value: 'JavaScript' } });
        
        const addButton = screen.getByRole('button', { name: /add/i });
        fireEvent.click(addButton);
        
        // Check skill is displayed
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    test('prevents duplicate skill addition', () => {
        renderWithQueryClient(<ModCertificate adding={false} certificate={certificate} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        // Skills from certificate should be displayed
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        
        // Try adding an existing skill
        const skillInput = screen.getByPlaceholderText(/add a skill/i);
        fireEvent.change(skillInput, { target: { value: 'JavaScript' } });
        
        const addButton = screen.getByRole('button', { name: /add/i });
        fireEvent.click(addButton);
        
        // Should still have only one instance
        const javascriptSkills = screen.getAllByText('JavaScript');
        expect(javascriptSkills.length).toBe(1);
    });

    test('validates required fields on form submission', async () => {
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        // Submit the empty form
        const submitButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(submitButton);
        
        // Check for validation messages
        await waitFor(() => {
            expect(screen.getByText(/certificate name is required/i)).toBeInTheDocument();
            expect(screen.getByText(/issuing organization is required/i)).toBeInTheDocument();
        });
    });

    test('form submission is enabled when valid data is entered', () => {
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        // Fill required fields
        fireEvent.change(screen.getByLabelText(/certificate name/i), {
            target: { value: 'New Certificate' }
        });
        fireEvent.change(screen.getByLabelText(/issuing organization/i), {
            target: { value: 'New Org' }
        });
        
        // Check never expires to bypass date validation
        const checkbox = screen.getByRole('checkbox', { name: /this certificate does not expire/i });
        fireEvent.click(checkbox);
        
        // Add issue date
        fireEvent.change(screen.getByRole('combobox', { name: /issue month/i }), {
            target: { value: 'January' }
        });
        fireEvent.change(screen.getByRole('combobox', { name: /issue year/i }), {
            target: { value: '2022' }
        });
        
        // Submit button should not be disabled
        const submitButton = screen.getByRole('button', { name: /save/i });
        expect(submitButton).not.toHaveAttribute('disabled');
    });

    test('adding a skill with Enter key', () => {
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        const skillInput = screen.getByPlaceholderText(/add a skill/i);
        fireEvent.change(skillInput, { target: { value: 'React Native' } });
        fireEvent.keyDown(skillInput, { key: 'Enter', code: 'Enter' });
        
        expect(screen.getByText('React Native')).toBeInTheDocument();
        expect(skillInput.value).toBe('');
    });

    test('emptying skill input with Escape key', () => {
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        const skillInput = screen.getByPlaceholderText(/add a skill/i);
        fireEvent.change(skillInput, { target: { value: 'TypeScript' } });
        fireEvent.keyDown(skillInput, { key: 'Escape', code: 'Escape' });
        
        // Input should be preserved but no skill added
        expect(skillInput.value).toBe('TypeScript');
        expect(screen.queryByText('TypeScript')).not.toBeInTheDocument();
    });

    test('mutation is called with correct data when adding certificate', async () => {
        // Mock successful mutation
        mockMutate.mockImplementation((data, options) => {
            if (options && options.onSuccess) {
                options.onSuccess();
            }
            return Promise.resolve();
        });
        
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        // Fill form data
        fireEvent.change(screen.getByLabelText(/certificate name/i), {
            target: { value: 'New Certificate' }
        });
        fireEvent.change(screen.getByLabelText(/issuing organization/i), {
            target: { value: 'New Org' }
        });
        
        // Add issue date
        fireEvent.change(screen.getByRole('combobox', { name: /issue month/i }), {
            target: { value: 'January' }
        });
        fireEvent.change(screen.getByRole('combobox', { name: /issue year/i }), {
            target: { value: '2022' }
        });
        
        // Check never expires
        const checkbox = screen.getByRole('checkbox', { name: /this certificate does not expire/i });
        fireEvent.click(checkbox);
        
        // Submit form
        const submitButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(submitButton);
        
        // Check mutation was called with correct data
        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith(
                expect.objectContaining({
                    api: 'add-certification',
                    method: 'POST',
                    data: expect.objectContaining({
                        certificate: expect.objectContaining({
                            name: 'New Certificate',
                            issuingOrganization: 'New Org',
                            neverExpires: true
                        })
                    })
                }),
                expect.anything()
            );
        });
    });

    test('mutation is called with correct data when editing certificate', async () => {
        // Mock successful mutation
        mockMutate.mockImplementation((data, options) => {
            if (options && options.onSuccess) {
                options.onSuccess();
            }
            return Promise.resolve();
        });
        
        renderWithQueryClient(<ModCertificate adding={false} certificate={certificate} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        // Update certificate name
        fireEvent.change(screen.getByLabelText(/certificate name/i), {
            target: { value: 'Updated Certificate' }
        });
        
        // Submit form
        const submitButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(submitButton);
        
        // Check mutation was called with correct data
        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledWith(
                expect.objectContaining({
                    api: 'edit',
                    method: 'PATCH',
                    data: expect.objectContaining({
                        certificate: expect.objectContaining({
                            name: 'Updated Certificate'
                        })
                    })
                }),
                expect.anything()
            );
        });
    });

    test('skills can be removed', () => {
        renderWithQueryClient(<ModCertificate adding={false} certificate={certificate} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        // Initial skills should be present
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        
        // Find and click the remove button for JavaScript
        const removeButtons = screen.getAllByText(/×/);
        fireEvent.click(removeButtons[0]);
        
        // JavaScript should be removed
        expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
    });

    test('form shows loading state during submission', () => {
        // Mock loading state
        useUpdateProfile.mockReturnValue({
            mutate: mockMutate,
            isLoading: true,
        });
        
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        // Submit button should be disabled and show loading state
        const submitButton = screen.getByRole('button', { name: /saving/i });
        expect(submitButton).toHaveAttribute('disabled');
    });

    test('form is reset after successful submission', async () => {
        // Mock successful submission
        mockMutate.mockImplementation((data, options) => {
            if (options && options.onSuccess) {
                options.onSuccess();
            }
            return Promise.resolve();
        });
        
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        // Fill form
        fireEvent.change(screen.getByLabelText(/certificate name/i), {
            target: { value: 'Test Certificate' }
        });
        fireEvent.change(screen.getByLabelText(/issuing organization/i), {
            target: { value: 'Test Org' }
        });
        
        // Make it valid by checking never expires
        const checkbox = screen.getByRole('checkbox', { name: /this certificate does not expire/i });
        fireEvent.click(checkbox);
        
        // Add issue date
        fireEvent.change(screen.getByRole('combobox', { name: /issue month/i }), {
            target: { value: 'January' }
        });
        fireEvent.change(screen.getByRole('combobox', { name: /issue year/i }), {
            target: { value: '2022' }
        });
        
        // Submit form
        const submitButton = screen.getByRole('button', { name: /save/i });
        fireEvent.click(submitButton);
        
        // Check form was reset
        await waitFor(() => {
            const nameInput = screen.getByLabelText(/certificate name/i);
            expect(nameInput.value).toBe('');
        });
    });

    test('white space is trimmed from skills', () => {
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        const skillInput = screen.getByPlaceholderText(/add a skill/i);
        fireEvent.change(skillInput, { target: { value: '  React Native  ' } });
        
        const addButton = screen.getByRole('button', { name: /add/i });
        fireEvent.click(addButton);
        
        expect(screen.getByText('React Native')).toBeInTheDocument();
    });

    test('empty skills are not added', () => {
        renderWithQueryClient(<ModCertificate adding={true} />);
        fireEvent.click(screen.getByTestId('dialog-trigger'));
        
        const skillInput = screen.getByPlaceholderText(/add a skill/i);
        fireEvent.change(skillInput, { target: { value: '   ' } });
        
        const addButton = screen.getByRole('button', { name: /add/i });
        fireEvent.click(addButton);
        
        // No skill should be added
        expect(screen.queryByText(/×/)).not.toBeInTheDocument();
    });
});
