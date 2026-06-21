import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EcoBuilder from './EcoBuilder';
import { useRPGStore } from '@/store/useRPGStore';

// Mock framer-motion to avoid animation issues in Jest
jest.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...props }: { children: React.ReactNode }) => {
      // Remove framer-motion specific props
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { initial, animate, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Leaf: () => <div data-testid="icon-leaf">Leaf</div>,
  Sun: () => <div data-testid="icon-sun">Sun</div>,
  Wind: () => <div data-testid="icon-wind">Wind</div>,
  Droplets: () => <div data-testid="icon-droplets">Droplets</div>,
  Package: () => <div data-testid="icon-package">Package</div>,
}));

// Mock the store
jest.mock('@/store/useRPGStore', () => ({
  useRPGStore: jest.fn(),
}));

describe('EcoBuilder Component', () => {
  beforeEach(() => {
    (useRPGStore as unknown as jest.Mock).mockReturnValue({
      ecoMaterials: 500,
      placedItems: [{ id: '1', type: 'tree', x: 50, y: 50 }],
      buyAndPlaceItem: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders active structures and materials correctly', () => {
    render(<EcoBuilder />);
    
    expect(screen.getByText('Eco Builder')).toBeInTheDocument();
    // 500 eco materials, since there's an icon, checking the text next to it
    expect(screen.getByText(/500/)).toBeInTheDocument();
    expect(screen.getByText('Active Structures: 1')).toBeInTheDocument();
  });

  it('renders buttons with correct state based on ecoMaterials', () => {
    render(<EcoBuilder />);
    
    const plantTreeButton = screen.getByText('Plant Tree').closest('button');
    const solarPanelButton = screen.getByText('Solar Panel').closest('button');
    const windTurbineButton = screen.getByText('Wind Turbine').closest('button'); // costs 200
    
    expect(plantTreeButton).not.toBeDisabled();
    expect(solarPanelButton).not.toBeDisabled();
    expect(windTurbineButton).not.toBeDisabled();
  });

  it('disables buttons when ecoMaterials are insufficient', () => {
    (useRPGStore as unknown as jest.Mock).mockReturnValue({
      ecoMaterials: 100, // Can afford tree (50), water (100) but not solar (150) or wind (200)
      placedItems: [],
      buyAndPlaceItem: jest.fn(),
    });

    render(<EcoBuilder />);
    
    const plantTreeButton = screen.getByText('Plant Tree').closest('button');
    const solarPanelButton = screen.getByText('Solar Panel').closest('button');
    
    expect(plantTreeButton).not.toBeDisabled();
    expect(solarPanelButton).toBeDisabled();
  });

  it('calls buyAndPlaceItem when clicking a purchasable item', () => {
    const mockBuyAndPlaceItem = jest.fn();
    (useRPGStore as unknown as jest.Mock).mockReturnValue({
      ecoMaterials: 200,
      placedItems: [],
      buyAndPlaceItem: mockBuyAndPlaceItem,
    });

    render(<EcoBuilder />);
    
    const plantTreeButton = screen.getByText('Plant Tree').closest('button');
    if (plantTreeButton) {
      fireEvent.click(plantTreeButton);
    }
    
    expect(mockBuyAndPlaceItem).toHaveBeenCalledWith('tree');
  });
});
