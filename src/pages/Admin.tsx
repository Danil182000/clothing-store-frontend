import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaUpload, FaDownload } from 'react-icons/fa';
import { Product } from '../types';
import { productApi } from '../api/client';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AdminActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const ProductsTable = styled.table`
  width: 100%;
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const TableHeader = styled.thead`
  background-color: ${({ theme }) => theme.colors.background};
`;

const TableHeaderCell = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const TableCell = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ActionsCell = styled(TableCell)`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.3s ease;

  &:hover {
    &.edit {
      background-color: ${({ theme }) => theme.colors.info};
      color: white;
    }
    &.delete {
      background-color: ${({ theme }) => theme.colors.error};
      color: white;
    }
    &.restock {
      background-color: ${({ theme }) => theme.colors.success};
      color: white;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: all 0.3s ease;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-weight: 500;
  transition: all 0.3s ease;

  ${({ theme, $variant = 'primary' }) => $variant === 'primary' ? `
    background-color: ${theme.colors.primary};
    color: white;
    &:hover {
      background-color: ${theme.colors.secondary};
    }
  ` : `
    background-color: ${theme.colors.background};
    color: ${theme.colors.text.primary};
    &:hover {
      background-color: ${theme.colors.border};
    }
  `}
`;

const StockStatus = styled.span<{ $quantity: number }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font-size: 0.875rem;
  font-weight: 500;
  background-color: ${({ theme, $quantity }) => 
    $quantity > 10 ? theme.colors.success : 
    $quantity > 0 ? theme.colors.warning : theme.colors.error};
  color: white;
`;

const Admin: React.FC = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockQuantity, setRestockQuantity] = useState('');

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

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

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productApi.delete(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleRestockProduct = (product: Product) => {
    setEditingProduct(product);
    setRestockQuantity('');
    setShowRestockModal(true);
  };

  const handleSubmitRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const quantity = parseInt(restockQuantity);
      if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
      }

      await productApi.restock({
        productId: editingProduct.id,
        quantity,
      });

      // Update local state
      setProducts(products.map(p =>
        p.id === editingProduct.id
          ? { ...p, quantity: p.quantity + quantity }
          : p
      ));

      setShowRestockModal(false);
      setEditingProduct(null);
      setRestockQuantity('');
    } catch (error) {
      console.error('Failed to restock product:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const productData: any = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      color: formData.get('color') as string,
      size: formData.get('size') as string,
      type: formData.get('type') as string,
      barcode: formData.get('barcode') as string,
      quantity: parseInt(formData.get('quantity') as string),
      description: formData.get('description') as string,
      imageUrl: formData.get('imageUrl') as string,
    };

    try {
      if (editingProduct) {
        const response = await productApi.update(editingProduct.id, productData);
        setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
      } else {
        const response = await productApi.create(productData);
        setProducts([...products, response.data]);
      }

      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await productApi.getReport();
      const blob = new Blob([JSON.stringify(response.data, null, 2)], {
        type: 'application/json',
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'products-report.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container">
        <PageContainer>
          <div className="error">
            Access denied. Admin privileges required.
          </div>
        </PageContainer>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <PageContainer>
          <div className="loading">Loading products...</div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="container">
      <PageContainer>
        <PageTitle>Admin Dashboard</PageTitle>

        <AdminActions>
          <div>
            <h3>Product Management</h3>
            <p>Total Products: {products.length}</p>
          </div>
          
          <ActionButtons>
            <ActionButton onClick={handleAddProduct}>
              <FaPlus />
              Add Product
            </ActionButton>
            <ActionButton onClick={handleDownloadReport}>
              <FaDownload />
              Download Report
            </ActionButton>
          </ActionButtons>
        </AdminActions>

        <ProductsTable>
          <TableHeader>
            <tr>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Price</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Size</TableHeaderCell>
              <TableHeaderCell>Color</TableHeaderCell>
              <TableHeaderCell>Stock</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {products.map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.type}</TableCell>
                <TableCell>{product.size}</TableCell>
                <TableCell>{product.color}</TableCell>
                <TableCell>
                  <StockStatus $quantity={product.quantity}>
                    {product.quantity} units
                  </StockStatus>
                </TableCell>
                <ActionsCell>
                  <IconButton
                    className="edit"
                    onClick={() => handleEditProduct(product)}
                    title="Edit"
                  >
                    <FaEdit />
                  </IconButton>
                  <IconButton
                    className="restock"
                    onClick={() => handleRestockProduct(product)}
                    title="Restock"
                  >
                    <FaUpload />
                  </IconButton>
                  <IconButton
                    className="delete"
                    onClick={() => handleDeleteProduct(product.id)}
                    title="Delete"
                  >
                    <FaTrash />
                  </IconButton>
                </ActionsCell>
              </TableRow>
            ))}
          </tbody>
        </ProductsTable>

        {showModal && (
          <ModalOverlay onClick={() => setShowModal(false)}>
            <Modal onClick={e => e.stopPropagation()}>
              <ModalTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </ModalTitle>
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={editingProduct?.name}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    type="number"
                    id="price"
                    name="price"
                    step="0.01"
                    min="0"
                    defaultValue={editingProduct?.price}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    id="type"
                    name="type"
                    defaultValue={editingProduct?.type}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="T-Shirt">T-Shirt</option>
                    <option value="Shirt">Shirt</option>
                    <option value="Pants">Pants</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Sweater">Sweater</option>
                    <option value="Jacket">Jacket</option>
                    <option value="Dress">Dress</option>
                    <option value="Skirt">Skirt</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="size">Size</Label>
                  <Select
                    id="size"
                    name="size"
                    defaultValue={editingProduct?.size}
                    required
                  >
                    <option value="">Select size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    type="text"
                    id="color"
                    name="color"
                    defaultValue={editingProduct?.color}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="0"
                    defaultValue={editingProduct?.quantity}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input
                    type="text"
                    id="barcode"
                    name="barcode"
                    defaultValue={editingProduct?.barcode}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    defaultValue={editingProduct?.imageUrl}
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    type="text"
                    id="description"
                    name="description"
                    defaultValue={editingProduct?.description}
                  />
                </FormGroup>

                <ModalActions>
                  <Button
                    type="button"
                    $variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Update' : 'Create'}
                  </Button>
                </ModalActions>
              </Form>
            </Modal>
          </ModalOverlay>
        )}

        {showRestockModal && editingProduct && (
          <ModalOverlay onClick={() => setShowRestockModal(false)}>
            <Modal onClick={e => e.stopPropagation()}>
              <ModalTitle>Restock Product</ModalTitle>
              <Form onSubmit={handleSubmitRestock}>
                <p>
                  Product: <strong>{editingProduct.name}</strong>
                </p>
                <p>
                  Current Stock: <strong>{editingProduct.quantity}</strong>
                </p>

                <FormGroup>
                  <Label htmlFor="restockQuantity">Quantity to Add</Label>
                  <Input
                    type="number"
                    id="restockQuantity"
                    value={restockQuantity}
                    onChange={e => setRestockQuantity(e.target.value)}
                    min="1"
                    required
                  />
                </FormGroup>

                <ModalActions>
                  <Button
                    type="button"
                    $variant="secondary"
                    onClick={() => setShowRestockModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Restock</Button>
                </ModalActions>
              </Form>
            </Modal>
          </ModalOverlay>
        )}
      </PageContainer>
    </div>
  );
};

export default Admin;