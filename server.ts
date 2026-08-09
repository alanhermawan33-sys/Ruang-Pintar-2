import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { Product, Order } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data storage backed by a local JSON file for persistence
const DATA_FILE = path.join(process.cwd(), 'data_store.json');

const INITIAL_PROJECTS: Product[] = [
  {
    id: 'proj-1',
    title: 'The Glasshouse',
    category: 'Residential',
    subtitle: 'Residential / Smart Integration',
    price: 850000000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-nhvYOWBP8W4d6JQ6ibwE57ECLoPdUFEhcfN1aRRVvyu8bBEC5PV8KEZ7Ot-Vv6v6DqENviG2gc8xmc2YY9XbgSDIFfmTgVdkZ_eOauK-SaRvyGL70n_sN34xfhMfC-1ImtmmNLtSvUK3nt6v_DkQKpeRu8Z5P3Tppl69j8XmO0avpk2ZVLBMlg8ojiqBySIVxvJjo5IT8h_gWBzfVCqd7Jh2w8W6zWJrq-lvs_ymQ_OcXtRJXDIm',
    description: 'A modern kitchen interior showing sleek, handle-less charcoal cabinetry integrated with warm wood accents. Hidden smart home lighting and climate automation.',
    features: ['Integrated Smart Lighting', 'Handle-less Charcoal Cabinetry', 'Acoustic Wall Panels', 'Hidden Sub-Zero Refrigeration'],
    dimensions: '120 sqm',
    leadTime: '8 - 12 Weeks',
    isCustomizable: true,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'proj-2',
    title: 'Atelier Studio',
    category: 'Commercial',
    subtitle: 'Commercial / Acoustic Design',
    price: 620000000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKWDeVesdG_TnhUdLwKiJThfVU2HaaeRmxDt7aYxrbadO0k57wpbbf8_N4ic5jSTyYy2Bp1BJaURMeg5W-Vk4pzMg-Qdoj85ATkdcdSy2gFg6XxuiPmogOMp3gGBM-XTbpnTSGkFOmspeNY0LDesZdF6zI1bheEoTxEOrfbTsX66Bnhp-sHLgdKBnZnJGcZTk-zzn_OvI0BlEt6hu22xh5Kzt3p5fEKrpw1mgpiBozCppb6jH1-CSx',
    description: 'A minimalist executive office space with expansive city views. The focal point is a bespoke, sculptural desk made of dark wood and brushed metal with integrated wireless charging.',
    features: ['Sculptural Executive Desk', 'Noise Dampening Panels', 'Panoramic Glass Integration', 'Ambient Task Lighting'],
    dimensions: '85 sqm',
    leadTime: '6 - 10 Weeks',
    isCustomizable: true,
    createdAt: new Date(Date.now() - 86400000 * 8).toISOString(),
  },
  {
    id: 'proj-3',
    title: 'Villa Serene',
    category: 'Hospitality',
    subtitle: 'Hospitality / Heritage Modern',
    price: 1250000000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA8HKbakMQm4wp7goGQ5PJaDg9IiGXpvsgB7yjiVXzF0VfpWK7qwwscd9zoisOgPuXaPi793TCMf1IVD8LS6T1zMAtXBOZMagcpbwMmGyQR0xyh6pj6ly8bD2x6swUX4lhhHvxa-Ddg27TlPX8lEgbobPsTlyrkH0AZwSBBRQhz6dEFb1zEXrcjBr5JS1mJ7XzejyYMF3Nrfg0KhtJDtTjoL7sa_Fwa1-mLlgVkXrJfRFNJ2UnXe6Ds',
    description: 'A serene, minimalist bedroom suit design. Low platform bed with integrated subtle floor lighting and textured champagne walls with smart circadian rhythm management.',
    features: ['Circadian Lighting System', 'Floating Low Oak Bedframe', 'Textured Champagne Plaster Walls', 'Motorized Sheer Blinds'],
    dimensions: '150 sqm',
    leadTime: '10 - 14 Weeks',
    isCustomizable: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 'proj-4',
    title: 'Natura Lounge Suite',
    category: 'Bespoke Furniture',
    subtitle: 'Living Space / Tactile Luxury',
    price: 245000000,
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    description: 'Custom modular lounge set with organic bouclé upholstery, brushed brass structural feet, and built-in tactile side tables.',
    features: ['High-resilience Organic Foam', 'Italian Bouclé Fabric', 'Brushed Brass Accents'],
    dimensions: '340 x 210 cm',
    leadTime: '4 - 6 Weeks',
    isCustomizable: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: 'proj-5',
    title: 'Monolith Dining Table',
    category: 'Bespoke Furniture',
    subtitle: 'Dining / Solid Walnut & Travertine',
    price: 185000000,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Hand-sculpted solid Indonesian walnut table with honed beige travertine pedestal bases, seating up to 10 guests.',
    features: ['FSC-Certified Solid Walnut', 'Natural Travertine Base', 'Stain-Resistant Matte Finish'],
    dimensions: '280 x 110 x 75 cm',
    leadTime: '5 - 7 Weeks',
    isCustomizable: true,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'RP-2026-0808-001',
    customerName: 'Bapak Hendra Wijaya',
    customerEmail: 'hendra.w@artagroup.co.id',
    customerPhone: '+62 811-9876-5432',
    projectAddress: 'Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan',
    items: [
      {
        productId: 'proj-1',
        title: 'The Glasshouse',
        price: 850000000,
        quantity: 1,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-nhvYOWBP8W4d6JQ6ibwE57ECLoPdUFEhcfN1aRRVvyu8bBEC5PV8KEZ7Ot-Vv6v6DqENviG2gc8xmc2YY9XbgSDIFfmTgVdkZ_eOauK-SaRvyGL70n_sN34xfhMfC-1ImtmmNLtSvUK3nt6v_DkQKpeRu8Z5P3Tppl69j8XmO0avpk2ZVLBMlg8ojiqBySIVxvJjo5IT8h_gWBzfVCqd7Jh2w8W6zWJrq-lvs_ymQ_OcXtRJXDIm'
      }
    ],
    totalAmount: 850000000,
    notes: 'Mohon dijadwalkan konsultasi awal lokasi pada hari Sabtu pukul 10:00 WIB.',
    status: 'In Consultation',
    createdAt: new Date(Date.now() - 3600000 * 14).toISOString(),
  },
  {
    id: 'ord-102',
    orderNumber: 'RP-2026-0808-002',
    customerName: 'Ibu Sarah Amalia',
    customerEmail: 'sarah.amalia@designhouse.id',
    customerPhone: '+62 812-3456-7890',
    projectAddress: 'Menteng Residence Tower A Lt. 18, Jakarta Pusat',
    items: [
      {
        productId: 'proj-4',
        title: 'Natura Lounge Suite',
        price: 245000000,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
      }
    ],
    totalAmount: 245000000,
    notes: 'Minta kain upholstery warna Warm Sand (Custom Code: WS-04).',
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  }
];

