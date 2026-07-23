import { useState, useEffect } from 'react';

export default function LoginModal({ isOpen, onClose, onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev || '';
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ email: email.trim(), password });
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white rounded-lg w-full max-w-sm p-6 z-10 shadow-lg">
        <h3 className="text-base font-bold text-slate-800 mb-3">Admin Login</h3>

        <label className="block text-xs text-slate-600">Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded text-sm" />

        <label className="block text-xs text-slate-600">Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 px-3 py-2 border rounded text-sm" />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white border rounded text-sm">Batal</button>
          <button type="submit" className="px-3 py-1.5 bg-[#D96A12] text-white rounded text-sm">Login</button>
        </div>
      </form>
    </div>
  );
}
