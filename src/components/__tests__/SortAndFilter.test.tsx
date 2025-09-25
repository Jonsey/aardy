import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SortAndFilter from '../SortAndFilter';
import { JellyBean } from '../../lib/api';

describe('SortAndFilter Component', () => {
  const user = userEvent.setup();
  
  const mockOnSort = jest.fn();
  const mockOnFilter = jest.fn();

  const mockJellyBeans: JellyBean[] = [
    {
      beanId: 1,
      flavorName: 'Apple',
      description: 'Green apple flavor',
      ingredients: ['sugar', 'apple'],
      imageUrl: 'apple.jpg',
      sugarFree: false,
      groupName: ['Fruit'],
      colorGroup: 'Green',
      backgroundColor: '#00FF00',
      glutenFree: true,
      seasonal: false,
      kosher: true,
    },
    {
      beanId: 2,
      flavorName: 'Chocolate',
      description: 'Rich chocolate flavor',
      ingredients: ['sugar', 'cocoa'],
      imageUrl: 'chocolate.jpg',
      sugarFree: false,
      groupName: ['Dessert', 'Sweet'],
      colorGroup: 'Brown',
      backgroundColor: '#8B4513',
      glutenFree: false,
      seasonal: false,
      kosher: true,
    },
    {
      beanId: 3,
      flavorName: 'Vanilla',
      description: 'Classic vanilla flavor',
      ingredients: ['sugar', 'vanilla'],
      imageUrl: 'vanilla.jpg',
      sugarFree: true,
      groupName: ['Dessert'],
      colorGroup: 'White',
      backgroundColor: '#FFFFFF',
      glutenFree: true,
      seasonal: false,
      kosher: true,
    },
    {
      beanId: 4,
      flavorName: 'Strawberry',
      description: 'Sweet strawberry flavor',
      ingredients: ['sugar', 'strawberry'],
      imageUrl: 'strawberry.jpg',
      sugarFree: false,
      groupName: ['Fruit', 'Berry'],
      colorGroup: 'Red',
      backgroundColor: '#FF0000',
      glutenFree: true,
      seasonal: true,
      kosher: true,
    },
  ];

  const defaultProps = {
    jellyBeans: mockJellyBeans,
    onSort: mockOnSort,
    onFilter: mockOnFilter,
    sortBy: 'name',
    filterBy: '',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders sort and filter controls', () => {
      render(<SortAndFilter {...defaultProps} />);
      
      // Check sort control
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
      const sortSelect = screen.getByRole('combobox', { name: 'Sort by:' });
      expect(sortSelect).toBeInTheDocument();
      expect(sortSelect).toHaveValue('name');
      
      // Check filter control
      expect(screen.getByLabelText('Filter by Flavor Group:')).toBeInTheDocument();
      const filterSelect = screen.getByRole('combobox', { name: 'Filter by Flavor Group:' });
      expect(filterSelect).toBeInTheDocument();
      expect(filterSelect).toHaveValue('');
    });

    it('renders all sort options', () => {
      render(<SortAndFilter {...defaultProps} />);
      
      expect(screen.getByRole('option', { name: 'Name (A-Z)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Name (Z-A)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Flavor Group (A-Z)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Flavor Group (Z-A)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Sugar-Free First' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Regular First' })).toBeInTheDocument();
    });

    it('generates dynamic filter options from jelly bean data', () => {
      render(<SortAndFilter {...defaultProps} />);
      
      // Should have "All Flavor Groups" option
      expect(screen.getByRole('option', { name: 'All Flavor Groups' })).toBeInTheDocument();
      
      // Should have unique flavor groups from the data
      expect(screen.getByRole('option', { name: 'Berry' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Dessert' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Fruit' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Sweet' })).toBeInTheDocument();
    });

    it('sorts filter options alphabetically', () => {
      render(<SortAndFilter {...defaultProps} />);
      
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      const options = Array.from(filterSelect.querySelectorAll('option')).slice(1); // Skip "All" option
      const optionTexts = options.map(option => option.textContent);
      
      // Should be in alphabetical order
      expect(optionTexts).toEqual(['Berry', 'Dessert', 'Fruit', 'Sweet']);
    });
  });

  describe('Sort Functionality', () => {
    it('calls onSort when sort option changes', async () => {
      render(<SortAndFilter {...defaultProps} />);
      
      const sortSelect = screen.getByLabelText('Sort by:');
      await user.selectOptions(sortSelect, 'name-desc');
      
      expect(mockOnSort).toHaveBeenCalledWith('name-desc');
      expect(mockOnSort).toHaveBeenCalledTimes(1);
    });

    it('displays current sort value', () => {
      render(<SortAndFilter {...defaultProps} sortBy="sugarFree" />);
      
      const sortSelect = screen.getByLabelText('Sort by:');
      expect(sortSelect).toHaveValue('sugarFree');
    });

    it('handles all sort option values correctly', async () => {
      render(<SortAndFilter {...defaultProps} />);
      
      const sortSelect = screen.getByLabelText('Sort by:');
      const sortOptions = [
        'name',
        'name-desc',
        'flavorGroup',
        'flavorGroup-desc',
        'sugarFree',
        'sugarFree-desc'
      ];
      
      for (const option of sortOptions) {
        await user.selectOptions(sortSelect, option);
        expect(mockOnSort).toHaveBeenCalledWith(option);
      }
      
      expect(mockOnSort).toHaveBeenCalledTimes(sortOptions.length);
    });
  });

  describe('Filter Functionality', () => {
    it('calls onFilter when filter option changes', async () => {
      render(<SortAndFilter {...defaultProps} />);
      
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      await user.selectOptions(filterSelect, 'Fruit');
      
      expect(mockOnFilter).toHaveBeenCalledWith('Fruit');
      expect(mockOnFilter).toHaveBeenCalledTimes(1);
    });

    it('displays current filter value', () => {
      render(<SortAndFilter {...defaultProps} filterBy="Dessert" />);
      
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      expect(filterSelect).toHaveValue('Dessert');
    });

    it('handles clearing filter (selecting "All Flavor Groups")', async () => {
      render(<SortAndFilter {...defaultProps} filterBy="Fruit" />);
      
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      await user.selectOptions(filterSelect, '');
      
      expect(mockOnFilter).toHaveBeenCalledWith('');
      expect(mockOnFilter).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty jelly beans array', () => {
      render(<SortAndFilter {...defaultProps} jellyBeans={[]} />);
      
      // Should still render controls
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Flavor Group:')).toBeInTheDocument();
      
      // Should only have "All Flavor Groups" option
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      const options = filterSelect.querySelectorAll('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('All Flavor Groups');
    });

    it('handles jelly beans with empty groupName arrays', () => {
      const jellyBeansWithEmptyGroups: JellyBean[] = [
        {
          ...mockJellyBeans[0],
          groupName: [],
        },
        {
          ...mockJellyBeans[1],
          groupName: ['Dessert'],
        },
      ];

      render(<SortAndFilter {...defaultProps} jellyBeans={jellyBeansWithEmptyGroups} />);
      
      // Should only show groups that exist
      expect(screen.getByRole('option', { name: 'All Flavor Groups' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Dessert' })).toBeInTheDocument();
      
      // Should not show empty options
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      const options = Array.from(filterSelect.querySelectorAll('option'));
      expect(options).toHaveLength(2); // "All" + "Dessert"
    });

    it('handles duplicate group names correctly', () => {
      const jellyBeansWithDuplicates: JellyBean[] = [
        {
          ...mockJellyBeans[0],
          groupName: ['Fruit', 'Fruit'], // Duplicate within same bean
        },
        {
          ...mockJellyBeans[1],
          groupName: ['Fruit'], // Duplicate across beans
        },
      ];

      render(<SortAndFilter {...defaultProps} jellyBeans={jellyBeansWithDuplicates} />);
      
      // Should only show unique groups
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      const fruitOptions = Array.from(filterSelect.querySelectorAll('option[value="Fruit"]'));
      expect(fruitOptions).toHaveLength(1);
    });

    it('handles special characters in group names', () => {
      const jellyBeansWithSpecialChars: JellyBean[] = [
        {
          ...mockJellyBeans[0],
          groupName: ['Fruit & Berry', 'Sweet "Premium"', "Mom's Favorite"],
        },
      ];

      render(<SortAndFilter {...defaultProps} jellyBeans={jellyBeansWithSpecialChars} />);
      
      expect(screen.getByRole('option', { name: 'Fruit & Berry' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Sweet "Premium"' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: "Mom's Favorite" })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper semantic structure', () => {
      render(<SortAndFilter {...defaultProps} />);
      
      // Should be a section with proper heading
      const section = screen.getByRole('region', { name: 'Filter and Sort Controls' });
      expect(section).toBeInTheDocument();
      
      // Should have proper labels
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
      expect(screen.getByLabelText('Filter by Flavor Group:')).toBeInTheDocument();
    });

    it('has proper form labels and descriptions', () => {
      render(<SortAndFilter {...defaultProps} />);
      
      const sortSelect = screen.getByLabelText('Sort by:');
      expect(sortSelect).toHaveAttribute('aria-describedby', 'sort-description');
      
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      expect(filterSelect).toHaveAttribute('aria-describedby', 'filter-description');
    });

    it('has screen reader descriptions', () => {
      render(<SortAndFilter {...defaultProps} />);
      
      // These are visually hidden but available to screen readers
      expect(document.getElementById('sort-description')).toHaveTextContent('Choose how to sort the jelly bean results');
      expect(document.getElementById('filter-description')).toHaveTextContent('Filter jelly beans by their flavor group category');
    });

    it('has proper focus management', async () => {
      render(<SortAndFilter {...defaultProps} />);
      
      const sortSelect = screen.getByLabelText('Sort by:');
      const filterSelect = screen.getByLabelText('Filter by Flavor Group:');
      
      // Should be focusable
      sortSelect.focus();
      expect(sortSelect).toHaveFocus();
      
      filterSelect.focus();
      expect(filterSelect).toHaveFocus();
    });
  });

  describe('Performance', () => {
    it('efficiently processes large datasets', () => {
      // Create a large dataset with many duplicate groups
      const largeDataset: JellyBean[] = Array.from({ length: 1000 }, (_, i) => ({
        ...mockJellyBeans[i % mockJellyBeans.length],
        beanId: i + 1,
      }));

      const startTime = performance.now();
      render(<SortAndFilter {...defaultProps} jellyBeans={largeDataset} />);
      const endTime = performance.now();
      
      // Should render quickly (under 100ms for this size)
      expect(endTime - startTime).toBeLessThan(100);
      
      // Should still show correct unique groups
      expect(screen.getByRole('option', { name: 'Berry' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Dessert' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Fruit' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Sweet' })).toBeInTheDocument();
    });
  });
});
