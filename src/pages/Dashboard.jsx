import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import BottomCheckout from '../components/BottomCheckout';
import CheckoutPage from './CheckoutPage';
import RekapPage from './RekapPage';
import { products as initialProducts, categories } from '../data/products';

export default function Dashboard() {
  const [role, setRole] = useState("Guest");
  const [currentView, setCurrentView] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle login role (Guest <-> Admin)
  const handleLoginToggle = () => {
    if (role === "Guest") {
      setRole("Admin");
    } else {
      setRole("Guest");
      if (currentView === "Rekap Barang") {
        setCurrentView("Home");
      }
    }
  };

  // Add item to cart
  const handleAddToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: {
        ...product,
        quantity: (prev[product.id]?.quantity || 0) + 1
      }
    }));
  };

  // Remove item from cart
  const handleRemoveFromCart = (productId) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[productId]) {
        if (updated[productId].quantity > 1) {
          updated[productId].quantity -= 1;
        } else {
          delete updated[productId];
        }
      }
      return updated;
    });
  };

  // Clear cart
  const handleClearCart = () => {
    setCart({});
  };

  // Navigate to checkout
  const handleGoToCheckout = () => {
    setCurrentView("Checkout");
  };

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchesCategory = activeCategory === "Semua" || p.kategori === activeCategory;
      const matchesSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const cartItemList = Object.values(cart);

  // Render Checkout Page
  if (currentView === "Checkout") {
    return (
      <CheckoutPage
        cartItems={cartItemList}
        onBackToDashboard={() => setCurrentView("Home")}
      />
    );
  }

  // Render Rekap Page
  if (currentView === "Rekap Barang") {
    return (
      <RekapPage
        onBackToDashboard={() => setCurrentView("Home")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-24 w-full">
      {/* 1. Navbar (Full Width) */}
      <Navbar
        role={role}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLoginClick={handleLoginToggle}
      />

      {/* Sidebar Drawer (Off-canvas, muncul saat tombol ☰ ditekan) */}
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={currentView}
        onSelectTab={setCurrentView}
      />

      {/* Main Full-Width Content Container */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        <main className="w-full space-y-6">
          {/* 2. Banner */}
          <Banner />

          {/* 3. Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
          />

          {/* Grid Header */}
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              {activeCategory === "Semua" ? "Daftar Produk Bazar" : `Kategori: ${activeCategory}`}
            </h2>
            <span className="text-xs text-slate-500 font-medium bg-white px-2.5 py-1 rounded border border-slate-200">
              {filteredProducts.length} Produk
            </span>
          </div>

          {/* 4. Product Grid (Responsive Full Width: HP -> 2 kolom, Tablet -> 3 kolom, Laptop -> 4/5 kolom) */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  quantity={cart[product.id]?.quantity || 0}
                  onAddToCart={handleAddToCart}
                  onRemoveFromCart={handleRemoveFromCart}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center border border-slate-200 shadow-xs">
              <p className="text-sm font-semibold text-slate-800">Produk Tidak Ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">Coba kata kunci atau kategori lainnya.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("Semua");
                }}
                className="mt-3 px-3 py-1.5 bg-[#E67E22] hover:bg-[#D96A12] text-white font-medium text-xs rounded"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 5. Bottom Checkout (Full Width Bar) */}
      <BottomCheckout
        cartItems={cartItemList}
        onCheckout={handleGoToCheckout}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
