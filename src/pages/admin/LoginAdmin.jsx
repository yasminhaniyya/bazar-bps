import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';
import { supabase } from '../../lib/supabase';

/**
 * Halaman Login khusus untuk Admin.
 * Menggunakan metode pencocokan hash bcrypt manual tanpa layanan eksternal Auth.
 */
export default function LoginAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Cari username pada tabel admins
      const { data, error: dbError } = await supabase
        .from('admins')
        .select('password_hash')
        .eq('username', username)
        .single();

      // Jika error atau username tidak ditemukan
      if (dbError || !data) {
        setError('Username atau Password salah');
        setLoading(false);
        return;
      }

      // 2. Ambil password_hash dari database
      const { password_hash } = data;

      // 3. Bandingkan password input dengan hash
      const isMatch = await bcrypt.compare(password, password_hash);

      if (isMatch) {
        // 4. Simpan session di localStorage jika cocok
        localStorage.setItem('admin_session', 'true');
        
        // Redirect ke halaman rekapitulasi
        navigate('/admin/rekapitulasi');
      } else {
        // 5. Tampilkan error jika password tidak cocok
        setError('Username atau Password salah');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan pada sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Plus_Jakarta_Sans']">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-gray-200 mx-4">
        <h2 
          className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-8"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Login Admin
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
              placeholder="Masukkan username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow pr-12"
                placeholder="Masukkan password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
