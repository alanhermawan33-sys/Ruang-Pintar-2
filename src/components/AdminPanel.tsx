import React, { useState, useEffect } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { formatRupiah, formatDate } from '../utils/formatters';
import {
  Bell,
  Plus,
  Edit2,
  Trash2,
  Image as ImageIcon,
  DollarSign,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Zap,
  RefreshCw,
  Sparkles,
  PackageCheck,
  ChevronRight,
  TrendingUp,
  Layers,
  ShoppingBag
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onRefreshData: () => void;
  onUpdateProductPrice: (id: string, newPrice: number) => Promise<void>;
  onUpdateProductImage: (id: string, newImageUrl: string) => Promise<void>;
  onAddProduct: (productData: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onRefreshData,
  onUpdateProductPrice,
  onUpdateProductImage,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'catalog' | 'stats'>('orders');
  
  // Real-time notification state
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [recentLiveOrder, setRecentLiveOrder] = useState<Order | null>(null);
  const [orderFilter, setOrderFilter] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Editing price modal state
  const [editingPriceItem, setEditingPriceItem] = useState<Product | null>(null);
  const [newPriceInput, setNewPriceInput] = useState<string>('');

  // Editing image modal state
  const [editingImageItem, setEditingImageItem] = useState<Product | null>(null);
  const [newImageUrlInput, setNewImageUrlInput] = useState<string>('');

  // Add product form modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Residential');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFeatures, setNewFeatures] = useState('');
  const [newDimensions, setNewDimensions] = useState('');
  const [newLeadTime, setNewLeadTime] = useState('');

  // Connect to SSE stream for live real-time order tracking
  useEffect(() => {
    const eventSource = new EventSource('/api/orders/stream');

    eventSource.onopen = () => {
      setRealtimeConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'NEW_ORDER') {
          const newOrd: Order = data.order;
          setRecentLiveOrder(newOrd);
          onRefreshData();

          // Play subtle browser audio chime if permitted
          try {
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
            gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.3);
          } catch (e) {
            // Audio context blocked or unsupported
          }

          setTimeout(() => {
            setRecentLiveOrder(null);
          }, 8000);
        } else if (data.type === 'ORDER_UPDATED') {
          onRefreshData();
        }
      } catch (e) {
        console.error('Error parsing SSE event:', e);
      }
    };

    eventSource.onerror = () => {
      setRealtimeConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [onRefreshData]);

  // Handle Price Edit submission
  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceItem) return;
    const priceVal = parseFloat(newPriceInput.replace(/[^0-9]/g, ''));
    if (isNaN(priceVal) || priceVal < 0) {
      alert('Masukkan harga yang valid.');
      return;
    }

    await onUpdateProductPrice(editingPriceItem.id, priceVal);
    setEditingPriceItem(null);
  };

  // Handle Image URL Edit submission
  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImageItem) return;
    if (!newImageUrlInput.trim()) {
      alert('Masukkan URL foto/gambar yang valid.');
      return;
    }

    await onUpdateProductImage(editingImageItem.id, newImageUrlInput.trim());
    setEditingImageItem(null);
  };

  // Handle Add Product submission
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPrice.trim()) {
      alert('Judul dan Harga wajib diisi.');
      return;
    }

    const priceVal = parseFloat(newPrice.replace(/[^0-9]/g, ''));

    await onAddProduct({
      title: newTitle.trim(),
      category: newCategory,
      subtitle: newSubtitle.trim() || `${newCategory} / Smart Design`,
      price: priceVal,
      imageUrl: newImageUrl.trim() || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      description: newDescription.trim() || 'Visual detail curated by RUANG PINTAR architecture studio.',
      features: newFeatures ? newFeatures.split(',').map(f => f.trim()) : ['Heritage Craftsmanship'],
      dimensions: newDimensions.trim() || 'Bespoke Size',
      leadTime: newLeadTime.trim() || '6 - 8 Weeks',
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    setNewPrice('');
    setNewImageUrl('');
    setNewDescription('');
    setNewFeatures('');
    setNewDimensions('');
    setNewLeadTime('');
  };

  // Trigger test sample order
  const handleTriggerTestOrder = async () => {
    try {
      await fetch('/api/orders/seed-sample', { method: 'POST' });
    } catch (e) {
      console.error('Error triggering sample order:', e);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'Semua' || order.status.toLowerCase() === orderFilter.toLowerCase();
    const matchesSearch = searchTerm === '' ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="min-h-screen bg-[#faf9f7] pt-24 pb-20 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
      {/* Live Alert Toast Banner */}
      {recentLiveOrder && (
        <div className="fixed top-20 right-6 z-50 bg-[#171818] text-white p-4 rounded-2xl shadow-2xl border border-[#d6c5a5] flex items-center gap-4 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider bg-emerald-500 text-black font-bold px-1.5 py-0.5 rounded">
                REAL-TIME NEW ORDER
              </span>
              <span className="font-mono text-xs text-[#d6c5a5]">{recentLiveOrder.orderNumber}</span>
            </div>
            <p className="font-headline text-sm font-normal mt-0.5">
              {recentLiveOrder.customerName} - {formatRupiah(recentLiveOrder.totalAmount)}
            </p>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-[#e3e2e0] shadow-xs mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-headline text-2xl md:text-3xl text-[#171818] font-light">
              Admin Control Center
            </h1>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
              realtimeConnected
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}>
              <span className={`w-2 h-2 rounded-full ${realtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span>{realtimeConnected ? 'Real-Time SSE Connected' : 'Connecting SSE...'}</span>
            </div>
          </div>
          <p className="font-body text-xs md:text-sm text-[#747878]">
            Kelola foto &amp; katalog ruang, edit harga langsung, dan pantau pesanan masuk secara real-time.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleTriggerTestOrder}
            className="flex items-center gap-1.5 bg-[#efeeec] hover:bg-[#e3e2e0] text-[#171818] px-3.5 py-2 rounded-xl font-mono text-xs uppercase tracking-wider transition-colors border border-[#c4c7c7]"
            title="Kirim pesanan sampel untuk menguji fitur pantau real-time"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Simulasi Pesanan Baru</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 bg-[#2c2c2c] hover:bg-[#474747] text-white px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Ruang / Produk</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-[#e3e2e0] mb-8 gap-8 font-mono text-xs uppercase tracking-wider">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'orders'
              ? 'border-[#171818] text-[#171818] font-bold'
              : 'border-transparent text-[#747878] hover:text-[#171818]'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Pantau Pesanan Masuk</span>
          {pendingOrdersCount > 0 && (
            <span className="bg-amber-700 text-white text-[10px] font-bold px-2 py-0.2 rounded-full">
              {pendingOrdersCount} Baru
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'catalog'
              ? 'border-[#171818] text-[#171818] font-bold'
              : 'border-transparent text-[#747878] hover:text-[#171818]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kelola Produk &amp; Edit Harga ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'stats'
              ? 'border-[#171818] text-[#171818] font-bold'
              : 'border-transparent text-[#747878] hover:text-[#171818]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Ringkasan Nilai Proyek</span>
        </button>
      </div>

      {/* TAB 1: REAL-TIME ORDERS TRACKER */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filter and Search controls */}
          <div className="bg-white p-4 rounded-xl border border-[#e3e2e0] flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#747878] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama pemesan, no. pesanan, atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg text-xs font-body focus:border-[#6a5d43] focus:ring-0"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <Filter className="w-4 h-4 text-[#747878] shrink-0" />
              {['Semua', 'Pending', 'In Consultation', 'In Production', 'Completed', 'Cancelled'].map(st => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] whitespace-nowrap transition-colors ${
                    orderFilter === st
                      ? 'bg-[#171818] text-white'
                      : 'bg-[#efeeec] text-[#444748] hover:bg-[#e3e2e0]'
                  }`}
                >
                  {st === 'Pending' ? 'Baru (Pending)' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center text-[#747878] border border-[#e3e2e0]">
              <PackageCheck className="w-12 h-12 mx-auto mb-3 text-[#c4c7c7]" />
              <p className="font-headline text-lg text-[#171818]">Belum ada pesanan terdeteksi</p>
              <p className="font-body text-xs mt-1">Klik "Simulasi Pesanan Baru" di atas untuk menguji siaran real-time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 border border-[#e3e2e0] hover:border-[#6a5d43] shadow-xs transition-all"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-[#f4f3f1]">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#171818]">
                          {order.orderNumber}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold ${
                          order.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : order.status === 'In Consultation'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'In Production'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {order.status === 'Pending' ? '★ Pesanan Baru' : order.status}
                        </span>
                      </div>

                      <div className="text-xs text-[#747878] font-mono mt-1 flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Status Changer */}
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#747878]">Ubah Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-[#faf9f7] border border-[#c4c7c7] rounded-lg text-xs font-mono px-3 py-1.5 focus:border-[#6a5d43]"
                      >
                        <option value="Pending">Pending (Pesanan Baru)</option>
                        <option value="In Consultation">In Consultation</option>
                        <option value="In Production">In Production</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer & Address Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 text-xs">
                    <div>
                      <span className="font-mono text-[10px] text-[#747878] uppercase block">Pemesan</span>
                      <p className="font-headline font-semibold text-[#171818] text-sm mt-0.5">{order.customerName}</p>
                      <p className="font-body text-[#444748]">{order.customerEmail}</p>
                      <p className="font-mono text-[#6a5d43] mt-0.5">{order.customerPhone}</p>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-[#747878] uppercase block">Lokasi Proyek</span>
                      <p className="font-body text-[#171818] mt-0.5">{order.projectAddress || 'Lokasi belum diisi'}</p>
                      {order.notes && (
                        <p className="font-body text-[#444748] italic mt-1 bg-[#faf9f7] p-2 rounded border border-[#e3e2e0]">
                          "{order.notes}"
                        </p>
                      )}
                    </div>

                    <div>
                      <span className="font-mono text-[10px] text-[#747878] uppercase block">Item Dipesan</span>
                      <div className="space-y-1 mt-1">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[#171818] font-body">
                            <span>{it.quantity}x {it.title}</span>
                            <span className="font-mono font-medium">{formatRupiah(it.price * it.quantity)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 mt-2 border-t border-[#f4f3f1] flex justify-between font-mono font-bold text-[#171818]">
                        <span>Total Nilai:</span>
                        <span className="text-sm">{formatRupiah(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CATALOG MANAGEMENT & EDIT HARGA */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-[#e3e2e0] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  {/* Photo Preview & Photo Edit Button */}
                  <div className="h-48 w-full bg-[#f4f3f1] relative group">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <button
                      onClick={() => {
                        setEditingImageItem(prod);
                        setNewImageUrlInput(prod.imageUrl);
                      }}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-mono text-xs uppercase"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>Ubah Foto Gambar</span>
                    </button>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-mono uppercase text-[#171818]">
                      {prod.category}
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div className="p-5">
                    <h3 className="font-headline text-lg text-[#171818] font-normal mb-1">
                      {prod.title}
                    </h3>
                    <p className="font-body text-xs text-[#747878] mb-3">
                      {prod.subtitle}
                    </p>
                    <p className="font-body text-xs text-[#444748] line-clamp-2 leading-relaxed">
                      {prod.description}
                    </p>
                  </div>
                </div>

                {/* Price Display & Edit Button (Strict official price, no discount!) */}
                <div className="p-5 pt-3 border-t border-[#f4f3f1] bg-[#faf9f7] flex items-center justify-between">
                  <div>
                    <span className="block font-mono text-[10px] text-[#747878] uppercase">Harga Proyek</span>
                    <span className="font-mono text-base font-bold text-[#171818]">
                      {formatRupiah(prod.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPriceItem(prod);
                        setNewPriceInput(prod.price.toString());
                      }}
                      className="flex items-center gap-1 bg-white hover:bg-[#171818] hover:text-white text-[#171818] px-3 py-1.5 rounded-lg border border-[#c4c7c7] font-mono text-xs uppercase tracking-wider transition-colors shadow-2xs"
                      title="Edit Harga Produk Ini"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Harga</span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Hapus item "${prod.title}" dari katalog?`)) {
                          onDeleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 text-[#747878] hover:text-red-600 rounded"
                      title="Hapus Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STATS OVERVIEW */}
      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#e3e2e0] shadow-xs">
            <span className="font-mono text-xs text-[#747878] uppercase block mb-1">Total Nilai Pesanan</span>
            <span className="font-mono text-2xl font-bold text-[#171818]">
              {formatRupiah(totalRevenue)}
            </span>
            <p className="font-body text-xs text-[#444748] mt-2">Akumulasi estimasi nilai investasi dari pesanan terdaftar.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e3e2e0] shadow-xs">
            <span className="font-mono text-xs text-[#747878] uppercase block mb-1">Total Pesanan Masuk</span>
            <span className="font-mono text-2xl font-bold text-[#171818]">
              {orders.length} Pesanan
            </span>
            <p className="font-body text-xs text-[#444748] mt-2">{pendingOrdersCount} pesanan berstatus baru / pending.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#e3e2e0] shadow-xs">
            <span className="font-mono text-xs text-[#747878] uppercase block mb-1">Katalog Aktif</span>
            <span className="font-mono text-2xl font-bold text-[#171818]">
              {products.length} Item Ruang
            </span>
            <p className="font-body text-xs text-[#444748] mt-2">Ruang &amp; karya bespoke siap dipesan oleh klien.</p>
          </div>
        </div>
      )}

      {/* MODAL 1: EDIT HARGA */}
      {editingPriceItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-[#e3e2e0]">
            <h3 className="font-headline text-xl text-[#171818] mb-1 font-normal">Edit Harga Produk</h3>
            <p className="font-body text-xs text-[#747878] mb-4">
              Ubah harga untuk: <span className="font-semibold text-[#171818]">{editingPriceItem.title}</span>
            </p>

            <form onSubmit={handleSavePrice} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase text-[#747878] mb-1">
                  Harga Baru (Rupiah)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-sm text-[#747878]">Rp</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="1000000"
                    value={newPriceInput}
                    onChange={(e) => setNewPriceInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg font-mono text-sm focus:border-[#6a5d43]"
                  />
                </div>
                <span className="block font-mono text-[11px] text-[#6a5d43] mt-1">
                  Pratinjau: {formatRupiah(Number(newPriceInput) || 0)}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPriceItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#c4c7c7] font-mono text-xs uppercase hover:bg-[#efeeec]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#171818] text-white py-2.5 rounded-xl font-mono text-xs uppercase hover:bg-[#2c2c2c]"
                >
                  Simpan Harga Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: UBAH FOTO / IMAGE URL */}
      {editingImageItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-[#e3e2e0]">
            <h3 className="font-headline text-xl text-[#171818] mb-1 font-normal">Ubah Foto Gambar</h3>
            <p className="font-body text-xs text-[#747878] mb-4">
              Pilih / tempel URL foto untuk: <span className="font-semibold text-[#171818]">{editingImageItem.title}</span>
            </p>

            <form onSubmit={handleSaveImage} className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase text-[#747878] mb-1">
                  URL Foto Gambar (Image Link)
                </label>
                <input
                  type="url"
                  required
                  value={newImageUrlInput}
                  onChange={(e) => setNewImageUrlInput(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg font-mono text-xs focus:border-[#6a5d43]"
                />
              </div>

              {/* Preview Box */}
              {newImageUrlInput && (
                <div className="p-2 border border-[#e3e2e0] rounded-xl bg-[#faf9f7]">
                  <span className="block font-mono text-[10px] text-[#747878] uppercase mb-1">Pratinjau Gambar:</span>
                  <img
                    src={newImageUrlInput}
                    alt="Pratinjau"
                    className="h-36 w-full object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingImageItem(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#c4c7c7] font-mono text-xs uppercase hover:bg-[#efeeec]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#171818] text-white py-2.5 rounded-xl font-mono text-xs uppercase hover:bg-[#2c2c2c]"
                >
                  Simpan Foto Gambar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: TAMBAH RUANG / PRODUK BARU */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-xl shadow-2xl border border-[#e3e2e0] my-8">
            <h3 className="font-headline text-2xl text-[#171818] mb-1 font-normal">Tambah Ruang / Produk Baru</h3>
            <p className="font-body text-xs text-[#747878] mb-6">
              Masukkan informasi detail karya arsitektur, interior, atau furniture bespoke baru.
            </p>

            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                  Judul Ruang / Produk *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: The Penthouse Suite"
                  className="w-full px-3 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                    Kategori *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg text-sm"
                  >
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Bespoke Furniture">Bespoke Furniture</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                    Harga (Rupiah) *
                  </label>
                  <input
                    type="number"
                    required
                    step="1000000"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="450000000"
                    className="w-full px-3 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                  Sub-Judul (e.g. Residential / Smart Integration)
                </label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="Residential / Smart Integration"
                  className="w-full px-3 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                  URL Foto Gambar (Link Image)
                </label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Deskripsi konsep interior atau spesifikasi bahan..."
                  className="w-full px-3 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg text-sm resize-none"
                />
              </div>

              <div>
                <label className="block font-mono text-[11px] uppercase text-[#747878] mb-1">
                  Fitur Utama (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={newFeatures}
                  onChange={(e) => setNewFeatures(e.target.value)}
                  placeholder="Smart Lighting, Solid Walnut, Italian Leather"
                  className="w-full px-3 py-2 bg-[#faf9f7] border border-[#c4c7c7] rounded-lg text-sm"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-[#c4c7c7] font-mono text-xs uppercase hover:bg-[#efeeec]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#171818] text-white py-3 rounded-xl font-mono text-xs uppercase hover:bg-[#2c2c2c] shadow-md"
                >
                  Tambahkan ke Katalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
