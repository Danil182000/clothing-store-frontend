import React from 'react';
import styled from 'styled-components';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
`;

const FooterContent = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FooterSection = styled.div``;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FooterText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterList = styled.ul`
  list-style: none;
`;

const FooterListItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const FooterLink = styled.a`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-decoration: none;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const SocialLink = styled.a`
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
    transform: translateY(-2px);
  }
`;

const FooterBottom = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <div className="container">
        <FooterContent>
          <FooterGrid>
            <FooterSection>
              <FooterTitle>About Us</FooterTitle>
              <FooterText>
                Your premier destination for high-quality clothing. 
                We offer a wide range of fashionable apparel for every occasion.
              </FooterText>
              <SocialLinks>
                <SocialLink href="#" aria-label="Facebook">
                  <FaFacebook />
                </SocialLink>
                <SocialLink href="#" aria-label="Twitter">
                  <FaTwitter />
                </SocialLink>
                <SocialLink href="#" aria-label="Instagram">
                  <FaInstagram />
                </SocialLink>
              </SocialLinks>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Quick Links</FooterTitle>
              <FooterList>
                <FooterListItem>
                  <FooterLink href="/">Home</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink href="/products">Products</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink href="/cart">Shopping Cart</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink href="/login">My Account</FooterLink>
                </FooterListItem>
              </FooterList>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Contact Info</FooterTitle>
              <FooterList>
                <FooterListItem>
                  <FooterLink href="#">
                    <FaMapMarkerAlt />
                    123 Fashion Street, Style City
                  </FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink href="tel:+1234567890">
                    <FaPhone />
                    (123) 456-7890
                  </FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink href="mailto:info@clothingstore.com">
                    <FaEnvelope />
                    info@clothingstore.com
                  </FooterLink>
                </FooterListItem>
              </FooterList>
            </FooterSection>

            <FooterSection>
              <FooterTitle>Customer Service</FooterTitle>
              <FooterList>
                <FooterListItem>
                  <FooterLink href="#">Shipping Policy</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink href="#">Return Policy</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink href="#">Privacy Policy</FooterLink>
                </FooterListItem>
                <FooterListItem>
                  <FooterLink href="#">Terms of Service</FooterLink>
                </FooterListItem>
              </FooterList>
            </FooterSection>
          </FooterGrid>

          <FooterBottom>
            <FooterText>
              &copy; {currentYear} Clothing Store. All rights reserved.
            </FooterText>
          </FooterBottom>
        </FooterContent>
      </div>
    </FooterContainer>
  );
};

export default Footer;