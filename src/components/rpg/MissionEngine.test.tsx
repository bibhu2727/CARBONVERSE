import React from 'react';
import { render, screen } from '@testing-library/react';
import MissionEngine from './MissionEngine';

// Mock the store
jest.mock('@/store/useRPGStore', () => ({
  useRPGStore: jest.fn(() => ({
    dispatchAction: jest.fn(),
  })),
}));

jest.mock('@/store/useEngine', () => ({
  useEngine: jest.fn(() => ({
    climateIdentity: { weaknesses: ['energy'] },
  })),
  getRecommendedMissions: jest.fn(() => [
    { id: '1', title: 'Turn off lights', carbonSaved: 2, xpReward: 10, coinReward: 5 }
  ]),
}));

describe('MissionEngine Component', () => {
  it('renders recommended missions', () => {
    render(<MissionEngine />);
    expect(screen.getByText('Recommended Missions')).toBeInTheDocument();
    expect(screen.getByText('Turn off lights')).toBeInTheDocument();
  });
});
