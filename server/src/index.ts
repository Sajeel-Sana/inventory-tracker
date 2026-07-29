// server/src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './db';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Essential: Parses JSON request bodies coming from client

// 1. CREATE an Item (POST)
app.post('/api/items', async (req: Request, res: Response) => {
  try {
    const { name, quantity, price } = req.body;

    // Basic validation
    if (!name || price == null) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }

    const newItem = await prisma.item.create({
      data: {
        name,
        quantity: quantity ? Number(quantity) : 0,
        price: Number(price),
      },
    });

    return res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to create item.' });
  }
});

// 2. GET ALL Items (GET)
app.get('/api/items', async (req: Request, res: Response) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' }, // Newest items first
    });

    return res.json(items);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch items.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});