import { useState, useMemo, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import BottomCheckout from '../components/BottomCheckout';
import RekapPage from './RekapPage';
import CheckoutPage from './CheckoutPage';
import LoginModal from '../components/LoginModal';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [role, setRole] = useState("Guest");
  const [currentView, setCurrentView] = useState(() => {
    const activeScreen = sessionStorage.getItem('dwp_bps_active_screen');
    if (activeScreen === 'checkout' || activeScreen === 'receipt') {
      return 'Checkout';
    }
    if (activeScreen === 'rekap') {
      return 'Rekap Barang';
    }
    return 'Home';
  });
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = sessionStorage.getItem('dwp_bps_cart');
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (e) {
      return {};
    }
  });

  // Persist cart to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('dwp_bps_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync currentView with sessionStorage
  useEffect(() => {
    if (currentView === 'Home') {
      sessionStorage.setItem('dwp_bps_active_screen', 'home');
    } else if (currentView === 'Rekap Barang') {
      sessionStorage.setItem('dwp_bps_active_screen', 'rekap');
    } else if (currentView === 'Checkout') {
      const active = sessionStorage.getItem('dwp_bps_active_screen');
      if (active !== 'receipt' && active !== 'checkout') {
        sessionStorage.setItem('dwp_bps_active_screen', 'checkout');
      }
    }
  }, [currentView]);
  const [products, setProducts] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const categoryOptions = useMemo(() => {
    const unique = Array.from(new Set(products.map((item) => item.kategori).filter(Boolean)));
    return ['Semua', ...unique];
  }, [products]);

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

        const dbProducts = (data || []).map((p) => ({
          id: p.id,
          nama: p.name,
          harga: p.price,
          kategori: p.category,
          gambar: p.image_url,
          stok: p.stock
        }));

        setProducts(dbProducts);
      } catch (err) {
        console.error('Gagal memuat produk dari Supabase:', err);
      }
    };
    fetchProducts();
  }, []);

  // Sync role with URL query parameter or localStorage on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    let activeRole = localStorage.getItem('user_role') || 'Guest';

    if (roleParam === 'admin') {
      activeRole = 'Admin';
      localStorage.setItem('user_role', 'Admin');
      
      // Hapus data belanja tamu
      sessionStorage.removeItem('dwp_bps_cart');
      sessionStorage.removeItem('dwp_bps_form_draft');
      sessionStorage.removeItem('dwp_bps_payment_proof');
      sessionStorage.removeItem('dwp_bps_active_screen');
      sessionStorage.removeItem('dwp_bps_active_invoice');
      sessionStorage.removeItem('dwp_bps_order_time');
      sessionStorage.removeItem('dwp_bps_receipt_items');
      sessionStorage.removeItem('dwp_bps_user_profile');

      // Refresh dengan mengarahkan ke URL bersih tanpa query param
      window.location.href = window.location.origin + window.location.pathname;
      return;
    } else if (roleParam === 'guest') {
      activeRole = 'Guest';
      localStorage.removeItem('user_role');
    }
    setRole(activeRole);
  }, []);

  const handleLogout = () => {
    setRole('Guest');
    localStorage.removeItem('user_role');
    setIsSidebarOpen(false);
    if (currentView === 'Rekap Barang') setCurrentView('Home');
  };

  // Open login modal (Guest) or logout (Admin)
  const handleLoginClick = () => {
    if (role === "Guest") {
      setLoginOpen(true);
    } else {
      setRole("Guest");
      localStorage.removeItem('user_role');
      if (currentView === "Rekap Barang") {
        setCurrentView("Home");
      }
    }
  };

  const handleLoginSubmit = ({ username, password }) => {
    // Placeholder: accept any non-empty credentials and set Admin locally.
    if (username && password) {
      // Hapus data belanja tamu
      sessionStorage.removeItem('dwp_bps_cart');
      sessionStorage.removeItem('dwp_bps_form_draft');
      sessionStorage.removeItem('dwp_bps_payment_proof');
      sessionStorage.removeItem('dwp_bps_active_screen');
      sessionStorage.removeItem('dwp_bps_active_invoice');
      sessionStorage.removeItem('dwp_bps_order_time');
      sessionStorage.removeItem('dwp_bps_receipt_items');
      sessionStorage.removeItem('dwp_bps_user_profile');

      setRole('Admin');
      localStorage.setItem('user_role', 'Admin');
      setLoginOpen(false);

      // Reload halaman agar kembali ke nol bersih
      window.location.reload();
    }
  };

  // Add item to cart
  const handleAddToCart = (product) => {
    let limitReached = false;
    setCart((prev) => {
      const currentQty = prev[product.id]?.quantity || 0;
      if (product.stok !== undefined && currentQty >= product.stok) {
        limitReached = true;
        return prev;
      }
      return {
        ...prev,
        [product.id]: {
          ...product,
          quantity: currentQty + 1
        }
      };
    });

    if (limitReached) {
      setNotification(`Maaf, stok ${product.nama} tidak mencukupi! Sisa: ${product.stok} pcs.`);
    }
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

  const handleGoToCheckout = () => {
    setCurrentView("Checkout");
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

  // Render Checkout Page
  if (currentView === "Checkout") {
    return (
      <>
        {notification && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#E67E22] text-white px-5 py-2.5 rounded-full shadow-xl text-sm font-semibold flex items-center gap-2 animate-[bounce_1s_ease-in-out_infinite]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {notification}
          </div>
        )}
        <CheckoutPage
          cartItems={cartItemList}
          onBackToDashboard={() => setCurrentView("Home")}
          role={role}
          setRole={setRole}
          onAddToCart={handleAddToCart}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />
      </>
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
            categories={categoryOptions}
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
