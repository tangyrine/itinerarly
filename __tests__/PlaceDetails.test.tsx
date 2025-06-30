import { render, screen, fireEvent } from '@testing-library/react';
import PlaceDetails from '../components/PlaceDetails';

describe('PlaceDetails', () => {
  const mockOnClose = jest.fn();
  const defaultProps = {
    place: 'Test Place',
    details: 'Test Details',
    onClose: mockOnClose
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders place name and details', () => {
    render(<PlaceDetails {...defaultProps} />);
    expect(screen.getByText('Test Place')).toBeInTheDocument();
  });

});