import dotenv from 'dotenv';
import express from 'express';
import { MongoClient, ServerApiVersion } from 'mongodb';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB!');
  } catch (error) {
    console.error('❌ MongoDB Error:', error);
  }
}
run().catch(console.dir);

// API route
app.get('/api', async (req, res) => {
  try {
    const data = await client
      .db('MPDLufthansa')
      .collection('MPDLufthansa')
      .find()
      .toArray();
    console.log('Data being sent:', data);
    res.json({ message: 'Server is running 🚀', data });
  } catch (error) {
    res.status(500).json({ message: 'MongoDB error', error: error.message });
  }
});

// Serve Vite frontend
app.use(express.static(join(__dirname, '../client/dist')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/api`);
});
