import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from '../dashboard/PropertyCard';
import { Property } from '@prisma/client';

const mockProperty: Property = {
  id: '1',
  url: 'https://example.com/property/1',
  title: 'Beautiful 3-room apartment',
  price: 500000,
  pricePerM2: 8333,
  area: 60,
  rooms: 3,
  floor: 2,
  totalFloors: 5,
  address: 'ul. Testowa 1, Warszawa',
  city: 'Warszawa',
  photos: ['photo1.jpg', 'photo2.jpg'],
  source: 'OTODOM',
  isActive: true,
  marketValue: 550000,
  investmentScore: 85,
  renovationCost: 20000,
  potentialRent: 3000,
  roi: 6.5,
  firstSeenAt: new Date(),
  lastUpdatedAt: new Date(),
  scrapedAt: new Date(),
};

describe('PropertyCard', () => {
  const mockOnSave = jest.fn();
  const mockOnCreateAlert = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render property information correctly', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onSaveToFavorites={mockOnSave}
        onCreateAlert={mockOnCreateAlert}
      />
    );

    expect(screen.getByText('Beautiful 3-room apartment')).toBeInTheDocument();
    expect(screen.getByText('500 000 zł')).toBeInTheDocument();
    expect(screen.getByText('60 m²')).toBeInTheDocument();
    expect(screen.getByText('3 pokoje')).toBeInTheDocument();
    expect(screen.getByText('Warszawa')).toBeInTheDocument();
  });

  it('should display investment score with correct color coding', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onSaveToFavorites={mockOnSave}
        onCreateAlert={mockOnCreateAlert}
      />
    );

    const scoreElement = screen.getByText('85');
    expect(scoreElement).toBeInTheDocument();
    expect(scoreElement).toHaveClass('bg-green-500'); // High score = green
  });

  it('should call onSaveToFavorites when save button is clicked', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onSaveToFavorites={mockOnSave}
        onCreateAlert={mockOnCreateAlert}
      />
    );

    const saveButton = screen.getByLabelText('Add to favorites');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledWith('1');
  });

  it('should call onCreateAlert when alert button is clicked', () => {
    render(
      <PropertyCard
        property={mockProperty}
        onSaveToFavorites={mockOnSave}
        onCreateAlert={mockOnCreateAlert}
      />
    );

    const alertButton = screen.getByLabelText('Create alert');
    fireEvent.click(alertButton);

    expect(mockOnCreateAlert).toHaveBeenCalledWith('1');
  });

  it('should show undervalued badge when property is below market value', () => {
    const undervaluedProperty = {
      ...mockProperty,
      price: 400000,
      marketValue: 550000,
    };

    render(
      <PropertyCard
        property={undervaluedProperty}
        onSaveToFavorites={mockOnSave}
        onCreateAlert={mockOnCreateAlert}
      />
    );

    expect(screen.getByText('Niedowartościowane')).toBeInTheDocument();
  });
});
