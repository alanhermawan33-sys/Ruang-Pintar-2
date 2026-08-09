import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onToggleAdmin: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onToggleAdmin, onNavigateSection }) => {
  return (
    <footer className="w-full py-16 bg-[#faf9f7] border-t border-[#e3e2e0]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="font-headline text-2xl font-light text-[#171818] tracking-widest">
          RUANG PINTAR
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-body text-xs text-[#444748]">
          <button onClick={() => onNavigateSection('core-principles')} className="hover:text-[#171818] transition-colors">
            Sustainability
          </button>
          <button onClick={() => onNavigateSection('curated-spaces')} className="hover:text-[#171818] transition-colors">
            Shipping &amp; Returns
          </button>
          <button onClick={() => onNavigateSection('contact')} className="hover:text-[#171818] transition-colors">
            Privacy Policy
          </button>
          <button onClick={() => onNavigateSection('contact')} className="hover:text-[#171818] transition-colors">
            Contact
          </button>
          <button onClick={onToggleAdmin} className="text-[#6a5d43] hover:underline flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Panel</span>
          </button>
        </div>

        <div className="font-body text-xs text-[#747878]">
          © 2026 RUANG PINTAR. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
