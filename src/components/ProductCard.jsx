 

export default function ProductCard({
  product,
  quantity = 0,
  onAddToCart,
  onRemoveFromCart
}) {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between overflow-hidden">
      {/* Gambar */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={product.gambar}
          alt={product.nama}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {/* category badge removed per request */}
      </div>

      {/* Detail: Nama & Harga */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="font-semibold text-slate-800 text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2.25rem]">
            {product.nama}
          </h3>
          <p className="text-sm sm:text-base font-bold text-[#D96A12] mt-1">
            {formatRupiah(product.harga)}
          </p>
        </div>

        {/* Tombol Tambah / Quantity Logic */}
        <div className="pt-2 border-t border-slate-100">
          {quantity === 0 ? (
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-1.5 px-3 bg-[#E67E22] hover:bg-[#D96A12] text-white font-medium text-xs rounded transition-colors flex items-center justify-center gap-1"
            >
              <span>+ Tambah</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded p-1">
              <button
                onClick={() => onRemoveFromCart(product.id)}
                className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 hover:bg-slate-100 rounded text-slate-700 font-bold text-xs transition-colors"
                aria-label="Kurangi jumlah"
              >
                -
              </button>
              <span className="font-bold text-xs text-slate-800 px-2">{quantity}</span>
              <button
                onClick={() => onAddToCart(product)}
                className="w-7 h-7 flex items-center justify-center bg-[#E67E22] hover:bg-[#D96A12] rounded text-white font-bold text-xs transition-colors"
                aria-label="Tambah jumlah"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
