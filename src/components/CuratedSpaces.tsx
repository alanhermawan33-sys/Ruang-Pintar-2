import React, { useState } from 'react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';
import { Plus, Eye, Check } from 'lucide-react';

interface CuratedSpacesProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const CuratedSpaces: React.FC<CuratedSpacesProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categories = ['Semua', 'Residential', 'Commercial', 'Hospitality', 'Bespoke Furniture'];

  const filteredProducts = selectedCategory === 'Semua'
    ? products
    : products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  return (
    <section id="curated-spaces" className="max-w-7xl mx-auto px-6 md:px-12 py-20">
      {/* Header & Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="font-headline font-light text-3xl md:text-4xl text-[#171818] mb-3">
            Curated Spaces &amp; Bespoke Works
          </h2>
          <p className="font-body text-[#444748] text-base max-w-xl">
            A selection of environments where smart integration meets bespoke design craftsmanship.
          </p>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#171818] text-white shadow-xs'
                  : 'bg-[#efeeec] text-[#444748] hover:bg-[#e3e2e0] hover:text-[#171818]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Projects / Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product, idx) => (
          <div
            key={product.id}
            onClick={() => onSelectProduct(product)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#e3e2e0] hover:border-[#6a5d43] hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              {/* Image Container with Hover Overlay */}
              <div className="h-80 w-full overflow-hidden relative bg-[#f4f3f1]">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    // Fallback image if broken URL
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-[#171818]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="p-3 bg-white text-[#171818] rounded-full shadow-lg hover:bg-[#faf9f7] transition-transform hover:scale-110"
                    title="Lihat Detail & Specs"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="p-3 bg-[#6a5d43] text-white rounded-full shadow-lg hover:bg-[#51452d] transition-transform hover:scale-110"
                    title="Tambah ke Keranjang"
                  >
                    {addedIds[product.id] ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </button>
                </div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono tracking-wider text-[#171818] uppercase">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-headline text-xl text-[#171818] font-normal group-hover:text-[#6a5d43] transition-colors">
                    {product.title}
                  </h3>
                </div>
                <p className="font-body text-xs text-[#747878] mb-3">
                  {product.subtitle}
                </p>
                <p className="font-body text-sm text-[#444748] line-clamp-2 mb-4 leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Price Footer Bar (NO DISCOUNTS OR PROMO TAGS) */}
            <div className="px-6 pb-6 pt-2 border-t border-[#f4f3f1] flex items-center justify-between">
              <div>
                <span className="block font-mono text-[10px] text-[#747878] uppercase tracking-wider">
                  Investasi / Estimasi
                </span>
                <span className="font-mono text-lg font-semibold text-[#171818]">
                  {formatRupiah(product.price)}
                </span>
              </div>

              <button
                onClick={(e) => handleQuickAdd(e, product)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-all ${
                  addedIds[product.id]
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#efeeec] hover:bg-[#171818] hover:text-white text-[#171818]'
                }`}
              >
                {addedIds[product.id] ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Ditambahkan</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Inquire / Pesan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
