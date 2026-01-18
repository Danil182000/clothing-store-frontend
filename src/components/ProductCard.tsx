import React, { useState } from 'react';
import styled from 'styled-components';
import { FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const StockBadge = styled.div<{ $inStock: boolean }>`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, $inStock }) => 
    $inStock ? theme.colors.success : theme.colors.error};
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const Price = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const Color = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Details = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const DetailItem = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CartButton = styled.button<{ $inStock: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, $inStock }) => 
    $inStock ? theme.colors.primary : theme.colors.text.disabled};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme, $inStock }) => 
      $inStock ? theme.colors.secondary : theme.colors.text.disabled};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.xs};
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Quantity = styled.span`
  min-width: 32px;
  text-align: center;
  font-weight: 600;
`;

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem, items } = useCart();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const cartItem = items.find(item => item.product.id === product.id);
  const inStock = product.quantity > 0;
  const canAddToCart = isAuthenticated && inStock;

  const handleAddToCart = async () => {
    if (!canAddToCart) return;
    
    setIsAdding(true);
    try {
      await addItem(product, quantity);
      setQuantity(1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <Card>
      <ImageContainer>
        <ProductImage 
          src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Clothing'} 
          alt={product.name} 
        />
        <StockBadge $inStock={inStock}>
          {inStock ? `In Stock (${product.quantity})` : 'Out of Stock'}
        </StockBadge>
      </ImageContainer>
      
      <Content>
        <ProductName>{product.name}</ProductName>
        
        <ProductMeta>
          <Price>${product.price.toFixed(2)}</Price>
          <Color>{product.color}</Color>
        </ProductMeta>
        
        <Details>
          <DetailItem>Size: {product.size}</DetailItem>
          <DetailItem>{product.type}</DetailItem>
        </Details>
        
        <Actions>
          <QuantityControls>
            <QuantityButton 
              onClick={decrementQuantity} 
              disabled={quantity <= 1}
            >
              <FaMinus />
            </QuantityButton>
            <Quantity>{quantity}</Quantity>
            <QuantityButton 
              onClick={incrementQuantity} 
              disabled={quantity >= product.quantity}
            >
              <FaPlus />
            </QuantityButton>
          </QuantityControls>
          
          <CartButton 
            $inStock={inStock}
            onClick={handleAddToCart}
            disabled={!canAddToCart || isAdding}
          >
            <FaShoppingCart />
            {isAdding ? 'Adding...' : cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
          </CartButton>
        </Actions>
      </Content>
    </Card>
  );
};

export default ProductCard;