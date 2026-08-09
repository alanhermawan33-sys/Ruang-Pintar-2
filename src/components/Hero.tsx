import React from 'react';

interface HeroProps {
  onInitiateProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onInitiateProject }) => {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Brand Column */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBff8NqqLEQcWfB31NGM4-7mq2AUrjUQDZtHUMPo2NWsuVfLuv_Yk2kwaXNXDMH0e5DxV9RmZ2feUN9WZXM7CTRZvrpg9UTlbev0g9Tnf18W_9QresaycleOgTGF5cJkzWxqK8S8bPbNLqXi9fet5v1tz2fJqtfEispQBrMzMo59v_-3wbs_BSbWwDs2ZOtBj9u1cAM3TbBL_lU6vR3tfpusthcgI0vyuhL5EtjaI0RP6kvEvqwo_Pr5WjVkqnZVwrGnQ"
            alt="RUANG PINTAR Badge Logo"
            className="w-40 md:w-48 mb-8 opacity-95 mix-blend-multiply transition-transform hover:scale-105 duration-500"
          />
          <h1 className="font-headline font-extralight text-4xl sm:text-5xl lg:text-6xl text-[#171818] mb-6 leading-tight tracking-tight">
            Design &amp; Build Your Imagination.
          </h1>
          <p className="font-body text-base md:text-lg text-[#444748] mb-8 max-w-lg leading-relaxed">
            Ruang Pintar translates visionary concepts into tactile realities. We merge heritage craftsmanship with forward-thinking smart design, curating spaces that breathe intelligence and sophisticated minimalism.
          </p>
          <div>
            <button
              onClick={onInitiateProject}
              className="inline-flex items-center justify-center bg-[#2c2c2c] text-white px-8 py-4 rounded-lg font-mono text-xs uppercase tracking-widest hover:bg-[#474747] transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Initiate Project
            </button>
          </div>
        </div>

        {/* Right Architectural Showcase Image */}
        <div className="lg:col-span-7 h-[420px] md:h-[580px] rounded-2xl overflow-hidden relative shadow-2xl shadow-[#171818]/10 group">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhhI9wh9EvLtgDb2h3KKoo9IvbM68-3Md-BK4cQDGmY05uJR-_zQe8yEctjcGV87iLwhpuO6qF7OEeXzkPeoyfBOWU0KNa3E-DFyq1ri3ILIb92qfLEMABPl6J1RQlvry9UGM9NHdNBxQR2RNexChLJjoM7n_LlgnCSGIUUNfpydkaWMOwBR8OnSwYY7lpWRvyRjG4IF3VkSbUgun8u-3G26onh4M4cjWzTOZl__TDVwtmstQ_CmqP"
            alt="Minimalist Architectural Interior"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60"></div>
          <div className="absolute bottom-6 left-6 text-white font-mono text-xs tracking-wider bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/20">
            FLAGSHIP ARCHITECTURAL SHOWCASE
          </div>
        </div>
      </div>
    </section>
  );
};
