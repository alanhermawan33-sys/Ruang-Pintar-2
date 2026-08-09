import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface NavbarProps {
  activeTab: 'showcase' | 'admin';
  setActiveTab: (tab: 'showcase' | 'admin') => void;
  cartCount: number;
  setIsCartOpen: (open: boolean) => void;
  newOrdersCount: number;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  setIsCartOpen,
  onNavigateSection,
}) => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#faf9f7]/85 backdrop-blur-xl border-b border-[#e3e2e0] shadow-xs transition-all duration-300">
      <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => { setActiveTab('showcase'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="cursor-pointer flex items-center gap-2 group"
        >
          <div className="font-headline text-xl md:text-2xl font-light tracking-widest text-[#171818] group-hover:text-[#6a5d43] transition-colors">
            RUANG PINTAR
          </div>
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-wider text-[#747878] border border-[#c4c7c7] px-2 py-0.5 rounded-full">
            ARCH & DESIGN
          </span>
        </div>

        {/* Desktop Navigation Links */}
        {activeTab === 'showcase' ? (
          <div className="hidden md:flex items-center gap-8 font-headline text-xs uppercase tracking-wider">
            <button 
              onClick={() => onNavigateSection('curated-spaces')}
              className="text-[#444748] hover:text-[#171818] transition-colors"
            >
              Collections
            </button>
            <button 
              onClick={() => onNavigateSection('curated-spaces')}
              className="text-[#444748] hover:text-[#171818] transition-colors"
            >
              Projects
            </button>
            <button 
              onClick={() => onNavigateSection('core-principles')}
              className="text-[#171818] border-b border-[#6a5d43] pb-0.5 font-medium"
            >
              Bespoke
            </button>
            <button 
              onClick={() => onNavigateSection('contact')}
              className="text-[#444748] hover:text-[#171818] transition-colors"
            >
              Heritage & Contact
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-[#efeeec] px-3 py-1 rounded-full text-xs font-mono text-[#1a1c1b]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Admin Control Panel & Real-Time Monitor</span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Cart / Shopping Bag Button */}
          {activeTab === 'showcase' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#171818] hover:text-[#6a5d43] transition-colors bg-white rounded-lg border border-[#e3e2e0] hover:border-[#6a5d43]"
              title="Project Inquiry & Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#6a5d43] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#faf9f7]">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
