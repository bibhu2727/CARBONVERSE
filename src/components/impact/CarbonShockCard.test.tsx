import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CarbonShockCard from './CarbonShockCard';

// Mock framer-motion to avoid animation issues in Jest
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: any) => {
      // Remove framer-motion specific props
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  TreePine: () => <div data-testid="icon-tree">Tree</div>,
  Plane: () => <div data-testid="icon-plane">Plane</div>,
  Zap: () => <div data-testid="icon-zap">Zap</div>,
  Smartphone: () => <div data-testid="icon-smartphone">Smartphone</div>,
}));

// Mock store
jest.mock('@/store/useEngine', () => ({
  useEngine: {
    getState: jest.fn().mockReturnValue({
      resetEngine: jest.fn(),
    }),
  },
}));

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('CarbonShockCard Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders carbon equivalent calculations correctly', () => {
    render(<CarbonShockCard kgCO2={1000} />);
    
    // Check main text
    expect(screen.getByText(/1000 kg CO₂/i)).toBeInTheDocument();
    
    // 1000 / 21 = 47.6 => 48
    expect(screen.getByText('48')).toBeInTheDocument();
    
    // 1000 / 500 = 2.0
    expect(screen.getByText('2.0')).toBeInTheDocument();
    
    // 1000 / 5 = 200
    expect(screen.getByText('200')).toBeInTheDocument();
    
    // 1000 * 120 = 120,000
    const expectedPhoneCharges = (120000).toLocaleString();
    expect(screen.getByText(expectedPhoneCharges)).toBeInTheDocument();
  });

  it('redirects to onboarding on update button click', () => {
    render(<CarbonShockCard kgCO2={1000} />);
    const button = screen.getByText('Update Profile Data');
    fireEvent.click(button);
    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });
});
