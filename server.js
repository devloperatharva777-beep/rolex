/**
 * CHRONO PRESTIGE — Backend Server
 * Express.js + In-memory data store
 * Run: node server.js
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARE ====================
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Simple request logger
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ==================== IN-MEMORY DATA ====================
const users = [
  { id: 1, name: 'Atharva', email: 'demo@chronoprestige.com', password: 'demo123' }
];

const products = [
  { id: 1, name: 'Perpetual Noir', category: 'perpetual', price: 42500, ref: 'CP-2025-PN-001', badge: 'New' },
  { id: 2, name: 'Soleil Blanc', category: 'classic', price: 28900, ref: 'CP-2025-SB-002', badge: 'Classic' },
  { id: 3, name: 'GMT Meridian', category: 'sport', price: 35200, ref: 'CP-2025-GM-003', badge: 'Sport' },
  { id: 4, name: 'Aurum Regis', category: 'classic', price: 58000, ref: 'CP-2025-AR-004', badge: 'Prestige' },
  { id: 5, name: 'Submariner Profond', category: 'sport', price: 22400, ref: 'CP-2025-SP-005', badge: 'Diver' },
  { id: 6, name: 'Chronographe Elite', category: 'perpetual', price: 47800, ref: 'CP-2025-CE-006', badge: 'Limited' }
];

const carts = [];   // { userId, items, updatedAt }
const orders = [];  // { id, userId, items, total, status, createdAt }

// ==================== API ROUTES ====================

// GET /api/products — all or filtered
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  const result = category ? products.filter(p => p.category === category) : products;
  res.json({ success: true, count: result.length, products: result });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, product });
});

// POST /api/login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, message: 'Login successful' });
});

// POST /api/signup
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
  }

  const existing = users.find(u => u.email === email);
  if (existing) {
    return res.status(409).json({ success: false, message: 'Account already exists' });
  }

  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ success: true, user: safeUser, message: 'Account created' });
});

// POST /api/cart — save or update cart
app.post('/api/cart', (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items) {
    return res.status(400).json({ success: false, message: 'userId and items required' });
  }

  const existing = carts.find(c => c.userId === userId);
  if (existing) {
    existing.items = items;
    existing.updatedAt = new Date().toISOString();
  } else {
    carts.push({ userId, items, updatedAt: new Date().toISOString() });
  }

  res.json({ success: true, message: 'Cart saved' });
});

// GET /api/cart/:userId
app.get('/api/cart/:userId', (req, res) => {
  const cart = carts.find(c => c.userId === req.params.userId);
  res.json({ success: true, cart: cart || { userId: req.params.userId, items: [] } });
});

// POST /api/orders — place an order
app.post('/api/orders', (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || !items.length) {
    return res.status(400).json({ success: false, message: 'userId and items required' });
  }

  const total = items.reduce((sum, item) => sum + (item.priceNum || 0) * (item.qty || 1), 0);
  const order = {
    id: `CP-ORD-${Date.now()}`,
    userId,
    items,
    total,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };

  orders.push(order);
  console.log(`Order placed: ${order.id} — $${total.toLocaleString()} by ${userId}`);

  res.status(201).json({ success: true, order });
});

// GET /api/orders/:userId
app.get('/api/orders/:userId', (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.params.userId);
  res.json({ success: true, orders: userOrders });
});

// ==================== CATCH-ALL ====================
// Serve frontend for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== START ====================
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║      CHRONO PRESTIGE SERVER          ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║  Running at  http://localhost:${PORT}   ║`);
  console.log('║  Demo login: demo@chronoprestige.com ║');
  console.log('║  Password:   demo123                 ║');
  console.log('╚══════════════════════════════════════╝\n');
});