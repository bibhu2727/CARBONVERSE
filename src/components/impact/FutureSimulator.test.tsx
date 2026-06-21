import React from 'react';
import { render, screen } from '@testing-library/react';
import FutureSimulator from './FutureSimulator';

describe('FutureSimulator Component', () => {
  it('renders correctly', () => {
    render(<FutureSimulator />);
    expect(screen.getByText(/Future Self 2035/i)).toBeInTheDocument();
  });
});
