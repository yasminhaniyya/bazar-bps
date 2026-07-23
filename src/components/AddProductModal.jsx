import { useState, useMemo, useEffect } from 'react';
import { categories as categoryOptions } from '../data/products';

export default function AddProductModal({ isOpen, onClose, onSubmit }) {
  const validCategories = categoryOptions.filter((cat) => cat !== 'Semua');
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [isHargaFocused, setIsHargaFocused] = useState(false);
  const [stock, setStock] = useState('');
  const [kategori, setKategori] = useState(validCategories[0] || 'Keripik');
  const [gambarFile, setGambarFile] = useState(null);

  const preview = useMemo(() => {
    if (!gambarFile) return '';
    return URL.createObjectURL(gambarFile);
  }, [gambarFile]);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setGambarFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      nama: nama.trim(),
      harga: Number(harga) || 0,
      kategori,
      stock: Number(stock) || 0,
      gambarFile,
      gambarPreview: preview
    };
    onSubmit?.(payload);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white rounded-lg w-full max-w-md p-5 z-10 shadow-lg">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Tambah Barang</h3>

        <label className="block text-xs text-slate-600">Foto</label>
        <div className="mb-2">
          <input
            id="gambar-file"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="gambar-file"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#E67E22] hover:bg-[#D96A12] text-white rounded cursor-pointer text-sm font-semibold"
          >
            Tambah Gambar
          </label>
          {gambarFile && (
            <span className="ml-3 text-xs text-slate-500">{gambarFile.name}</span>
          )}
        </div>
        {preview && (
          <div className="mb-2">
            <img src={preview} alt="preview" className="w-32 h-20 object-cover rounded" />
          </div>
        )}

        <label className="block text-xs text-slate-600">Nama Barang</label>
        <input required value={nama} onChange={(e) => setNama(e.target.value)} className="w-full mb-2 px-2 py-1 border rounded text-sm" />

        <label className="block text-xs text-slate-600">Kategori</label>
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full mb-2 px-2 py-1 border rounded text-sm"
        >
          {validCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label className="block text-xs text-slate-600">Harga Jual (IDR)</label>
        <input
          required
          value={isHargaFocused ? harga : (harga ? new Intl.NumberFormat('id-ID').format(Number(harga)) : '')}
          onChange={(e) => setHarga(e.target.value.replace(/[^0-9]/g, ''))}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          min="0"
          onFocus={() => setIsHargaFocused(true)}
          onBlur={() => setIsHargaFocused(false)}
          onWheel={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if (e.ctrlKey || e.metaKey) return;
            const allowed = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
            if (!/^[0-9]$/.test(e.key) && !allowed.includes(e.key)) {
              e.preventDefault();
            }
          }}
          className="w-full mb-2 px-2 py-1 border rounded text-sm"
        />

        <label className="block text-xs text-slate-600">Stok (disimpan, tidak ditampilkan)</label>
        <input value={stock} onChange={(e) => setStock(e.target.value)} type="number" min="0" className="w-full mb-4 px-2 py-1 border rounded text-sm" />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 bg-white border rounded text-sm">Batal</button>
          <button type="submit" className="px-3 py-1.5 bg-[#E67E22] text-white rounded text-sm">Simpan</button>
        </div>
      </form>
    </div>
  );
}