let projects: Product[] = [...INITIAL_PROJECTS];
let orders: Order[] = [...INITIAL_ORDERS];

// Load persisted data if file exists
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.projects)) projects = parsed.projects;
      if (Array.isArray(parsed.orders)) orders = parsed.orders;
    }
  } catch (err) {
    console.error('Error loading data store file, using defaults:', err);
  }
}

function saveData() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ projects, orders }, null, 2));
  } catch (err) {
    console.error('Error saving data store file:', err);
  }
}

loadData();

// SSE Clients array for broadcasting live orders
type SSEClient = express.Response;
let sseClients: SSEClient[] = [];

function broadcastOrder(newOrder: Order) {
  sseClients.forEach(client => {
    client.write(`data: ${JSON.stringify({ type: 'NEW_ORDER', order: newOrder })}\n\n`);
  });
}

// REST API ROUTES
// Projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/projects', (req, res) => {
  const { title, category, subtitle, price, imageUrl, description, features, dimensions, leadTime } = req.body;
  
  if (!title || price === undefined) {
    return res.status(400).json({ error: 'Title and Price are required.' });
  }

  const newProject: Product = {
    id: 'proj-' + Date.now(),
    title,
    category: category || 'Bespoke',
    subtitle: subtitle || `${category || 'Bespoke'} / Smart Design`,
    price: Number(price),
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: description || 'Visual detail curated by RUANG PINTAR architecture studio.',
    features: Array.isArray(features) ? features : (features ? features.split(',').map((f: string) => f.trim()) : ['Craftsmanship Precision']),
    dimensions: dimensions || 'Bespoke Size',
    leadTime: leadTime || '6 - 8 Weeks',
    isCustomizable: true,
    createdAt: new Date().toISOString(),
  };

  projects.unshift(newProject);
  saveData();
  res.status(201).json(newProject);
});

