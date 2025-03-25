import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

// Import the actual components
import { ProfileContainer } from '../../app/components/modules/profile/container/ProfileContainer';
import { IsMyProfileProvider } from '../../app/context/IsMyProfileContext';

// Mock the service function
jest.mock('../../app/services/userProfile', () => ({
  fetchUserProfile: jest.fn()
}));
import { fetchUserProfile } from '../../app/services/userProfile';

// Mock the presentation component
jest.mock('../../app/components/modules/profile/presentation/ProfilePresentation', () => {
  const ProfilePresentation = ({ userProfile, profileStrength, isMyProfile }) => (
    <div data-testid="profile-presentation">
      <div data-testid="user-profile">{JSON.stringify(userProfile)}</div>
      <div data-testid="profile-strength">{JSON.stringify(profileStrength)}</div>
      <div data-testid="is-my-profile">{String(isMyProfile)}</div>
    </div>
  );
  
  return {
    __esModule: true,
    default: ProfilePresentation,
    ProfileSkeleton: () => <div data-testid="profile-skeleton">Loading...</div>
  };
});

// Create a wrapper for the QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('ProfileContainer', () => {
  beforeEach(() => {
    fetchUserProfile.mockReset();
  });

  test('should render error message when no username is provided', () => {
    render(<ProfileContainer username="" />);
    expect(screen.getByText(/No username provided/i)).toBeInTheDocument();
  });

  test('should show loading skeleton when data is loading', async () => {
    // Set up the mock to delay so we can see the loading state
    fetchUserProfile.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({}), 100)));
    
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ProfileContainer username="testuser" />
      </Wrapper>
    );
    
    expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
  });

  test('should render error message when query fails', async () => {
    fetchUserProfile.mockRejectedValue(new Error('Failed to fetch'));
    
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ProfileContainer username="testuser" />
      </Wrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/Error fetching user profile/i)).toBeInTheDocument();
    });
  });

  test('should render private profile message when profile is not visible', async () => {
    fetchUserProfile.mockResolvedValue({ isVisible: false });
    
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ProfileContainer username="testuser" />
      </Wrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByText(/User profile is private/i)).toBeInTheDocument();
    });
  });

  test('should render profile presentation with correct data and calculate profile strength', async () => {
    const mockUserProfile = {
      isVisible: true,
      isMyProfile: true,
      username: 'testuser',
      profilePicture: 'picture.jpg',
      about: 'About me',
      education: [{school: 'Test University'}],
      experience: [{company: 'Test Company'}],
      skills: ['JavaScript', 'React'],
      connectionsCount: 10
    };

    fetchUserProfile.mockResolvedValue(mockUserProfile);
    
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ProfileContainer username="testuser" />
      </Wrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('profile-presentation')).toBeInTheDocument();
    });
    
    // Verify profile strength calculation works correctly
    const profileStrengthElement = screen.getByTestId('profile-strength');
    const profileStrength = JSON.parse(profileStrengthElement.textContent);
    
    // Check if the strength is calculated correctly
    expect(profileStrength.strength).toBe(100);
    expect(profileStrength.label).toBe('All-Star');
    expect(profileStrength.color).toBe('bg-green-500');
    
    // Verify isMyProfile is passed to the presentation
    expect(screen.getByTestId('is-my-profile').textContent).toBe('true');
  });

  test('should calculate partial profile strength correctly', async () => {
    const mockUserProfile = {
      isVisible: true,
      isMyProfile: false,
      username: 'testuser',
      profilePicture: 'picture.jpg',
      about: '',
      education: [],
      experience: [],
      skills: ['JavaScript'],
      connectionsCount: 0
    };

    fetchUserProfile.mockResolvedValue(mockUserProfile);
    
    const Wrapper = createWrapper();
    render(
      <Wrapper>
        <ProfileContainer username="testuser" />
      </Wrapper>
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('profile-presentation')).toBeInTheDocument();
    });
    
    const profileStrengthElement = screen.getByTestId('profile-strength');
    const profileStrength = JSON.parse(profileStrengthElement.textContent);
    
    // Should have profile picture (10) and skills (15) = 25%
    expect(profileStrength.strength).toBe(25);
    expect(profileStrength.label).toBe('Weak');
    expect(profileStrength.color).toBe('bg-red-500');
  });
});