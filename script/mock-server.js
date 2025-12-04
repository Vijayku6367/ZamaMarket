const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Mock data
const mockListings = [
  {
    id: 1,
    name: "Digital Art NFT",
    description: "Exclusive encrypted digital artwork",
    category: "Art",
    encryptedPrice: "0x3a7d186c8f25591e4b2c8f2d9a1b7c3d8e4f2a6c",
    seller: "0x8f3a186c8f25591e4b2c8f2d9a1b7c3d8e4f2a6c"
  },
  {
    id: 2,
    name: "Premium Domain",
    description: "Crypto domain name (.eth)",
    category: "Domains",
    encryptedPrice: "0x8b4e186c8f25591e4b2c8f2d9a1b7c3d8e4d9a1b",
    seller: "0x3a7d186c8f25591e4b2c8f2d9a1b7c3d8e4f2a6c"
  }
];

const mockBids = [
  {
    id: 1,
    listingId: 1,
    bidder: "0xa1b2c3d4e5f678901234567890abcdef12345678",
    encryptedBid: "0x1234567890abcdef1234567890abcdef12345678",
    timestamp: Date.now() - 3600000
  }
];

// API Routes
app.get('/api/listings', (req, res) => {
  res.json(mockListings);
});

app.get('/api/bids', (req, res) => {
  res.json(mockBids);
});

app.post('/api/encrypt', (req, res) => {
  const { plaintext } = req.body;
  
  // Mock encryption
  const hexValue = Math.floor(plaintext * 1000).toString(16).padStart(64, '0');
  const ciphertext = `0x${hexValue}`;
  
  res.json({ ciphertext });
});

app.post('/api/decrypt', (req, res) => {
  const { ciphertext } = req.body;
  
  // Mock decryption
  if (!ciphertext.startsWith('0x')) {
    return res.status(400).json({ error: 'Invalid ciphertext' });
  }
  
  const hexValue = ciphertext.substring(2, 66);
  const plaintext = parseInt(hexValue, 16) / 1000;
  
  res.json({ plaintext });
});

app.post('/api/submit-bid', (req, res) => {
  const { listingId, encryptedBid } = req.body;
  
  // Mock bid submission
  const newBid = {
    id: mockBids.length + 1,
    listingId,
    bidder: "0x" + Math.random().toString(16).substring(2, 42),
    encryptedBid,
    timestamp: Date.now()
  };
  
  mockBids.push(newBid);
  res.json({ success: true, bidId: newBid.id });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 DarkMarket FHE server running on http://localhost:${PORT}`);
  console.log(`📁 Serving from: ${path.join(__dirname, '../frontend')}`);
});
