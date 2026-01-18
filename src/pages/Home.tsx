import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTshirt, FaShippingFast, FaTag, FaHeadset } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { productApi } from '../api/client';

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary} 0%, ${({ theme }) => theme.colors.secondary} 100%);
  color: white;
  padding: ${({ theme }) => theme.spacing.xxl} 0;
  text-align: center;
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.large} ${({ theme }) => theme.borderRadius.large};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  opacity: 0.9;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ShopButton = styled.button`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background-color: white;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  font-size: 1.1rem;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const FeaturesSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: ${({ theme }) => theme.shadows.small};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.medium};
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FeatureTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FeatureDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
`;

const ProductsSection = styled.section`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAll();
      // Get first 4 products as featured
      setFeaturedProducts(response.data.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaTshirt />,
      title: 'Quality Clothing',
      description: 'Premium materials and expert craftsmanship in every piece we offer.',
    },
    {
      icon: <FaShippingFast />,
      title: 'Fast Delivery',
      description: 'Quick shipping to get your new clothes to you as soon as possible.',
    },
    {
      icon: <FaTag />,
      title: 'Best Prices',
      description: 'Competitive pricing without compromising on quality or style.',
    },
    {
      icon: <FaHeadset />,
      title: '24/7 Support',
      description: 'Our customer service team is always here to help you.',
    },
  ];

  return (
    <div>
      <HeroSection>
        <div className="container">
          <HeroTitle>Discover Your Style</HeroTitle>
          <HeroSubtitle>
            Explore our exclusive collection of premium clothing for every occasion. 
            From casual wear to formal attire, we have something for everyone.
          </HeroSubtitle>
          <ShopButton onClick={() => window.location.href = '/products'}>
            Shop Now
          </ShopButton>
        </div>
      </HeroSection>

      <div className="container">
        <FeaturesSection>
          <SectionTitle>Why Choose Us</SectionTitle>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesSection>

        <ProductsSection>
          <SectionTitle>Featured Products</SectionTitle>
          {loading ? (
            <div className="loading">Loading featured products...</div>
          ) : (
            <ProductsGrid>
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductsGrid>
          )}
        </ProductsSection>
      </div>
    </div>
  );
};

export default Home;