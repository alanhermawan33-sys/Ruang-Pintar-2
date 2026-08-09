import React, { useState, useEffect, useCallback } from 'react';
import { Product, Order, OrderItem, OrderStatus } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CorePrinciples } from './components/CorePrinciples';
import { CuratedSpaces } from './components/CuratedSpaces';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'showcase' | 'admin'>('showcase');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Cart state
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Selected product detail modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // New incoming order counter badge
  const [newOrdersCount, setNewOrdersCount] = useState<number>(0);

  // Fetch initial products and orders from server API
  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data: Order[] = await res.json();
        setOrders(data);
        const pending = data.filter(o => o.status === 'Pending').length;
        setNewOrdersCount(pending);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }, []);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      await Promise.all([fetchProducts(), fetchOrders()]);
      setIsLoading(false);
    }
    init();
  }, [fetchProducts, fetchOrders]);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          imageUrl: product.imageUrl,
        },
      ];
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleDirectOrder = (product: Product) => {
    handleAddToCart(product);
    setIsCartOpen(true);
  };

  // Admin Actions
  const handleUpdateProductPrice = async (id: string, newPrice: number) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: newPrice }),
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error('Error updating price:', err);
    }
  };

  const handleUpdateProductImage = async (id: string, newImageUrl: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newImageUrl }),
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error('Error updating image:', err);
    }
  };

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await fetchProducts();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        await fetchOrders();
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    setActiveTab('showcase');
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#faf9f7] text-[#1a1c1b] flex flex-col justify-between selection:bg-[#d6c5a5] selection:text-[#171818]">
      {/* Top Floating Glassmorphic Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={totalCartCount}
        setIsCartOpen={setIsCartOpen}
        newOrdersCount={newOrdersCount}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'showcase' ? (
          <div>
            {/* Hero Section */}
            <Hero onInitiateProject={() => handleNavigateSection('curated-spaces')} />

            {/* Core Principles Bento Grid */}
            <CorePrinciples />

            {/* Curated Spaces & Bespoke Works Catalog */}
            <CuratedSpaces
              products={products}
              onSelectProduct={setSelectedProduct}
              onAddToCart={handleAddToCart}
            />

            {/* Contact & Inquiry Section */}
            <ContactSection onInquirySubmitted={fetchOrders} />
          </div>
        ) : (
          /* Admin Panel View */
          <AdminPanel
            products={products}
            orders={orders}
            onRefreshData={fetchOrders}
            onUpdateProductPrice={handleUpdateProductPrice}
            onUpdateProductImage={handleUpdateProductImage}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </main>

      {/* Product Specification Detail Modal */}
      <ProjectDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onDirectOrder={handleDirectOrder}
      />

      {/* Shopping Bag & Project Checkout Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onOrderSubmitted={() => {
          fetchOrders();
        }}
      />

      {/* Footer */}
      <Footer
        onToggleAdmin={() => setActiveTab(activeTab === 'showcase' ? 'admin' : 'showcase')}
        onNavigateSection={handleNavigateSection}
      />
    </div>
  );
}
