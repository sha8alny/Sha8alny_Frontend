import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CertificationsContainer from '../../app/components/modules/profile/container/CertificationsContainer';
import "@testing-library/jest-dom";
import { IsMyProfileProvider, useIsMyProfile } from "../../app/context/IsMyProfileContext";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock React Query
jest.mock('@tanstack/react-query', () => {
  const original = jest.requireActual('@tanstack/react-query');
  return {
    ...original,
    useQueryClient: jest.fn().mockReturnValue({
      invalidateQueries: jest.fn(),
      setQueryData: jest.fn()
    }),
    useMutation: jest.fn().mockReturnValue({
      mutate: jest.fn(),
      isLoading: false,
      isError: false,
      isSuccess: false,
    })
  };
});

// Mock useUpdateProfile hook
jest.mock('../../app/hooks/useUpdateProfile', () => {
  return jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isLoading: false,
    isError: false,
    isSuccess: false,
  });
});

// Mock next/image for testing environment with correct string handling for attributes
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // Convert boolean `fill` prop to string to avoid warning
    const imgProps = {...props};
    if (typeof imgProps.fill === 'boolean') {
      imgProps.fill = imgProps.fill.toString();
    }
    return <img {...imgProps} src={imgProps.src || ''} data-testid="certificate-image" />;
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
  ChevronUp: () => <div data-testid="chevron-up">ChevronUp</div>,
  // Add other icons used in ModCertificate if needed
  X: () => <div data-testid="x-icon">X</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Edit: () => <div data-testid="edit-icon">Edit</div>,
}));

// Mock form-related dependencies
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    handleSubmit: jest.fn(),
    setValue: jest.fn(),
    watch: jest.fn().mockReturnValue([]),
    formState: { errors: {}, isValid: true },
    register: jest.fn(),
  }),
}));

// Mock other dependencies that might be used in the real ModCertificate
jest.mock('@hookform/resolvers/zod', () => ({
  zodResolver: jest.fn()
}));

// Mock zod since it's likely used in the ModCertificate component
jest.mock('zod', () => {
  return {
    __esModule: true,
    default: {
      object: () => ({
        shape: jest.fn(),
        refine: jest.fn().mockReturnThis(),
      }),
      string: () => ({
        nonempty: jest.fn().mockReturnThis(),
      }),
      array: () => ({
        default: jest.fn().mockReturnThis(),
      }),
      boolean: () => ({
        default: jest.fn().mockReturnThis(),
      }),
    },
    z: {
      object: () => ({
        shape: jest.fn(),
        refine: jest.fn().mockReturnThis(),
      }),
      string: () => ({
        nonempty: jest.fn().mockReturnThis(),
      }),
      array: () => ({
        default: jest.fn().mockReturnThis(),
      }),
      boolean: () => ({
        default: jest.fn().mockReturnThis(),
      }),
    }
  };
});

// Mock the useIsMyProfile hook to control the isMyProfile value in tests
jest.mock('../../app/context/IsMyProfileContext', () => {
  // Keep a reference to the original module
  const originalModule = jest.requireActual('../../app/context/IsMyProfileContext');
  
  // Return a modified version where we can control useIsMyProfile's return value
  return {
    ...originalModule,
    useIsMyProfile: jest.fn().mockReturnValue({ 
      isMyProfile: false,
      setIsMyProfile: jest.fn()
    })
  };
});

