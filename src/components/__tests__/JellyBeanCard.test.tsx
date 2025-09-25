import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JellyBeanCard from '../JellyBeanCard';
import { JellyBean } from '../../lib/api';

// Mock Next.js Image component
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

describe('JellyBeanCard Component', () => {
  const mockJellyBean: JellyBean = {
    beanId: 1,
    flavorName: 'Strawberry Cheesecake',
    description: 'Rich and creamy strawberry cheesecake flavor',
    ingredients: ['sugar', 'strawberry extract', 'cream cheese powder'],
    imageUrl: '/images/strawberry-cheesecake.jpg',
    sugarFree: false,
    groupName: ['Dessert', 'Fruit'],
    colorGroup: 'Pink',
    backgroundColor: '#FFB6C1',
    glutenFree: true,
    seasonal: false,
    kosher: true,
  };

  const mockSugarFreeJellyBean: JellyBean = {
    ...mockJellyBean,
    beanId: 2,
    flavorName: 'Sugar-Free Vanilla',
    description: 'Classic vanilla without the sugar',
    sugarFree: true,
    groupName: ['Dessert'],
  };

  const mockJellyBeanWithoutIngredients: JellyBean = {
    ...mockJellyBean,
    beanId: 3,
    flavorName: 'Mystery Flavor',
    description: 'A mysterious flavor profile',
    ingredients: [],
    groupName: [],
  };

  describe('Basic Rendering', () => {
    it('renders jelly bean information correctly', () => {
      render(<JellyBeanCard jellyBean={mockJellyBean} />);
      
      // Check flavor name
      expect(screen.getByText('Strawberry Cheesecake')).toBeInTheDocument();
      
      // Check description
      expect(screen.getByText('Rich and creamy strawberry cheesecake flavor')).toBeInTheDocument();
      
      // Check flavor groups
      expect(screen.getByText('Dessert, Fruit')).toBeInTheDocument();
      
      // Check ingredients
      expect(screen.getByText('sugar, strawberry extract, cream cheese powder')).toBeInTheDocument();
      
      // Check image
      const image = screen.getByTestId('jelly-bean-image');
      expect(image).toHaveAttribute('src', '/images/strawberry-cheesecake.jpg');
      expect(image).toHaveAttribute('alt', 'Strawberry Cheesecake jelly bean - Rich and creamy strawberry cheesecake flavor');
      expect(image).toHaveAttribute('width', '120');
      expect(image).toHaveAttribute('height', '120');
    });

    it('renders with correct test id', () => {
      render(<JellyBeanCard jellyBean={mockJellyBean} />);
      
      expect(screen.getByTestId('jelly-bean-1')).toBeInTheDocument();
    });

    it('renders as an article with proper aria attributes', () => {
      render(<JellyBeanCard jellyBean={mockJellyBean} />);
      
      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
      expect(article).toHaveAttribute('aria-labelledby', 'jelly-bean-title-1');
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveAttribute('id', 'jelly-bean-title-1');
      expect(title).toHaveAttribute('data-testid', 'flavor-name');
    });
  });

  describe('Sugar-Free Badge', () => {
    it('shows sugar-free badge when sugarFree is true', () => {
      render(<JellyBeanCard jellyBean={mockSugarFreeJellyBean} />);
      
      const badge = screen.getByText('Sugar-Free');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('role', 'img');
      expect(badge).toHaveAttribute('aria-label', 'Sugar-free product');
    });

    it('does not show sugar-free badge when sugarFree is false', () => {
      render(<JellyBeanCard jellyBean={mockJellyBean} />);
      
      expect(screen.queryByText('Sugar-Free')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty ingredients array', () => {
      render(<JellyBeanCard jellyBean={mockJellyBeanWithoutIngredients} />);
      
      // Should not render ingredients section
      expect(screen.queryByText('Ingredients:')).not.toBeInTheDocument();
      
      // Other content should still render
      expect(screen.getByText('Mystery Flavor')).toBeInTheDocument();
      expect(screen.getByText('A mysterious flavor profile')).toBeInTheDocument();
    });

    it('handles empty groupName array', () => {
      render(<JellyBeanCard jellyBean={mockJellyBeanWithoutIngredients} />);
      
      // Should render empty string for flavor groups
      const flavorGroupsSection = screen.getByText('Flavor Groups:').parentElement;
      expect(flavorGroupsSection).toHaveTextContent('Flavor Groups:');
      
      // Should not cause any errors
      expect(screen.getByTestId('jelly-bean-3')).toBeInTheDocument();
    });

    it('handles long flavor names and descriptions', () => {
      const longNameJellyBean: JellyBean = {
        ...mockJellyBean,
        beanId: 4,
        flavorName: 'Super Ultra Mega Delicious Strawberry Cheesecake Supreme With Extra Cream',
        description: 'This is an extremely long description that goes on and on about how amazing this jelly bean flavor is, with lots of details about the taste profile, ingredients, and manufacturing process that makes it so special and unique.',
      };

      render(<JellyBeanCard jellyBean={longNameJellyBean} />);
      
      expect(screen.getByText(longNameJellyBean.flavorName)).toBeInTheDocument();
      expect(screen.getByText(longNameJellyBean.description)).toBeInTheDocument();
    });

    it('handles special characters in flavor names and descriptions', () => {
      const specialCharJellyBean: JellyBean = {
        ...mockJellyBean,
        beanId: 5,
        flavorName: "Mom's Apple Pie & Ice Cream",
        description: 'A flavor that says "wow!" with 100% authentic taste',
        ingredients: ['sugar', 'apple & cinnamon', '"natural" flavoring'],
      };

      render(<JellyBeanCard jellyBean={specialCharJellyBean} />);
      
      expect(screen.getByText("Mom's Apple Pie & Ice Cream")).toBeInTheDocument();
      expect(screen.getByText('A flavor that says "wow!" with 100% authentic taste')).toBeInTheDocument();
      expect(screen.getByText('sugar, apple & cinnamon, "natural" flavoring')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<JellyBeanCard jellyBean={mockJellyBean} />);
      
      // Should be an article
      const article = screen.getByRole('article');
      expect(article).toBeInTheDocument();
      
      // Should have a heading
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('Strawberry Cheesecake');
      
      // Should have proper image alt text - use testid since there are multiple img roles
      const image = screen.getByTestId('jelly-bean-image');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('alt', expect.stringContaining('Strawberry Cheesecake jelly bean'));
    });

    it('has proper aria labels for content sections', () => {
      render(<JellyBeanCard jellyBean={mockJellyBean} />);
      
      // Check flavor groups section
      expect(screen.getByLabelText('Flavor categories')).toBeInTheDocument();
      expect(screen.getByLabelText('Categories: Dessert, Fruit')).toBeInTheDocument();
      
      // Check description
      expect(screen.getByLabelText('Product description: Rich and creamy strawberry cheesecake flavor')).toBeInTheDocument();
      
      // Check ingredients
      expect(screen.getByLabelText('Product ingredients')).toBeInTheDocument();
      expect(screen.getByLabelText('Ingredients list: sugar, strawberry extract, cream cheese powder')).toBeInTheDocument();
    });

    it('has proper image accessibility attributes', () => {
      render(<JellyBeanCard jellyBean={mockJellyBean} />);
      
      // Check image container
      const imageContainer = screen.getByLabelText('Image of Strawberry Cheesecake jelly bean');
      expect(imageContainer).toHaveAttribute('role', 'img');
      
      // Check actual image
      const image = screen.getByTestId('jelly-bean-image');
      expect(image).toHaveAttribute('alt', 'Strawberry Cheesecake jelly bean - Rich and creamy strawberry cheesecake flavor');
    });

    it('has proper sugar-free badge accessibility', () => {
      render(<JellyBeanCard jellyBean={mockSugarFreeJellyBean} />);
      
      const badge = screen.getByText('Sugar-Free');
      expect(badge).toHaveAttribute('role', 'img');
      expect(badge).toHaveAttribute('aria-label', 'Sugar-free product');
    });
  });

  describe('Content Truncation and Layout', () => {
    it('handles content that might overflow', () => {
      const overflowJellyBean: JellyBean = {
        ...mockJellyBean,
        beanId: 6,
        flavorName: 'This is an extremely long flavor name that might cause layout issues',
        description: 'This is a very long description that contains a lot of text and might cause the card to expand beyond its intended dimensions or cause text overflow issues in the layout',
        ingredients: [
          'sugar', 'extremely long ingredient name that goes on and on',
          'another very long ingredient name', 'short one', 'medium length ingredient',
          'yet another ingredient with a very descriptive and long name'
        ],
      };

      render(<JellyBeanCard jellyBean={overflowJellyBean} />);
      
      // Should still render without errors
      expect(screen.getByTestId('jelly-bean-6')).toBeInTheDocument();
      expect(screen.getByText(overflowJellyBean.flavorName)).toBeInTheDocument();
      expect(screen.getByText(overflowJellyBean.description)).toBeInTheDocument();
      
      // Check that ingredients are properly joined
      const expectedIngredients = overflowJellyBean.ingredients.join(', ');
      expect(screen.getByText(expectedIngredients)).toBeInTheDocument();
    });
  });
});
