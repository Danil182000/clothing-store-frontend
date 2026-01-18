import React, { useState } from 'react';
import styled from 'styled-components';
import { FaShoppingCart, FaCheck, FaTimes } from 'react-icons/fa';
import CartItem from '../components/CartItem';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { productApi } from '../api/client';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyCartIcon = styled.div`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmptyCartText = styled.p`
  font-size: 1.1rem;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ShopButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const SummaryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: sticky;
  top: ${({ theme }) => theme.spacing.xl};
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SummaryTotal = styled(SummaryRow)`
  font-size: 1.25rem;
  font-weight: bold;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
`;

const CheckoutButton = styled.button<{ $disabled: boolean }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme, $disabled }) => 
    $disabled ? theme.colors.text.disabled : theme.colors.success};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.success};
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const ClearCartButton = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.error};
  border: 2px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SuccessMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.success};
  color: white;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Cart: React.FC = () => {
  const { items, total, itemCount, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setError('Please login to complete your purchase');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsCheckingOut(true);
    setError(null);
    setSuccess(null);

    try {
      // Process each item in cart
      for (const item of items) {
        await productApi.purchase({
          productId: item.product.id,
          quantity: item.quantity,
        });
      }

      // Clear cart after successful purchase
      await clearCart();
      
      setSuccess('Purchase completed successfully!');
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error: any) {
      console.error('Checkout failed:', error);
      setError(error.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      await clearCart();
    }
  };

  if (loading) {
    return (
      <div className="container">
        <PageContainer>
          <div className="loading">Loading cart...</div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="container">
      <PageContainer>
        <PageTitle>
          <FaShoppingCart />
          Shopping Cart
        </PageTitle>

        {items.length === 0 ? (
          <EmptyCart>
            <EmptyCartIcon>
              <FaShoppingCart />
            </EmptyCartIcon>
            <EmptyCartText>Your shopping cart is empty</EmptyCartText>
            <ShopButton onClick={() => window.location.href = '/products'}>
              Continue Shopping
            </ShopButton>
          </EmptyCart>
        ) : (
          <CartContent>
            <CartItems>
              {items.map(item => (
                <CartItem key={item.product.id} item={item} />
              ))}

              <ClearCartButton onClick={handleClearCart}>
                Clear Cart
              </ClearCartButton>
            </CartItems>

            <SummaryCard>
              <SummaryTitle>Order Summary</SummaryTitle>
              
              <SummaryRow>
                <span>Items ({itemCount}):</span>
                <span>${total.toFixed(2)}</span>
              </SummaryRow>
              
              <SummaryRow>
                <span>Shipping:</span>
                <span>Free</span>
              </SummaryRow>
              
              <SummaryRow>
                <span>Tax:</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </SummaryRow>
              
              <SummaryTotal>
                <span>Total:</span>
                <span>${(total * 1.1).toFixed(2)}</span>
              </SummaryTotal>

              <CheckoutButton
                $disabled={isCheckingOut}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Processing...' : 'Checkout'}
                {!isCheckingOut && <FaCheck />}
              </CheckoutButton>

              {error && (
                <ErrorMessage>
                  <FaTimes />
                  {error}
                </ErrorMessage>
              )}

              {success && (
                <SuccessMessage>
                  <FaCheck />
                  {success}
                </SuccessMessage>
              )}
            </SummaryCard>
          </CartContent>
        )}
      </PageContainer>
    </div>
  );
};

export default Cart;