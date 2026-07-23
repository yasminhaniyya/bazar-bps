 
import bpsLogo from '../assets/bps-logo.svg';

export default function Navbar({ role = "Guest", onToggleSidebar, onLoginClick }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#FFCBA4]/60 shadow-xs w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Sidebar Toggle & BPS Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-[#3c2a1e] hover:bg-[#FFCBA4]/30 transition-colors focus:outline-none border border-[#FFCBA4]/60"
            aria-label="Tombol menu"
            title="Buka Menu Sidebar"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <img
              src={bpsLogo}
              alt="Logo BPS"
              className="h-8 w-auto object-contain"
            />
            <div className="border-l border-[#FFCBA4]/60 pl-3">
              <h1 className="text-base font-bold text-[#3c2a1e] leading-tight">
                Badan Pusat Statistik
              </h1>
              <p className="text-[11px] text-[#3c2a1e]/70 hidden sm:block">
                Dharma Wanita BPS Provinsi Jawa Timur
              </p>
            </div>
          </div>
        </div>

        {/* Right: Login Button */}
        <div className="flex items-center gap-3">
          {role === "Admin" && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#FFCBA4]/40 text-[#3c2a1e] border border-[#FFCBA4]">
              Mode Admin
            </span>
          )}
          <button
            onClick={onLoginClick}
            className="px-3.5 py-1.5 bg-[#FFCBA4] hover:bg-[#F8C993] text-[#3c2a1e] text-xs font-bold rounded transition-colors border border-[#F8C993] flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-[#3c2a1e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span>{role === "Admin" ? "Logout" : "Login"}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
