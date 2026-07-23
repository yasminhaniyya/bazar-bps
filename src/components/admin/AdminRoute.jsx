import { Navigate, Outlet } from 'react-router-dom';

/**
 * Komponen pembungkus untuk memproteksi halaman admin.
 * Memeriksa apakah session (dari localStorage) aktif.
 * Jika tidak, akan mengarahkan pengguna kembali ke halaman login.
 */
export default function AdminRoute() {
  // Mengecek apakah ada session login admin di localStorage
  const isAuthenticated = localStorage.getItem('admin_session') === 'true';

  // Jika terautentikasi, render children route, jika tidak kembali ke /admin/login
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
