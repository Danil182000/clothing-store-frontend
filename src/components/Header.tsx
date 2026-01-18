import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaTshirt, FaSun, FaMoon } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.small};
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: 500;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const CartButton = styled(Link)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;

const CartCount = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
    opacity: 0.9;
  }
`;

const LoginButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    opacity: 0.9;
  }
`;

const Header: React.FC = () => {
  const { itemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const { themeMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <div className="container">
        <HeaderContent>
          <Logo to="/">
            <FaTshirt />
            <span>Clothing Store</span>
          </Logo>

          <Nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            
            <ThemeToggle />
            
            <CartButton to="/cart">
              <FaShoppingCart />
              {itemCount > 0 && <CartCount>{itemCount}</CartCount>}
            </CartButton>

            <AuthButtons>
              {user ? (
                <UserMenu>
                  <UserInfo>
                    <FaUser />
                    <span>{user.name}</span>
                    {isAdmin && <span>(Admin)</span>}
                  </UserInfo>
                  <LogoutButton onClick={handleLogout}>
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </LogoutButton>
                </UserMenu>
              ) : (
                <>
                  <LoginButton to="/login">
                    <FaUser />
                    <span>Login</span>
                  </LoginButton>
                  <NavLink to="/register">Register</NavLink>
                </>
              )}
            </AuthButtons>
          </Nav>
        </HeaderContent>
      </div>
    </HeaderContainer>
  );
};

export default Header;