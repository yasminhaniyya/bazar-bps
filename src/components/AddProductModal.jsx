import { useState, useMemo, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function AddProductModal({ isOpen, onClose, onSubmit, onDelete, mode = 'add', initialProduct = null }) {
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [isHargaFocused, setIsHargaFocused] = useState(false);
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Kue & Roti');
  const [gambarFile, setGambarFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [error, setError] = useState(null);

  const preview = useMemo(() => {
    if (gambarFile) return URL.createObjectURL(gambarFile);
    return existingImageUrl || '';
  }, [gambarFile, existingImageUrl]);

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (initialProduct) {
        setNama(initialProduct.nama || '');
        setHarga(initialProduct.harga?.toString() || '');
        setStock(initialProduct.stok?.toString() || '');
        setCategory(initialProduct.kategori || 'Kue & Roti');
        setExistingImageUrl(initialProduct.gambarPreview || initialProduct.gambar || '');
        setGambarFile(null);
        setError(null);
        setLoading(false);
      } else {
        setNama('');
        setHarga('');
        setStock('');
        setCategory('Kue & Roti');
        setGambarFile(null);
        setExistingImageUrl('');
        setError(null);
        setLoading(false);
      }
      return () => {
        document.body.style.overflow = prev;
      };
    } else {
      setNama('');
      setHarga('');
      setStock('');
      setCategory('Kue & Roti');
      setGambarFile(null);
      setExistingImageUrl('');
      setError(null);
      setLoading(false);
    }
    return undefined;
  }, [isOpen, initialProduct]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setGambarFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = existingImageUrl || null;

      if (gambarFile) {
        const fileExt = gambarFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, gambarFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      if (mode === 'edit' && initialProduct?.id) {
        const { data: updatedProduct, error: dbError } = await supabase
          .from('products')
          .update({
            name: nama.trim(),
            price: Number(harga) || 0,
            stock: Number(stock) || 0,
            category: category,
            image_url: imageUrl,
            is_active: true
          })
          .eq('id', initialProduct.id)
          .select()
          .single();

        if (dbError) throw dbError;

        const payload = {
          id: updatedProduct?.id || initialProduct.id,
          nama: nama.trim(),
          harga: Number(harga) || 0,
          stock: Number(stock) || 0,
          kategori: category,
          gambarPreview: imageUrl
        };

        onSubmit?.(payload);
      } else {
        if (!imageUrl) {
          throw new Error("Mohon tambahkan foto barang terlebih dahulu.");
        }

        const { data: insertedProduct, error: dbError } = await supabase
          .from('products')
          .insert([
            {
              name: nama.trim(),
              price: Number(harga) || 0,
              stock: Number(stock) || 0,
              category: category,
              image_url: imageUrl,
              is_active: true
            }
          ])
          .select()
          .single();

        if (dbError) throw dbError;

        const payload = {
          id: insertedProduct?.id || Date.now(),
          nama: nama.trim(),
          harga: Number(harga) || 0,
          stock: Number(stock) || 0,
          kategori: category,
          gambarPreview: imageUrl
        };
        
        onSubmit?.(payload);
      }

      onClose?.();
      
    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message || 'Terjadi kesalahan saat menambahkan barang');
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteAction = async () => {
    if (!initialProduct?.id) return;
    setError(null);
    setDeleteLoading(true);
    setShowConfirmDelete(false);
    try {
      const { error: deleteError } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', initialProduct.id);

      if (deleteError) throw deleteError;
      onDelete?.(initialProduct.id);
      onClose?.();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.message || 'Terjadi kesalahan saat menghapus barang');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteProduct = () => {
    setShowConfirmDelete(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <form onSubmit={handleSubmit} className="relative bg-white rounded-lg w-full max-w-md p-5 z-10 shadow-lg max-h-[90vh] overflow-y-auto">
        <h3 className="text-sm font-bold text-slate-800 mb-3">{mode === 'edit' ? 'Edit Barang' : 'Tambah Barang'}</h3>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 border border-red-200 text-xs rounded font-medium">
            Error: {error}
          </div>
        )}

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
            className="inline-flex items-center justify-center px-4 py-2 bg-[#E67E22] hover:bg-[#D96A12] text-white rounded cursor-pointer text-sm font-semibold transition-colors"
          >
            Tambah Gambar
          </label>
          {gambarFile && (
            <span className="ml-3 text-xs text-slate-500">{gambarFile.name}</span>
          )}
        </div>
        {preview && (
          <div className="mb-3">
            <img src={preview} alt="preview" className="w-32 h-20 object-cover rounded" />
          </div>
        )}

        <label className="block text-xs text-slate-600 mb-1">Nama Barang</label>
        <input required value={nama} onChange={(e) => setNama(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#E67E22] outline-none" />

        <label className="block text-xs text-slate-600 mb-1">Kategori</label>
        <select required value={category} onChange={(e) => setCategory(e.target.value)} className="w-full mb-3 px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#E67E22] outline-none bg-white">
          <option value="Kue & Roti">Kue & Roti</option>
          <option value="Keripik">Keripik</option>
          <option value="Sambal">Sambal</option>
        </select>

        <label className="block text-xs text-slate-600 mb-1">Harga Jual (IDR)</label>
        <input
          required
          value={isHargaFocused ? harga : (harga ? new Intl.NumberFormat('id-ID').format(Number(harga)) : '')}
          onChange={(e) => setHarga(e.target.value.replace(/[^0-9]/g, ''))}
          type="text"
          inputMode="numeric"
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
          className="w-full mb-3 px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#E67E22] outline-none"
        />

        <label className="block text-xs text-slate-600 mb-1">Stok Awal</label>
        <input required value={stock} onChange={(e) => setStock(e.target.value)} type="number" min="0" className="w-full mb-5 px-3 py-2 border rounded text-sm focus:ring-1 focus:ring-[#E67E22] outline-none" />

        <div className="flex justify-between gap-2">
          {mode === 'edit' && initialProduct?.id ? (
            <button
              type="button"
              onClick={handleDeleteProduct}
              disabled={loading || deleteLoading}
              className="px-4 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {deleteLoading ? 'Menghapus...' : 'Hapus Produk'}
            </button>
          ) : (
            <div />
          )}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} disabled={loading || deleteLoading} className="px-4 py-2 bg-white border rounded text-sm font-medium hover:bg-slate-50 disabled:opacity-50">Batal</button>
            <button type="submit" disabled={loading || deleteLoading} className="px-4 py-2 bg-[#E67E22] text-white rounded text-sm font-bold hover:bg-[#D96A12] disabled:opacity-50 transition-colors">
              {loading ? 'Menyimpan...' : mode === 'edit' ? 'Simpan Perubahan' : 'Simpan Barang'}
            </button>
          </div>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmDelete(false)} />
          <div className="relative bg-white rounded-xl w-full max-w-sm p-6 z-10 shadow-2xl scale-100 transform transition-all">
            <div className="mb-5 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Hapus Barang?</h3>
              <p className="text-sm text-slate-600">
                Apakah kamu yakin ingin menghapus <strong>{nama}</strong>? Barang ini akan disembunyikan dari etalase.
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <button 
                type="button" 
                onClick={() => setShowConfirmDelete(false)} 
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-200 transition-colors"
              >
                Batal
              </button>
              <button 
                type="button" 
                onClick={confirmDeleteAction} 
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
