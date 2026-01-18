import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';
import CategoryFilter from '../components/CategoryFilter';
import { Product } from '../types';
import { productApi } from '../api/client';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ResultsCount = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NoProducts = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Loading = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, selectedSize]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.type.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedSize) {
      filtered = filtered.filter(product => 
        product.size.toLowerCase() === selectedSize.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  };

  const categories = Array.from(new Set(products.map(p => p.type))).sort();
  const sizes = Array.from(new Set(products.map(p => p.size))).sort();

  return (
    <div className="container">
      <PageContainer>
        <PageHeader>
          <PageTitle>Our Collection</PageTitle>
        </PageHeader>

        <ResultsCount>
          Showing {filteredProducts.length} of {products.length} products
          {(selectedCategory || selectedSize) && (
            <>
              {' '}filtered by{' '}
              {selectedCategory && `Category: ${selectedCategory}`}
              {selectedCategory && selectedSize && ' and '}
              {selectedSize && `Size: ${selectedSize}`}
            </>
          )}
        </ResultsCount>

        <Content>
          <CategoryFilter
            categories={categories}
            sizes={sizes}
            selectedCategory={selectedCategory}
            selectedSize={selectedSize}
            onCategorySelect={setSelectedCategory}
            onSizeSelect={setSelectedSize}
          />

          {loading ? (
            <Loading>Loading products...</Loading>
          ) : filteredProducts.length === 0 ? (
            <NoProducts>
              No products found{selectedCategory || selectedSize ? ' matching your filters' : ''}.
              {selectedCategory || selectedSize ? ' Try clearing your filters.' : ''}
            </NoProducts>
          ) : (
            <ProductsGrid>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductsGrid>
          )}
        </Content>
      </PageContainer>
    </div>
  );
};

export default ProductList;