describe('CertificationsContainer', () => {
  const mockCertifications = [
    { 
      id: 1, 
      name: 'AWS Certified Developer',
      issuingOrganization: 'Amazon',
      issuingOrganisationLogo: 'https://example.com/logo.png',
      issueDate: { month: 'Jan', year: '2023' },
      expirationDate: { month: 'Jan', year: '2026' },
      skills: ['AWS', 'Cloud']
    },
    { 
      id: 2, 
      name: 'Azure Fundamentals',
      issuingOrganization: 'Microsoft',
      issuingOrganisationLogo: 'https://example.com/logo.png',
      issueDate: { month: 'Feb', year: '2023' },
      expirationDate: { month: 'Feb', year: '2026' },
      skills: ['Azure', 'Cloud']
    },
    { 
      id: 3, 
      name: 'Google Cloud Associate',
      issuingOrganization: 'Google',
      issuingOrganisationLogo: 'https://example.com/logo.png',
      issueDate: { month: 'Mar', year: '2023' },
      expirationDate: { month: 'Mar', year: '2026' },
      skills: ['GCP', 'Cloud']
    },
    { 
      id: 4, 
      name: 'Kubernetes Administrator',
      issuingOrganization: 'CNCF',
      issuingOrganisationLogo: 'https://example.com/logo.png',
      issueDate: { month: 'Apr', year: '2023' },
      expirationDate: { month: 'Apr', year: '2026' },
      skills: ['Kubernetes', 'DevOps']
    }
  ];

  // Create a QueryClient for tests
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  // Update the renderWithContext to include QueryClientProvider
  const renderWithContext = (ui, { providerProps, ...renderOptions } = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <IsMyProfileProvider {...providerProps}>
          {ui}
        </IsMyProfileProvider>
      </QueryClientProvider>,
      renderOptions
    );
  };

  // Reset QueryClient after each test
  afterEach(() => {
    queryClient.clear();
  });

  test('should render certifications with correct initial state', () => {
    renderWithContext(<CertificationsContainer certifications={mockCertifications} />);
    
    // Should display only first 3 certificates initially
    expect(screen.getByText('AWS Certified Developer')).toBeInTheDocument();
    expect(screen.getByText('Azure Fundamentals')).toBeInTheDocument();
    expect(screen.getByText('Google Cloud Associate')).toBeInTheDocument();
    expect(screen.queryByText('Kubernetes Administrator')).not.toBeInTheDocument();
    
    // Check for "Show all" button with the correct count
    expect(screen.getByText(/Show all 4 certifications/i)).toBeInTheDocument();
    expect(screen.getByTestId('chevron-down')).toBeInTheDocument();
  });

  test('should toggle between showing all certifications and showing fewer', () => {
    renderWithContext(<CertificationsContainer certifications={mockCertifications} />);
    
    // Initially only shows 3 certifications
    expect(screen.queryByText('Kubernetes Administrator')).not.toBeInTheDocument();
    
    // Click "Show all" button
    fireEvent.click(screen.getByText(/Show all 4 certifications/i));
    
    // Should now show all 4 certifications
    expect(screen.getByText('Kubernetes Administrator')).toBeInTheDocument();
    expect(screen.getByText(/Show less/i)).toBeInTheDocument();
    expect(screen.getByTestId('chevron-up')).toBeInTheDocument();
    
    // Click "Show less" button
    fireEvent.click(screen.getByText(/Show less/i));
    
    // Should hide the 4th certification again
    expect(screen.queryByText('Kubernetes Administrator')).not.toBeInTheDocument();
    expect(screen.getByText(/Show all 4 certifications/i)).toBeInTheDocument();
  });

  test('should not show "Show all" button when there are 3 or fewer certifications', () => {
    const fewerCertifications = mockCertifications.slice(0, 3);
    renderWithContext(<CertificationsContainer certifications={fewerCertifications} />);
    
    // No "Show all" button should be present
    expect(screen.queryByText(/Show all/i)).not.toBeInTheDocument();
  });

  test('should not render anything when certifications array is empty', () => {
    renderWithContext(<CertificationsContainer certifications={[]} />);
    
    // Component should not render anything with empty array
    expect(screen.queryByText(/Certificates/i)).not.toBeInTheDocument();
  });
  
  // Test the isMyProfile context affects the component
  test('should use isMyProfile from context', () => {
    // Override the default mock for useIsMyProfile to return true for this test
    useIsMyProfile.mockReturnValue({ 
      isMyProfile: true,
      setIsMyProfile: jest.fn()
    });
    
    // Use the renderWithContext that includes the QueryClientProvider
    renderWithContext(<CertificationsContainer certifications={mockCertifications} />);
    
    // The UI should have the "Certificates" text
    expect(screen.getByText('Certificates')).toBeInTheDocument();
    
    // We should check for something that would only appear when isMyProfile is true
    // Look for edit icons if they're rendered when isMyProfile is true
    const editIcons = screen.getAllByTestId('edit-icon');
    expect(editIcons.length).toBeGreaterThan(0);
    
    // Reset the mock for subsequent tests
    useIsMyProfile.mockReturnValue({ 
      isMyProfile: false,
      setIsMyProfile: jest.fn()
    });
  });
});