import React from 'react';
import { Product } from '../types';
import { formatRupiah } from '../utils/formatters';
import { X, Check, ShoppingBag, Clock, Maximize2 } from 'lucide-react';

interface ProjectDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onDirectOrder: (product: Product) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectOrder,
}) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-[#e3e2e0] my-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-[#171818] rounded-full shadow-md backdrop-blur-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Image Column */}
          <div className="md:col-span-6 bg-[#f4f3f1] min-h-[320px] md:min-h-[500px] relative">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
              }}
            />
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white font-mono text-xs px-3 py-1 rounded">
              {product.category}
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-6 p-6 md:p-8 flex flex-col justify-between bg-[#faf9f7]">
            <div>
              <span className="font-mono text-xs text-[#6a5d43] uppercase tracking-widest block mb-1">
                {product.subtitle}
              </span>
              <h2 className="font-headline text-2xl md:text-3xl text-[#171818] font-light mb-4">
                {product.title}
              </h2>

              {/* Price display - strictly official price, no discount */}
              <div className="mb-6 p-4 bg-white rounded-xl border border-[#e3e2e0]">
                <span className="block font-mono text-xs text-[#747878] uppercase mb-0.5">
                  Official Price / Nilai Proyek
                </span>
                <span className="font-mono text-2xl font-semibold text-[#171818]">
                  {formatRupiah(product.price)}
                </span>
              </div>

              {/* Specs & Features */}
              <div className="space-y-4 mb-6">
                <p className="font-body text-sm text-[#444748] leading-relaxed">
                  {product.description}
                </p>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h4 className="font-mono text-xs text-[#171818] uppercase tracking-wider mb-2">
                      Features &amp; Specifications:
                    </h4>
                    <ul className="space-y-1.5">
                      {product.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs font-body text-[#444748]">
                          <Check className="w-4 h-4 text-[#6a5d43] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono border-t border-[#e3e2e0]">
                  {product.dimensions && (
                    <div className="flex items-center gap-1.5 text-[#444748]">
                      <Maximize2 className="w-4 h-4 text-[#747878]" />
                      <span>{product.dimensions}</span>
                    </div>
                  )}
                  {product.leadTime && (
                    <div className="flex items-center gap-1.5 text-[#444748]">
                      <Clock className="w-4 h-4 text-[#747878]" />
                      <span>{product.leadTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e3e2e0]">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 border border-[#171818] text-[#171818] hover:bg-[#171818] hover:text-white py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah Keranjang</span>
              </button>
              <button
                onClick={() => {
                  onDirectOrder(product);
                  onClose();
                }}
                className="flex-1 bg-[#2c2c2c] hover:bg-[#474747] text-white py-3 px-4 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors shadow-md"
              >
                Pesan / Inquire Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
