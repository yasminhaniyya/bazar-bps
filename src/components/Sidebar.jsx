 

import bpsLogo from '../assets/bps-logo.svg';

export default function Sidebar({
  role = "Guest",
  isOpen = false,
  onClose,
  activeTab = "Home",
  onSelectTab,
  onLogout
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#3c2a1e]/20 backdrop-blur-xs transition-opacity duration-200"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-[#FFCBA4]/60 p-5 shadow-xl transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#FAD5A5]/60">
            <span className="font-bold text-[#3c2a1e] text-sm">Menu</span>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#3c2a1e] hover:bg-[#FFCBA4]/30 font-bold text-sm transition-colors"
              aria-label="Tutup sidebar"
            >
              ✕
            </button>
          </div>

          {/* Navigation Items */}
          <div>
            <p className="px-2 text-[11px] font-semibold text-[#3c2a1e]/50 uppercase tracking-wider mb-2">
              Menu Utama
            </p>
            <nav className="space-y-1">
              {/* Home */}
              <button
                onClick={() => {
                  onSelectTab("Home");
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                  activeTab === "Home"
                    ? 'bg-[#FFCBA4] text-[#3c2a1e] border border-[#F8C993]'
                    : 'text-[#3c2a1e]/80 hover:bg-[#FFCBA4]/30 hover:text-[#3c2a1e]'
                }`}
              >
                <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </button>

              {/* Rekap Barang (Admin Only) */}
              {role === "Admin" && (
                <button
                  onClick={() => {
                    onSelectTab("Rekap Barang");
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-colors ${
                    activeTab === "Rekap Barang"
                    ? 'bg-[#FFCBA4] text-[#3c2a1e] border border-[#F8C993]'
                    : 'text-[#3c2a1e]/80 hover:bg-[#FFCBA4]/30 hover:text-[#3c2a1e]'
                  }`}
                >
                  <svg className="w-5 h-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Rekap Barang</span>
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Footer info + logout (admin) */}
        <div className="pt-3 border-t border-[#FFCBA4]/60">
          <div className="flex items-center gap-3">
            <img src={bpsLogo} alt="Logo BPS" className="h-5 w-auto object-contain" />
            <div className="text-xs text-[#3c2a1e]">
              <p className="font-semibold">BPS Provinsi Jawa Timur</p>
              <p className="text-[11px] text-[#3c2a1e]/60 mt-0.5">Dharma Wanita Persatuan</p>
            </div>
          </div>

          {role === 'Admin' && (
            <button
              onClick={() => onLogout?.()}
              className="mt-3 w-full px-3 py-2 bg-[#FFCBA4] hover:bg-[#F8C993] text-[#3c2a1e] font-bold rounded transition-colors"
            >
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
