import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import InfiniteJellyBeanList from '../InfiniteJellyBeanList';
import { JellyBean } from '../../lib/api';

// Only mock external libraries, not our own components
jest.mock('react-infinite-scroll-component', () => {
  return function MockInfiniteScroll({ 
    children, 
    hasMore, 
    next, 
    loader, 
    endMessage,
    dataLength 
  }: {
    children: React.ReactNode;
    hasMore: boolean;
    next: () => void;
    loader: React.ReactNode;
    endMessage: React.ReactNode;
    dataLength: number;
  }) {
    return (
      <div data-testid="infinite-scroll">
        <div data-testid="data-length">{dataLength}</div>
        <div data-testid="has-more">{hasMore.toString()}</div>
        {children}
        {hasMore && (
          <button data-testid="load-more" onClick={next}>
            Load More
          </button>
        )}
        {hasMore && loader}
        {!hasMore && endMessage}
      </div>
    );
  };
});

// Mock Next.js Image component to avoid issues in test environment
jest.mock('next/image', () => {
  return function MockImage({ 
    src, 
    alt, 
    width, 
    height,
    ...props 
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    [key: string]: any;
  }) {
    return (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        data-testid="jelly-bean-image"
        {...props} 
      />
    );
  };
});

const createTestJellyBeans = (): JellyBean[] => [
  {
    beanId: 1,
    flavorName: 'Apple Crisp',
    description: 'Tart green apple with cinnamon spice',
    ingredients: ['sugar', 'apple extract', 'cinnamon'],
    imageUrl: '/images/apple-crisp.jpg',
    sugarFree: false,
    groupName: ['Fruit', 'Seasonal'],
    colorGroup: 'Green',
    backgroundColor: '#8FBC8F',
    glutenFree: true,
    seasonal: true,
    kosher: true,
  },
  {
    beanId: 2,
    flavorName: 'Banana Split',
    description: 'Creamy banana with vanilla notes',
    ingredients: ['sugar', 'banana extract', 'vanilla'],
    imageUrl: '/images/banana-split.jpg',
    sugarFree: true,
    groupName: ['Fruit', 'Dessert'],
    colorGroup: 'Yellow',
    backgroundColor: '#FFD700',
    glutenFree: true,
    seasonal: false,
    kosher: true,
  },
  {
    beanId: 3,
    flavorName: 'Chocolate Fudge',
    description: 'Rich dark chocolate flavor',
    ingredients: ['sugar', 'cocoa powder', 'vanilla'],
    imageUrl: '/images/chocolate-fudge.jpg',
    sugarFree: false,
    groupName: ['Dessert', 'Sweet'],
    colorGroup: 'Brown',
    backgroundColor: '#8B4513',
    glutenFree: false,
    seasonal: false,
    kosher: true,
  },
  {
    beanId: 4,
    flavorName: 'Vanilla Bean',
    description: 'Classic vanilla with real bean specks',
    ingredients: ['sugar', 'vanilla bean', 'cream'],
    imageUrl: '/images/vanilla-bean.jpg',
    sugarFree: true,
    groupName: ['Dessert'],
    colorGroup: 'White',
    backgroundColor: '#F5F5DC',
    glutenFree: true,
    seasonal: false,
    kosher: true,
  },
];

