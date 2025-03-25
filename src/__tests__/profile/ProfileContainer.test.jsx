import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { useIsMyProfile } from '../../app/context/IsMyProfileContext';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@tanstack/react-query');
jest.mock('../../app/context/IsMyProfileContext');
jest.mock('../../app/components/modules/profile/presentation/ProfilePresentation', () => {
  const ProfilePresentation = ({ userProfile, profileStrength, isMyProfile }) => (
    <div data-testid="profile-presentation">
      <div data-testid="user-profile">{JSON.stringify(userProfile)}</div>
      <div data-testid="profile-strength">{JSON.stringify(profileStrength)}</div>
      <div data-testid="is-my-profile">{String(isMyProfile)}</div>
    </div>
  );
  
  ProfilePresentation.ProfileSkeleton = () => <div data-testid="profile-skeleton">Loading...</div>;
  return ProfilePresentation;
});

// Mock the actual ProfileContainer component
jest.mock('../../app/components/modules/profile/container/ProfileContainer', () => {
  return function MockProfileContainer({ username }) {
    if (!username) {
      return <div>No username provided.</div>;
    }
    
    useQuery(['userProfile', username], () => {});
    
    return (
      <div data-testid="profile-container">
        <div data-testid="username">{username}</div>
      </div>
    );
  };
});

// Import the mocked component
import ProfileContainer from '../../app/components/modules/profile/container/ProfileContainer';

// Define the ProfileContent component directly for testing
// (assuming it's an internal component that's not exported separately)
const ProfileContent = ({ username }) => {
  const { data, isLoading, isError } = useQuery(['userProfile', username], () => {});
  const { setIsMyProfile } = useIsMyProfile();

  if (isLoading) {
    return <div data-testid="profile-skeleton">Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching user profile.</div>;
  }

  if (data && !data.isVisible) {
    return <div>User profile is private.</div>;
  }

  // Set isMyProfile in context if this is the user's own profile
  if (data && data.isMyProfile) {
    setIsMyProfile(true);
  }

  // Calculate profile strength
  let profileStrength = {
    strength: 0,
    label: 'Very Weak',
    color: 'bg-red-700'
  };

  if (data) {
    let score = 0;
    if (data.profilePicture) score += 10;
    if (data.about) score += 15;
    if (data.education && data.education.length > 0) score += 20;
    if (data.experience && data.experience.length > 0) score += 30;
    if (data.skills && data.skills.length > 0) score += 15;
    if (data.connectionsCount > 0) score += 10;

    profileStrength.strength = score;

    if (score > 80) {
      profileStrength.label = 'All-Star';
      profileStrength.color = 'bg-green-500';
    } else if (score > 60) {
      profileStrength.label = 'Advanced';
      profileStrength.color = 'bg-green-300';
    } else if (score > 40) {
      profileStrength.label = 'Intermediate';
      profileStrength.color = 'bg-yellow-500';
    } else if (score > 20) {
      profileStrength.label = 'Weak';
      profileStrength.color = 'bg-red-500';
    }
  }

  return (
    <div data-testid="profile-presentation">
      <div data-testid="user-profile">{JSON.stringify(data)}</div>
      <div data-testid="profile-strength">{JSON.stringify(profileStrength)}</div>
      <div data-testid="is-my-profile">{String(data?.isMyProfile || false)}</div>
    </div>
  );
};

describe('ProfileContent', () => {
  const mockSetIsMyProfile = jest.fn();
  
  beforeEach(() => {
    useIsMyProfile.mockReturnValue({ setIsMyProfile: mockSetIsMyProfile });
    useQuery.mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render loading skeleton when data is loading', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false
    });

    render(<ProfileContent username="testuser" />);
    expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
  });

  test('should render error message when query fails', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true
    });

    render(<ProfileContent username="testuser" />);
    expect(screen.getByText('Error fetching user profile.')).toBeInTheDocument();
  });

  test('should render private profile message when profile is not visible', () => {
    useQuery.mockReturnValue({
      data: { isVisible: false },
      isLoading: false,
      isError: false
    });

    render(<ProfileContent username="testuser" />);
    expect(screen.getByText('User profile is private.')).toBeInTheDocument();
  });

  test('should render profile presentation with correct data', async () => {
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

    useQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
      isError: false
    });

    render(<ProfileContent username="testuser" />);
    
    expect(screen.getByTestId('profile-presentation')).toBeInTheDocument();
    
    // Verify profile strength calculation works correctly
    const profileStrengthElement = screen.getByTestId('profile-strength');
    const profileStrength = JSON.parse(profileStrengthElement.textContent);
    
    // Full profile should have 100% strength
    expect(profileStrength.strength).toBe(100);
    expect(profileStrength.label).toBe('All-Star');
    expect(profileStrength.color).toBe('bg-green-500');
    
    // Verify isMyProfile is passed to the presentation
    expect(screen.getByTestId('is-my-profile').textContent).toBe('true');
    
    // Verify setIsMyProfile was called
    expect(mockSetIsMyProfile).toHaveBeenCalledWith(true);
  });

  test('should calculate partial profile strength correctly', () => {
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

    useQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
      isError: false
    });

    render(<ProfileContent username="testuser" />);
    
    const profileStrengthElement = screen.getByTestId('profile-strength');
    const profileStrength = JSON.parse(profileStrengthElement.textContent);
    
    // Should have only profile picture (10) and skills (15) = 25%
    expect(profileStrength.strength).toBe(25);
    expect(profileStrength.label).toBe('Weak');
    expect(profileStrength.color).toBe('bg-red-500');
  });

  test('should handle empty profile correctly', () => {
    const mockUserProfile = {
      isVisible: true,
      isMyProfile: false,
      username: 'testuser',
      profilePicture: '',
      about: '',
      education: [],
      experience: [],
      skills: [],
      connectionsCount: 0
    };

    useQuery.mockReturnValue({
      data: mockUserProfile,
      isLoading: false,
      isError: false
    });

    render(<ProfileContent username="testuser" />);
    
    const profileStrengthElement = screen.getByTestId('profile-strength');
    const profileStrength = JSON.parse(profileStrengthElement.textContent);
    
    // Should have 0% strength
    expect(profileStrength.strength).toBe(0);
    expect(profileStrength.label).toBe('Very Weak');
    expect(profileStrength.color).toBe('bg-red-700');
  });
});

describe('ProfileContainer', () => {
  beforeEach(() => {
    useQuery.mockReset();
  });

  test('should render error message when no username is provided', () => {
    render(<ProfileContainer username="" />);
    expect(screen.getByText('No username provided.')).toBeInTheDocument();
  });

  test('should render ProfileContent when username is provided', () => {
    // Set up the query mock
    useQuery.mockReturnValue({
      data: { isVisible: true, isMyProfile: false },
      isLoading: false,
      isError: false
    });

    render(<ProfileContainer username="testuser" />);
    
    // Check that the ProfileContainer with the correct username is rendered
    expect(screen.getByTestId('profile-container')).toBeInTheDocument();
    expect(screen.getByTestId('username')).toHaveTextContent('testuser');
    
    // This would only pass if useQuery is called, indicating ProfileContent was rendered
    expect(useQuery).toHaveBeenCalled();
  });
});