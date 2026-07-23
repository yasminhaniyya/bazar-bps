import { useState, useEffect } from 'react';

import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase';

export default function LoginModal({ isOpen, onClose, onSubmit }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      setUsername('');
      setPassword('');
      setError('');
      return undefined;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Cari username pada tabel admins
      const { data, error: dbError } = await supabase
        .from('admins')
        .select('password_hash')
        .eq('username', username.trim())
        .single();

      console.log("Supabase response:", { data, dbError });

      // Jika error atau username tidak ditemukan
      if (dbError || !data) {
        console.error("Login failed due to DB error or no data:", dbError);
        setError('Username atau Password salah');
        setLoading(false);
        return;
      }

      // 2. Ambil password_hash dari database
      const { password_hash } = data;

      // 3. Bandingkan password input dengan hash
      const isMatch = await bcrypt.compare(password, password_hash);

      if (isMatch) {
        // 4. Jika berhasil, simpan session
        localStorage.setItem('admin_session', 'true');
        
        // Teruskan ke fungsi callback Dashboard
        onSubmit?.({ username: username.trim(), password });
        onClose?.();
      } else {
        setError('Username atau Password salah');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan pada sistem');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white rounded-lg w-full max-w-sm p-6 z-10 shadow-lg">
        <h3 className="text-base font-bold text-slate-800 mb-3">Admin Login</h3>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-600 rounded text-xs font-medium text-center">
            {error}
          </div>
        )}

        <label className="block text-xs text-slate-600">Username</label>
        <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded text-sm" />

        <label className="block text-xs text-slate-600">Password</label>
        <div className="relative mb-4 w-full">
          <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded text-sm pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none">
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            )}
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} disabled={loading} className="px-3 py-1.5 bg-white border rounded text-sm disabled:opacity-50">Batal</button>
          <button type="submit" disabled={loading} className="px-3 py-1.5 bg-[#D96A12] text-white rounded text-sm disabled:opacity-50">
            {loading ? 'Memeriksa...' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}
