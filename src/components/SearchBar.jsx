import { useRef } from 'react';

export default function SearchBar({
  searchQuery = "",
  onSearchChange,
  categories = [],
  activeCategory = "Semua",
  onSelectCategory
}) {
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-[#FFCBA4] shadow-xs space-y-3">
      {/* Search Input */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#3c2a1e]/50">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari barang di bazar (contoh: Spikoe, Sambal, Bluder)..."
          className="w-full pl-9 pr-8 py-2 bg-[#FFFBF7] border border-[#FFCBA4] rounded-md text-xs sm:text-sm text-[#3c2a1e] placeholder-[#3c2a1e]/40 focus:outline-none focus:ring-1 focus:ring-[#F8C993] focus:bg-white transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#3c2a1e]/50 hover:text-[#3c2a1e] text-xs font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      {categories.length > 0 && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-semibold text-[#3c2a1e]/60 whitespace-nowrap hidden sm:block">Kategori:</span>
          
          <button 
            onClick={scrollLeft}
            className="p-1.5 rounded-full bg-[#FFFBF7] border border-[#FFCBA4] text-[#3c2a1e] hover:bg-[#FFCBA4]/30 shadow-sm flex-shrink-0 transition-colors"
            aria-label="Geser ke kiri"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>

          <div 
            ref={scrollContainerRef}
            className="flex flex-1 items-center gap-1.5 overflow-x-auto scrollbar-none py-1 scroll-smooth"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <span className="text-xs font-semibold text-[#3c2a1e]/60 whitespace-nowrap mr-1 sm:hidden">Kategori:</span>
            {categories.map((cat, idx) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={idx}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#FFCBA4] text-[#3c2a1e] border-[#F8C993]'
                      : 'bg-white text-[#3c2a1e]/70 border-[#FFCBA4]/60 hover:bg-[#FFCBA4]/30 hover:text-[#3c2a1e]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <button 
            onClick={scrollRight}
            className="p-1.5 rounded-full bg-[#FFFBF7] border border-[#FFCBA4] text-[#3c2a1e] hover:bg-[#FFCBA4]/30 shadow-sm flex-shrink-0 transition-colors"
            aria-label="Geser ke kanan"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      )}
    </div>
  );
}
