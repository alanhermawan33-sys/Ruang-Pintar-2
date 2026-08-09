import React from 'react';
import { Lightbulb, Leaf, Compass } from 'lucide-react';

export const CorePrinciples: React.FC = () => {
  return (
    <section id="core-principles" className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      <div className="text-center mb-16">
        <h2 className="font-headline font-light text-3xl md:text-4xl text-[#171818] mb-4">
          Core Principles
        </h2>
        <div className="w-12 h-0.5 bg-[#6a5d43] mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Value 1: Innovation */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xs border border-[#e3e2e0] hover:border-[#d6c5a5] hover:shadow-lg transition-all duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-[#f0debc]/40 flex items-center justify-center text-[#6a5d43] mb-6 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-normal text-xl text-[#171818] mb-3">
            Innovation
          </h3>
          <p className="font-body text-sm md:text-base text-[#444748] leading-relaxed">
            Integrating unseen technology within tactile materials, creating seamless, intelligent environments that anticipate needs without visual clutter.
          </p>
        </div>

        {/* Value 2: Sustainability */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xs border border-[#e3e2e0] hover:border-[#d6c5a5] hover:shadow-lg transition-all duration-300 group md:translate-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#e0e4d4] flex items-center justify-center text-[#292e23] mb-6 group-hover:scale-110 transition-transform">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-normal text-xl text-[#171818] mb-3">
            Sustainability
          </h3>
          <p className="font-body text-sm md:text-base text-[#444748] leading-relaxed">
            Sourcing enduring materials and employing practices that respect both the immediate environment and the broader ecological landscape.
          </p>
        </div>

        {/* Value 3: Expertise */}
        <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xs border border-[#e3e2e0] hover:border-[#d6c5a5] hover:shadow-lg transition-all duration-300 group">
          <div className="w-12 h-12 rounded-xl bg-[#e4e2e1] flex items-center justify-center text-[#171818] mb-6 group-hover:scale-110 transition-transform">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-headline font-normal text-xl text-[#171818] mb-3">
            Expertise
          </h3>
          <p className="font-body text-sm md:text-base text-[#444748] leading-relaxed">
            A mastery of proportion, light, and texture. Our craftsmanship ensures every detail is intentionally placed and immaculately finished.
          </p>
        </div>
      </div>
    </section>
  );
};
