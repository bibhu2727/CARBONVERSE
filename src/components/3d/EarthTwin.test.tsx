import React from 'react';
import { render } from '@testing-library/react';
import EarthTwin from './EarthTwin';

// Mock THREE and @react-three/fiber because WebGL is not supported in JSDOM
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div data-testid="canvas">{children}</div>,
  useFrame: jest.fn(),
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  Stars: () => <div data-testid="stars" />,
}));

jest.mock('@/store/useRPGStore', () => ({
  useRPGStore: jest.fn(() => 3), // return earthStage = 3
}));

describe('EarthTwin Component', () => {
  it('renders correctly', () => {
    const { getByTestId } = render(<EarthTwin />);
    expect(getByTestId('canvas')).toBeInTheDocument();
  });
});