describe('InfiniteJellyBeanList Integration Tests', () => {
  const user = userEvent.setup();
  const mockJellyBeans = createTestJellyBeans();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Real Component Integration', () => {
    it('renders real JellyBeanCard components with actual content', () => {
      render(<InfiniteJellyBeanList jellyBeans={mockJellyBeans} initialPageSize={4} />);
      
      // Check that actual JellyBeanCard content is rendered
      expect(screen.getByText('Apple Crisp')).toBeInTheDocument();
      expect(screen.getByText('Banana Split')).toBeInTheDocument();
      expect(screen.getByText('Chocolate Fudge')).toBeInTheDocument();
      expect(screen.getByText('Vanilla Bean')).toBeInTheDocument();
      
      // Check descriptions are rendered
      expect(screen.getByText('Tart green apple with cinnamon spice')).toBeInTheDocument();
      expect(screen.getByText('Rich dark chocolate flavor')).toBeInTheDocument();
      
      // Check flavor groups are rendered
      expect(screen.getByText('Fruit, Seasonal')).toBeInTheDocument();
      expect(screen.getByText('Dessert, Sweet')).toBeInTheDocument();
      
      // Check sugar-free badges
      const sugarFreeBadges = screen.getAllByText('Sugar-Free');
      expect(sugarFreeBadges).toHaveLength(2); // Banana Split and Vanilla Bean
      
      // Check images are rendered with correct alt text
      expect(screen.getByAltText('Apple Crisp jelly bean - Tart green apple with cinnamon spice')).toBeInTheDocument();
      expect(screen.getByAltText('Banana Split jelly bean - Creamy banana with vanilla notes')).toBeInTheDocument();
    });

    it('renders real SortAndFilter component with dynamic options', () => {
      render(<InfiniteJellyBeanList jellyBeans={mockJellyBeans} initialPageSize={4} />);
      
      // Check that sort options are present
      const sortSelect = screen.getByLabelText('Sort by:');
      expect(sortSelect).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Name (A-Z)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Sugar-Free First' })).toBeInTheDocument();
      
      // Check that filter options are dynamically generated from data
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      expect(filterSelect).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'All Flavor Groups' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Fruit' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Dessert' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Seasonal' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Sweet' })).toBeInTheDocument();
    });

    it('handles real filtering with actual component interactions', async () => {
      render(<InfiniteJellyBeanList jellyBeans={mockJellyBeans} initialPageSize={4} />);
      
      // Initially all items should be visible
      expect(screen.getByText('Apple Crisp')).toBeInTheDocument();
      expect(screen.getByText('Chocolate Fudge')).toBeInTheDocument();
      
      // Filter by "Fruit" group
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      await user.selectOptions(filterSelect, 'Fruit');
      
      await waitFor(() => {
        // Should show only fruit items
        expect(screen.getByText('Apple Crisp')).toBeInTheDocument(); // Has 'Fruit' group
        expect(screen.getByText('Banana Split')).toBeInTheDocument(); // Has 'Fruit' group
        
        // Should not show non-fruit items
        expect(screen.queryByText('Chocolate Fudge')).not.toBeInTheDocument(); // No 'Fruit' group
        expect(screen.queryByText('Vanilla Bean')).not.toBeInTheDocument(); // No 'Fruit' group
      });
      
      // Check that count is updated correctly
      expect(screen.getByText('Showing 2 of 2 jelly beans')).toBeInTheDocument();
      expect(screen.getByText('(filtered from 4 total)')).toBeInTheDocument();
    });

    it('handles real sorting with actual component behavior', async () => {
      render(<InfiniteJellyBeanList jellyBeans={mockJellyBeans} initialPageSize={4} />);
      
      // Get initial order (should be alphabetical by name)
      const initialCards = screen.getAllByRole('article');
      expect(initialCards[0]).toHaveTextContent('Apple Crisp');
      expect(initialCards[1]).toHaveTextContent('Banana Split');
      expect(initialCards[2]).toHaveTextContent('Chocolate Fudge');
      expect(initialCards[3]).toHaveTextContent('Vanilla Bean');
      
      // Change sort to Z-A
      const sortSelect = screen.getByLabelText('Sort by:');
      await user.selectOptions(sortSelect, 'name-desc');
      
      await waitFor(() => {
        const sortedCards = screen.getAllByRole('article');
        expect(sortedCards[0]).toHaveTextContent('Vanilla Bean');
        expect(sortedCards[1]).toHaveTextContent('Chocolate Fudge');
        expect(sortedCards[2]).toHaveTextContent('Banana Split');
        expect(sortedCards[3]).toHaveTextContent('Apple Crisp');
      });
    });

    it('handles sugar-free sorting', async () => {
      render(<InfiniteJellyBeanList jellyBeans={mockJellyBeans} initialPageSize={4} />);
      
      // Sort by sugar-free first
      const sortSelect = screen.getByLabelText('Sort by:');
      await user.selectOptions(sortSelect, 'sugarFree');
      
      await waitFor(() => {
        const cards = screen.getAllByRole('article');
        
        // First two should be sugar-free (Banana Split and Vanilla Bean)
        const firstTwoCards = cards.slice(0, 2);
        firstTwoCards.forEach(card => {
          expect(card).toHaveTextContent('Sugar-Free');
        });
        
        // Last two should not have sugar-free badges
        const lastTwoCards = cards.slice(2, 4);
        lastTwoCards.forEach(card => {
          expect(card).not.toHaveTextContent('Sugar-Free');
        });
      });
    });

    it('tests real accessibility features', () => {
      render(<InfiniteJellyBeanList jellyBeans={mockJellyBeans} initialPageSize={4} />);
      
      // Check main landmarks
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Filter and Sort Controls' })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: 'Jelly bean products' })).toBeInTheDocument();
      
      // Check article structure
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(4);
      
      // Check that each article has proper labeling
      articles.forEach((article, index) => {
        const jellyBean = mockJellyBeans[index];
        expect(article).toHaveAttribute('aria-labelledby', `jelly-bean-title-${jellyBean.beanId}`);
      });
      
      // Check live regions for dynamic content
      expect(screen.getByRole('status', { name: 'Results count' })).toBeInTheDocument();
      
      // Check form labels
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Flavor Group:')).toBeInTheDocument();
    });

    it('handles combined filter and sort operations', async () => {
      render(<InfiniteJellyBeanList jellyBeans={mockJellyBeans} initialPageSize={4} />);
      
      // Filter by Dessert group
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      await user.selectOptions(filterSelect, 'Dessert');
      
      await waitFor(() => {
        // Should show Banana Split, Chocolate Fudge, and Vanilla Bean
        expect(screen.getByText('Banana Split')).toBeInTheDocument();
        expect(screen.getByText('Chocolate Fudge')).toBeInTheDocument();
        expect(screen.getByText('Vanilla Bean')).toBeInTheDocument();
        expect(screen.queryByText('Apple Crisp')).not.toBeInTheDocument();
      });
      
      // Now sort by sugar-free first
      const sortSelect = screen.getByLabelText('Sort by:');
      await user.selectOptions(sortSelect, 'sugarFree');
      
      await waitFor(() => {
        const cards = screen.getAllByRole('article');
        
        // First two should be sugar-free desserts (Banana Split, Vanilla Bean)
        expect(cards[0]).toHaveTextContent('Banana Split');
        expect(cards[0]).toHaveTextContent('Sugar-Free');
        expect(cards[1]).toHaveTextContent('Vanilla Bean');
        expect(cards[1]).toHaveTextContent('Sugar-Free');
        
        // Last should be regular dessert (Chocolate Fudge)
        expect(cards[2]).toHaveTextContent('Chocolate Fudge');
        expect(cards[2]).not.toHaveTextContent('Sugar-Free');
      });
    });

    it('handles empty results styling', () => {
      // Test with empty dataset from the start
      render(<InfiniteJellyBeanList jellyBeans={[]} initialPageSize={4} />);
      
      // Should show empty state message
      expect(screen.getByText('No jelly beans found matching your criteria.')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters or search terms')).toBeInTheDocument();
      
      // Should not show any product cards
      expect(screen.queryByRole('article')).not.toBeInTheDocument();
      
      // Should show 0 results count
      expect(screen.getByText('Showing 0 of 0 jelly beans')).toBeInTheDocument();
      
      // Should still render filter controls (though they'll be empty)
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Flavor Group:')).toBeInTheDocument();
    });
  });
});
