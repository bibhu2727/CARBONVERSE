import React from 'react';
import { render, screen } from '@testing-library/react';
import AnimalRescue from './AnimalRescue';

jest.mock('@/store/useRPGStore', () => ({
  useRPGStore: jest.fn(() => ({
    rescueTickets: 2,
    rescuedAnimals: [],
    pullGacha: jest.fn(),
  })),
}));

describe('AnimalRescue Component', () => {
  it('renders correctly', () => {
    render(<AnimalRescue />);
    expect(screen.getByText('Sanctuary')).toBeInTheDocument();
    expect(screen.getByText('Rescue Animal (1 Ticket)')).toBeInTheDocument();
  });
});
