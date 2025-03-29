import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTheme } from '../../app/context/ThemeContext';
import { usePathname, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../../app/components/layout/NavBar';
import { fetchUserProfile } from '../../app/services/userProfile';

// Mock the imported modules and hooks
jest.mock('../../app/context/ThemeContext', () => ({
    useTheme: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    usePathname: jest.fn(),
    useRouter: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
    useQuery: jest.fn(),
}));

jest.mock('../../app/services/userProfile', () => ({
    fetchUserProfile: jest.fn(),
}));

// Mock NavBarPresentation components with a named mock
const NavbarPresentationMock = jest.fn();
NavbarPresentationMock.mockImplementation(props => (
    <div data-testid="navbar-presentation">
        <span>{props.userInfo.name}</span>
        <div data-testid="home-icon">Home</div>
        <div data-testid="network-icon">Network</div>
        <div data-testid="briefcase-icon">Briefcase</div>
        <div data-testid="briefcase-business-icon">BriefcaseBusiness</div>
        {props.theme === 'dark' ? (
            <div data-testid="sun-icon">Sun</div>
        ) : (
            <div data-testid="moon-icon">Moon</div>
        )}
        NavbarPresentation Component
    </div>
));

const NavBarPresentationSkeletonMock = jest.fn();
NavBarPresentationSkeletonMock.mockImplementation(props => (
    <div data-testid="navbar-skeleton" role="status">
        NavBarPresentationSkeleton Component (isLoading: {String(props.isLoading)})
    </div>
));

jest.mock('../../app/components/layout/NavBarPresentation', () => ({
    __esModule: true,
    default: props => NavbarPresentationMock(props),
    NavBarPresentationSkeleton: props => NavBarPresentationSkeletonMock(props),
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
    Home: () => <div data-testid="home-icon">Home</div>,
    Network: () => <div data-testid="network-icon">Network</div>,
    Briefcase: () => <div data-testid="briefcase-icon">Briefcase</div>,
    BriefcaseBusiness: () => <div data-testid="briefcase-business-icon">BriefcaseBusiness</div>,
    MessageCircle: () => <div data-testid="message-icon">MessageCircle</div>,
    Bell: () => <div data-testid="bell-icon">Bell</div>,
    Sun: () => <div data-testid="sun-icon">Sun</div>,
    Moon: () => <div data-testid="moon-icon">Moon</div>,
    Search: () => <div data-testid="search-icon">Search</div>,
    User: () => <div data-testid="user-icon">User</div>,
    Settings: () => <div data-testid="settings-icon">Settings</div>,
    LogOut: () => <div data-testid="logout-icon">LogOut</div>,
    ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>
}));

// Mock next/image
jest.mock('next/image', () => ({
    __esModule: true,
    default: (props) => <img {...props} alt={props.alt || 'Image'} />
}));

// Mock UI components that NavBarPresentation might use
jest.mock('@/app/components/ui/Button', () => ({
    Button: ({ children, ...props }) => <button {...props}>{children}</button>
}), { virtual: true });

jest.mock('@/app/components/ui/DropdownMenu', () => ({
    DropdownMenu: ({ children }) => <div data-testid="dropdown-menu">{children}</div>,
    DropdownMenuContent: ({ children }) => <div data-testid="dropdown-content">{children}</div>,
    DropdownMenuTrigger: ({ children }) => <button data-testid="dropdown-trigger">{children}</button>,
    DropdownMenuItem: ({ children, onClick }) => <div onClick={onClick} data-testid="dropdown-item">{children}</div>,
    DropdownMenuSeparator: () => <hr data-testid="dropdown-separator" />
}), { virtual: true });

describe('Navbar Component', () => {
    const mockTheme = {
        theme: 'light',
        toggleTheme: jest.fn(),
    };

    const mockRouter = {
        push: jest.fn(),
    };

    const mockUserProfile = {
        name: 'Test User',
        username: 'testuser',
        headline: 'Test Headline',
        profilePicture: '/test-profile.jpg',
    };

    beforeEach(() => {
        useTheme.mockReturnValue(mockTheme);
        usePathname.mockReturnValue('/');
        useRouter.mockReturnValue(mockRouter);
        fetchUserProfile.mockResolvedValue(mockUserProfile);
        NavbarPresentationMock.mockClear();
        NavBarPresentationSkeletonMock.mockClear();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state correctly', () => {
        useQuery.mockReturnValue({
            data: null,
            isLoading: true,
            isError: false,
        });

        render(<Navbar />);
        
        // Look for the skeleton with loading state
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText(/isLoading: true/i)).toBeInTheDocument();
    });

    test('renders error state correctly', () => {
        useQuery.mockReturnValue({
            data: null,
            isLoading: false,
            isError: true,
        });

        render(<Navbar />);
        
        // Look for the skeleton in error state
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText(/isLoading: false/i)).toBeInTheDocument();
    });

    test('renders successful state with user data correctly', () => {
        useQuery.mockReturnValue({
            data: mockUserProfile,
            isLoading: false,
            isError: false,
        });

        render(<Navbar />);
        
        // Look for the user info in the rendered component
        expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    test('displays proper navigation icons', () => {
        useQuery.mockReturnValue({
            data: mockUserProfile,
            isLoading: false,
            isError: false,
        });

        render(<Navbar />);
        
        // Check if all expected icons are present
        expect(screen.getByTestId('home-icon')).toBeInTheDocument();
        expect(screen.getByTestId('network-icon')).toBeInTheDocument();
        expect(screen.getByTestId('briefcase-icon')).toBeInTheDocument();
        expect(screen.getByTestId('briefcase-business-icon')).toBeInTheDocument();
    });

    test('displays correct theme icon based on current theme', () => {
        // Test with light theme
        useQuery.mockReturnValue({
            data: mockUserProfile,
            isLoading: false,
            isError: false,
        });

        const { rerender } = render(<Navbar />);
        expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
        
        // Test with dark theme
        useTheme.mockReturnValue({
            theme: 'dark',
            toggleTheme: mockTheme.toggleTheme,
        });
        
        rerender(<Navbar />);
        expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    });

    test('uses correct query key for fetchUserProfile', () => {
        useQuery.mockReturnValue({
            data: mockUserProfile,
            isLoading: false,
            isError: false,
        });

        render(<Navbar />);
        
        expect(useQuery).toHaveBeenCalledWith({
            queryKey: ['sidebarInfo'],
            queryFn: expect.any(Function),
        });
    });
    
    test('passes correct props to NavbarPresentation component', () => {
        useQuery.mockReturnValue({
            data: mockUserProfile,
            isLoading: false,
            isError: false,
        });

        render(<Navbar />);
        
        // Check that the mock function was called
        expect(NavbarPresentationMock).toHaveBeenCalled();
        
        // Get the first call arguments (props)
        const propsArg = NavbarPresentationMock.mock.calls[0][0];
        
        // Check individual props
        expect(propsArg.userInfo).toEqual(mockUserProfile);
        expect(propsArg.theme).toEqual('light');
        expect(propsArg.toggleTheme).toBe(mockTheme.toggleTheme);
        expect(propsArg.currentPath).toEqual('/');
        expect(typeof propsArg.navigateTo).toBe('function');
    });
});