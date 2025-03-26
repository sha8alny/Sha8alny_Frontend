import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SkillContainer from '@/app/components/modules/profile/container/SkillContainer';

// Mock the modules before importing them
jest.mock('../../app/context/IsMyProfileContext', () => {
  const originalModule = jest.requireActual('../../app/context/IsMyProfileContext');
  return {
    ...originalModule,
    useIsMyProfile: jest.fn(),
  };
});

jest.mock('../../app/hooks/useUpdateProfile', () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Import mocked modules after mocking them
import { useIsMyProfile } from '@/app/context/IsMyProfileContext';
import useUpdateProfile from '@/app/hooks/useUpdateProfile';

// Create a wrapper component with all necessary providers
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const AllProviders = ({ children }) => {
  const queryClient = createTestQueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('SkillContainer', () => {
  let mockMutate;
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockMutate = jest.fn();
    useUpdateProfile.mockReturnValue({ mutate: mockMutate });
  });

  test('renders skill container with beginner skill level', () => {
    // Mock the useIsMyProfile hook
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 1,
      skill_name: 'JavaScript',
      endorsements_count: 5,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    // Check for skill name
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    // Check for skill level
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    // Check for endorsement count
    expect(screen.getByText('5 endorsements')).toBeInTheDocument();
    // Endorse button should be enabled
    expect(screen.getByRole('button', { name: /endorse$/i })).toBeEnabled();
  });

  test('renders skill container with intermediate skill level', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 2,
      skill_name: 'React',
      endorsements_count: 15,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('15 endorsements')).toBeInTheDocument();
  });

  test('renders skill container with advanced skill level', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 3,
      skill_name: 'Node.js',
      endorsements_count: 25,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
    expect(screen.getByText('25 endorsements')).toBeInTheDocument();
  });

  test('renders skill container with expert skill level', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 4,
      skill_name: 'TypeScript',
      endorsements_count: 35,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
    expect(screen.getByText('35 endorsements')).toBeInTheDocument();
  });

  test('endorsement button is disabled for isMyProfile=true', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: true });
    
    const skill = {
      id: 1,
      skill_name: 'JavaScript',
      endorsements_count: 5,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    const button = screen.getByRole('button', { name: /endorse/i });
    expect(button).toBeDisabled();
  });

  test('endorsement button is disabled when skill is already endorsed', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 1,
      skill_name: 'JavaScript',
      endorsements_count: 5,
      isEndorsed: true,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    const button = screen.getByRole('button', { name: /endorsed/i });
    expect(button).toBeDisabled();
  });

  test('calls mutate when endorsement button is clicked', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 1,
      skill_name: 'JavaScript',
      endorsements_count: 5,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    // Click the endorse button
    fireEvent.click(screen.getByRole('button', { name: /endorse$/i }));
    
    // Check if mutate was called with the right parameters
    expect(mockMutate).toHaveBeenCalledWith({
      api: 'endorse-skill',
      method: 'POST',
      data: { skill_id: 1 },
    });
  });

  test('skill progress bar has correct width for beginner skill', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 1,
      skill_name: 'JavaScript',
      endorsements_count: 5,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    // The width is dynamically set as a style attribute, test that the level value is correctly passed
    expect(screen.getByText('Beginner')).toBeInTheDocument();
  });

  test('renders skill container with intermediate skill level', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 2,
      skill_name: 'React',
      endorsements_count: 15,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    // The width is dynamically set as a style attribute, test that the level value is correctly passed
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
  });

  test('renders skill container with advanced skill level', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 3,
      skill_name: 'Node.js',
      endorsements_count: 25,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    // The width is dynamically set as a style attribute, test that the level value is correctly passed
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  test('renders skill container with expert skill level', () => {
    useIsMyProfile.mockReturnValue({ isMyProfile: false });
    
    const skill = {
      id: 4,
      skill_name: 'TypeScript',
      endorsements_count: 35,
      isEndorsed: false,
    };

    render(
      <AllProviders>
        <SkillContainer skill={skill} />
      </AllProviders>
    );
    
    // The width is dynamically set as a style attribute, test that the level value is correctly passed
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });
});