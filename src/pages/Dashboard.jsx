import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import BottomCheckout from '../components/BottomCheckout';
import RekapPage from './RekapPage';
import { products as initialProducts, categories } from '../data/products';
import LoginModal from '../components/LoginModal';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [role, setRole] = useState("Guest");
  const [currentView, setCurrentView] = useState("Home");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState(initialProducts);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const dbProducts = data.map((p) => ({
            id: p.id,
            nama: p.name,
            harga: p.price,
            kategori: p.category,
            gambar: p.image_url,
            stok: p.stock
          }));
          setProducts([...dbProducts, ...initialProducts]);
        }
      } catch (err) {
        console.error('Gagal memuat produk dari Supabase:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleLogout = () => {
    setRole('Guest');
    setIsSidebarOpen(false);
    if (currentView === 'Rekap Barang') setCurrentView('Home');
  };

  // Open login modal (Guest) or logout (Admin)
  const handleLoginClick = () => {
    if (role === "Guest") {
      setLoginOpen(true);
    } else {
      setRole("Guest");
      if (currentView === "Rekap Barang") {
        setCurrentView("Home");
      }
    }
  };

  const handleLoginSubmit = ({ username, password }) => {
    // Placeholder: accept any non-empty credentials and set Admin locally.
    if (username && password) {
      setRole('Admin');
      setLoginOpen(false);
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

  // Placeholder checkout button; no navigation or notification
  const handleGoToCheckout = () => {
    // intentionally blank; checkout flow will be continued by the team later
  };

  // Filter products by search query and category
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = activeCategory === "Semua" || p.kategori === activeCategory;
      const matchesSearch = p.nama.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchQuery]);

  const handleAddProductSubmit = (data) => {
    const newProduct = {
      id: data.id || Date.now(),
      nama: data.nama || 'Produk Baru',
      harga: Number(data.harga) || 0,
      kategori: data.kategori || 'UMKM',
      gambar: data.gambarPreview || '' ,
      stok: Number(data.stock) || 0
    };
    setProducts((prev) => [newProduct, ...prev]);
    setNotification('Berhasil! Produk telah ditambahkan ke etalase.');
  };

  const cartItemList = Object.values(cart);

  // Render Rekap Page
  if (currentView === "Rekap Barang") {
    return (
      <RekapPage
        onBackToDashboard={() => setCurrentView("Home")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans pb-24 w-full relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#E67E22] text-white px-5 py-2.5 rounded-full shadow-xl text-sm font-semibold flex items-center gap-2 animate-[bounce_1s_ease-in-out_infinite]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          {notification}
        </div>
      )}

      {/* 1. Navbar (Full Width) */}
      <Navbar
        role={role}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onLoginClick={handleLoginClick}
      />
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} onSubmit={handleLoginSubmit} />

      {/* Sidebar Drawer (Off-canvas, muncul saat tombol ☰ ditekan) */}
      <Sidebar
        role={role}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeTab={currentView}
        onSelectTab={setCurrentView}
        onLogout={handleLogout}
      />

      {/* Main Full-Width Content Container */}
      <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
        <main className="w-full space-y-6">
          {/* 2. Banner */}
          <Banner isAdmin={role === 'Admin'} onAddProduct={handleAddProductSubmit} />

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