app.put('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const existing = projects[index];
  const updated: Product = {
    ...existing,
    title: req.body.title !== undefined ? req.body.title : existing.title,
    category: req.body.category !== undefined ? req.body.category : existing.category,
    subtitle: req.body.subtitle !== undefined ? req.body.subtitle : existing.subtitle,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    imageUrl: req.body.imageUrl !== undefined ? req.body.imageUrl : existing.imageUrl,
    description: req.body.description !== undefined ? req.body.description : existing.description,
    features: req.body.features !== undefined ? req.body.features : existing.features,
    dimensions: req.body.dimensions !== undefined ? req.body.dimensions : existing.dimensions,
    leadTime: req.body.leadTime !== undefined ? req.body.leadTime : existing.leadTime,
  };

  projects[index] = updated;
  saveData();
  res.json(updated);
});

app.delete('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  projects = projects.filter(p => p.id !== id);
  saveData();
  res.json({ success: true, id });
});

// Orders
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, customerPhone, projectAddress, items, notes, totalAmount } = req.body;

  if (!customerName || !customerEmail || !items || items.length === 0) {
    return res.status(400).json({ error: 'Customer information and order items are required.' });
  }

  const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const orderNum = `RP-${dateCode}-${Math.floor(100 + Math.random() * 900)}`;

  const newOrder: Order = {
    id: 'ord-' + Date.now(),
    orderNumber: orderNum,
    customerName,
    customerEmail,
    customerPhone: customerPhone || '-',
    projectAddress: projectAddress || 'Jakarta & Outstation Services',
    items,
    totalAmount: totalAmount || items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0),
    notes: notes || '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  orders.unshift(newOrder);
  saveData();
  
  // Real-time broadcast to admin listeners
  broadcastOrder(newOrder);

  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[index].status = status;
  saveData();
  
  // Broadcast update to SSE
  sseClients.forEach(client => {
    client.write(`data: ${JSON.stringify({ type: 'ORDER_UPDATED', order: orders[index] })}\n\n`);
  });

  res.json(orders[index]);
});

// Real-time SSE Stream for Admin Panel
app.get('/api/orders/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE stream connected for real-time order tracking' })}\n\n`);

  sseClients.push(res);

  req.on('close', () => {
    sseClients = sseClients.filter(client => client !== res);
  });
});

// Sample order seeder endpoint for testing real-time notifications
app.post('/api/orders/seed-sample', (req, res) => {
  const sampleNames = ['Dra. Maya Indah', 'Bapak Reza Pratama', 'Ibu Clarissa S.', 'Ir. Budi Santoso'];
  const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const sampleProject = projects[Math.floor(Math.random() * projects.length)];

  const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const orderNum = `RP-${dateCode}-${Math.floor(100 + Math.random() * 900)}`;

  const sampleOrder: Order = {
    id: 'ord-' + Date.now(),
    orderNumber: orderNum,
    customerName: name,
    customerEmail: name.toLowerCase().replace(/[^a-z]/g, '') + '@gmail.com',
    customerPhone: '+62 813-' + Math.floor(10000000 + Math.random() * 90000000),
    projectAddress: 'Kawasan Permata Hijau, Jakarta Barat',
    items: [
      {
        productId: sampleProject.id,
        title: sampleProject.title,
        price: sampleProject.price,
        quantity: 1,
        imageUrl: sampleProject.imageUrl
      }
    ],
    totalAmount: sampleProject.price,
    notes: 'Pesanan masuk via live test sim. Mohon disiapkan draf estimasi material.',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  orders.unshift(sampleOrder);
  saveData();
  broadcastOrder(sampleOrder);

  res.status(201).json(sampleOrder);
});

// Start Express + Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`RUANG PINTAR Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
