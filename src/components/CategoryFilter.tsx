import React from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const FilterTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FilterGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const GroupTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  text-align: left;
  background-color: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $active }) => 
    $active ? 'white' : theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme, $active }) => 
      $active ? theme.colors.primary : theme.colors.border};
  }
`;

const ClearButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

interface CategoryFilterProps {
  categories: string[];
  sizes: string[];
  selectedCategory: string | null;
  selectedSize: string | null;
  onCategorySelect: (category: string | null) => void;
  onSizeSelect: (size: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  sizes,
  selectedCategory,
  selectedSize,
  onCategorySelect,
  onSizeSelect,
}) => {
  const handleCategoryClick = (category: string) => {
    onCategorySelect(selectedCategory === category ? null : category);
  };

  const handleSizeClick = (size: string) => {
    onSizeSelect(selectedSize === size ? null : size);
  };

  const handleClearFilters = () => {
    onCategorySelect(null);
    onSizeSelect(null);
  };

  return (
    <FilterContainer>
      <FilterTitle>Filters</FilterTitle>
      
      <FilterGroup>
        <GroupTitle>Category</GroupTitle>
        <FilterList>
          {categories.map(category => (
            <FilterButton
              key={category}
              $active={selectedCategory === category}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterList>
      </FilterGroup>
      
      <FilterGroup>
        <GroupTitle>Size</GroupTitle>
        <FilterList>
          {sizes.map(size => (
            <FilterButton
              key={size}
              $active={selectedSize === size}
              onClick={() => handleSizeClick(size)}
            >
              {size}
            </FilterButton>
          ))}
        </FilterList>
      </FilterGroup>
      
      {(selectedCategory || selectedSize) && (
        <ClearButton onClick={handleClearFilters}>
          Clear All Filters
        </ClearButton>
      )}
    </FilterContainer>
  );
};

export default CategoryFilter;