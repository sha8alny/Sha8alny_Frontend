import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModSkill from '@/app/components/modules/profile/container/ModSkill';

// Create mock mutate function that can be referenced in tests
const mockMutate = jest.fn();

// Mock the entire hook module
jest.mock('../../app/hooks/useUpdateProfile', () => ({
  __esModule: true,
  default: () => ({
    mutate: mockMutate,
    isLoading: false
  })
}));

// Mock dependencies
jest.mock('../../app/components/ui/DialogMod', () => ({
  __esModule: true,
  default: ({ buttonData, AlertContent }) => (
    <div data-testid="dialog-mock">
      <div data-testid="button-container">{buttonData}</div>
      <div data-testid="content-container">{AlertContent}</div>
    </div>
  ),
}));

jest.mock('../../app/components/ui/AddButton', () => ({
  __esModule: true,
  default: () => <button data-testid="add-button">Add</button>,
}));

jest.mock('../../app/components/modules/profile/presentation/ModSkillPresentation', () => ({
  __esModule: true,
  default: ({ skills, isLoading, setSearchTerm, updateSkill, searchTerm }) => (
    <div data-testid="mod-skill-presentation">
      <input
        data-testid="search-input"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button data-testid="add-skill-button" onClick={() => updateSkill(0, searchTerm)}>
        Add Skill
      </button>
      <ul>
        {skills.map((skill) => (
          <li key={skill.skill_name} data-testid="skill-item">
            {skill.skill_name}
            <button
              data-testid={`delete-${skill.skill_name}`}
              onClick={() => updateSkill(2, skill.skill_name)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  ),
}));

describe('ModSkill Component', () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the component correctly', () => {
    const skills = [
      { skill_name: 'JavaScript' },
      { skill_name: 'React' },
    ];
    render(<ModSkill skills={skills} />);
    
    expect(screen.getByTestId('dialog-mock')).toBeInTheDocument();
    expect(screen.getByTestId('mod-skill-presentation')).toBeInTheDocument();
    expect(screen.getAllByTestId('skill-item')).toHaveLength(2);
  });

  test('filters skills based on search term', () => {
    const skills = [
      { skill_name: 'JavaScript' },
      { skill_name: 'React' },
      { skill_name: 'TypeScript' },
    ];
    render(<ModSkill skills={skills} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Script' } });
    
    const skillItems = screen.getAllByTestId('skill-item');
    expect(skillItems).toHaveLength(2);
    expect(skillItems[0].textContent).toContain('JavaScript');
    expect(skillItems[1].textContent).toContain('TypeScript');
  });

  test('adds a new skill', () => {
    const skills = [{ skill_name: 'JavaScript' }];
    render(<ModSkill skills={skills} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'React' } });
    
    const addSkillButton = screen.getByTestId('add-skill-button');
    fireEvent.click(addSkillButton);
    
    expect(mockMutate).toHaveBeenCalledWith({
      api: 'add-skill',
      method: 'POST',
      data: { skill_name: 'React' },
    });
  });

  test('does not add an empty skill', () => {
    const skills = [{ skill_name: 'JavaScript' }];
    render(<ModSkill skills={skills} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: '   ' } });
    
    const addSkillButton = screen.getByTestId('add-skill-button');
    fireEvent.click(addSkillButton);
    
    expect(mockMutate).not.toHaveBeenCalled();
  });

  test('does not add a duplicate skill', () => {
    const skills = [{ skill_name: 'JavaScript' }];
    render(<ModSkill skills={skills} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'JavaScript' } });
    
    const addSkillButton = screen.getByTestId('add-skill-button');
    fireEvent.click(addSkillButton);
    
    expect(mockMutate).not.toHaveBeenCalled();
  });

  test('deletes a skill', () => {
    const skills = [
      { skill_name: 'JavaScript' },
      { skill_name: 'React' },
    ];
    render(<ModSkill skills={skills} />);
    
    const deleteButton = screen.getByTestId('delete-JavaScript');
    fireEvent.click(deleteButton);
    
    expect(mockMutate).toHaveBeenCalledWith({
      api: 'delete-skill',
      method: 'DELETE',
      data: { skill_name: 'JavaScript' },
    });
  });

  test('handles null skills prop gracefully', () => {
    render(<ModSkill skills={null} />);
    expect(screen.getByTestId('mod-skill-presentation')).toBeInTheDocument();
    expect(screen.queryAllByTestId('skill-item')).toHaveLength(0);
  });

  test('resets search term after adding skill', () => {
    const skills = [{ skill_name: 'JavaScript' }];
    render(<ModSkill skills={skills} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'React' } });
    
    const addSkillButton = screen.getByTestId('add-skill-button');
    fireEvent.click(addSkillButton);
    
    expect(searchInput.value).toBe('');
  });

  test('case insensitive skill filtering', () => {
    const skills = [
      { skill_name: 'JavaScript' },
      { skill_name: 'Python' },
    ];
    render(<ModSkill skills={skills} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'javascript' } });
    
    const skillItems = screen.getAllByTestId('skill-item');
    expect(skillItems).toHaveLength(1);
    expect(skillItems[0].textContent).toContain('JavaScript');
  });
});