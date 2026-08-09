import React, { useState } from 'react';
import { OrderItem, Order } from '../types';
import { formatRupiah } from '../utils/formatters';
import { X, Trash2, Send, CheckCircle2, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onOrderSubmitted: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSubmitted,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [projectAddress, setProjectAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!customerName.trim() || !customerEmail.trim()) {
      alert('Mohon lengkapi Nama dan Email Anda.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerEmail,
          customerPhone,
          projectAddress,
          items: cartItems,
          notes,
          totalAmount,
        }),
      });

      if (!response.ok) throw new Error('Gagal mengirim pesanan');

      const newOrder: Order = await response.json();
      setSubmittedOrder(newOrder);
      onOrderSubmitted(newOrder);
      onClearCart();
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Gagal mengirim pesanan. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmittedOrder(null);
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setProjectAddress('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#e3e2e0] flex items-center justify-between bg-[#faf9f7]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#6a5d43]" />
            <h2 className="font-headline text-lg font-normal text-[#171818]">
              Daftar Pesanan &amp; Konsultasi Ruang
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#747878] hover:text-[#171818] rounded-full hover:bg-[#efeeec]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {submittedOrder ? (
            /* Order Success State */
            <div className="text-center py-12 px-4 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="font-mono text-xs uppercase text-[#6a5d43] tracking-wider block mb-1">
                  Pesanan Terkirim ke Admin
                </span>
                <h3 className="font-headline text-2xl text-[#171818] font-normal">
                  Terima Kasih, {submittedOrder.customerName}!
                </h3>
                <p className="font-mono text-sm text-[#171818] font-semibold mt-2 bg-[#f4f3f1] inline-block px-3 py-1 rounded border border-[#e3e2e0]">
                  No. Pesanan: {submittedOrder.orderNumber}
                </p>
              </div>

              <p className="font-body text-sm text-[#444748] leading-relaxed max-w-md mx-auto">
                Tim arsitek &amp; desainer Ruang Pintar telah menerima pesanan Anda secara <span className="font-semibold text-emerald-700">real-time</span>. Kami akan segera menghubungi Anda untuk tahap konsultasi desain &amp; estimasi detail.
              </p>

              <div className="bg-[#faf9f7] p-4 rounded-xl border border-[#e3e2e0] text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between text-[#747878]">
                  <span>Total Estimasi Proyek:</span>
                  <span className="text-[#171818] font-bold">{formatRupiah(submittedOrder.totalAmount)}</span>
                </div>
                <div className="flex justify-between text-[#747878]">
                  <span>Status:</span>
                  <span className="text-amber-700 font-bold uppercase">{submittedOrder.status}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full bg-[#171818] text-white py-3 rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-[#2c2c2c] transition-colors"
              >
                Selesai &amp; Tutup
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16 text-[#747878]">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-[#c4c7c7]" />
              <p className="font-headline text-lg text-[#171818] mb-1">Keranjang Masih Kosong</p>
              <p className="font-body text-xs">Pilih ruang atau item furniture bespoke di katalog untuk mengajukan pesanan.</p>
            </div>
          ) : (
            /* Cart Items List & Checkout Form */
            <div className="space-y-8">
              {/* Selected Items */}
              <div>
                <h3 className="font-mono text-xs text-[#747878] uppercase tracking-wider mb-3">
                  Item Terpilih ({cartItems.length})
                </h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center gap-4 bg-[#faf9f7] p-3 rounded-xl border border-[#e3e2e0]"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg bg-[#efeeec]"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-headline text-sm font-normal text-[#171818] truncate">
                          {item.title}
                        </h4>
                        <p className="font-mono text-xs text-[#6a5d43] font-medium">
                          {formatRupiah(item.price)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="w-5 h-5 rounded bg-white border border-[#c4c7c7] flex items-center justify-center text-xs text-[#171818]"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs px-1">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                            className="w-5 h-5 rounded bg-white border border-[#c4c7c7] flex items-center justify-center text-xs text-[#171818]"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.productId)}
                        className="p-2 text-[#747878] hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Form */}
              <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4 pt-4 border-t border-[#e3e2e0]">
                <h3 className="font-mono text-xs text-[#171818] uppercase tracking-wider font-semibold">
                  Informasi Pemesan &amp; Proyek
                </h3>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Bapak Hendra Wijaya"
                    className="w-full bg-white border border-[#c4c7c7] focus:border-[#6a5d43] focus:ring-0 px-3 py-2 rounded-lg text-sm text-[#171818]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="hendra@domain.com"
                      className="w-full bg-white border border-[#c4c7c7] focus:border-[#6a5d43] focus:ring-0 px-3 py-2 rounded-lg text-sm text-[#171818]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                      No. WhatsApp / HP
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+62 812-3456-7890"
                      className="w-full bg-white border border-[#c4c7c7] focus:border-[#6a5d43] focus:ring-0 px-3 py-2 rounded-lg text-sm text-[#171818]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                    Lokasi / Alamat Proyek
                  </label>
                  <input
                    type="text"
                    value={projectAddress}
                    onChange={(e) => setProjectAddress(e.target.value)}
                    placeholder="Jakarta, Surabaya, Bali, dll."
                    className="w-full bg-white border border-[#c4c7c7] focus:border-[#6a5d43] focus:ring-0 px-3 py-2 rounded-lg text-sm text-[#171818]"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                    Catatan Khusus / Project Brief
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Tuliskan spesifikasi ruangan, ukuran, atau permintaan warna..."
                    className="w-full bg-white border border-[#c4c7c7] focus:border-[#6a5d43] focus:ring-0 px-3 py-2 rounded-lg text-sm text-[#171818] resize-none"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer with Total and Submit Button */}
        {!submittedOrder && cartItems.length > 0 && (
          <div className="p-6 border-t border-[#e3e2e0] bg-[#faf9f7] space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs uppercase text-[#747878]">Total Investasi Proyek</span>
              <span className="font-mono text-xl font-semibold text-[#171818]">
                {formatRupiah(totalAmount)}
              </span>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full bg-[#171818] hover:bg-[#2c2c2c] text-white py-3.5 px-6 rounded-xl font-mono text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Mengirim Pesanan...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesanan (Real-Time)</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
