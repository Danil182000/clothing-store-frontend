import React from 'react';
import styled from 'styled-components';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { CartItem as CartItemType } from '../types';
import { useCart } from '../contexts/CartContext';

const CartItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ProductDetails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Detail = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`;

const Price = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const QuantityControl = styled.div`
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
  width: 28px;
  height: 28px;
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
  min-width: 30px;
  text-align: center;
  font-weight: 600;
`;

const Subtotal = styled.div`
  min-width: 100px;
  text-align: right;
  font-size: 1.1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(item.product.id);
      return;
    }
    if (newQuantity > item.product.quantity) {
      alert(`Only ${item.product.quantity} items available`);
      return;
    }
    await updateQuantity(item.product.id, newQuantity);
  };

  const subtotal = item.product.price * item.quantity;

  return (
    <CartItemContainer>
      <ProductImage 
        src={item.product.imageUrl || 'https://via.placeholder.com/80?text=Product'} 
        alt={item.product.name} 
      />
      
      <ProductInfo>
        <ProductName>{item.product.name}</ProductName>
        <ProductDetails>
          <Detail>Color: {item.product.color}</Detail>
          <Detail>Size: {item.product.size}</Detail>
          <Detail>{item.product.type}</Detail>
        </ProductDetails>
        <Price>${item.product.price.toFixed(2)} each</Price>
      </ProductInfo>
      
      <Controls>
        <QuantityControl>
          <QuantityButton 
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <FaMinus />
          </QuantityButton>
          <Quantity>{item.quantity}</Quantity>
          <QuantityButton 
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.product.quantity}
          >
            <FaPlus />
          </QuantityButton>
        </QuantityControl>
        
        <Subtotal>${subtotal.toFixed(2)}</Subtotal>
        
        <RemoveButton onClick={() => removeItem(item.product.id)}>
          <FaTrash />
        </RemoveButton>
      </Controls>
    </CartItemContainer>
  );
};

export default CartItem;