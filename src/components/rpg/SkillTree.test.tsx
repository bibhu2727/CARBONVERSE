import React from 'react';
import { render, screen } from '@testing-library/react';
import SkillTree from './SkillTree';

jest.mock('@/store/useRPGStore', () => ({
  useRPGStore: jest.fn(() => ({
    skillPoints: 5,
    unlockedSkills: ['solar_basics'],
    unlockSkill: jest.fn(),
  })),
}));

describe('SkillTree Component', () => {
  it('renders correctly', () => {
    render(<SkillTree />);
    expect(screen.getByText('Skill Tree')).toBeInTheDocument();
  });
});
