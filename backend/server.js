import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import videoRoutes from './routes/videos.js';
import Video from './models/Video.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://2023249113nitya_db_user:OxR4d2aXrXOKJ7It@cluster0.mgkbs25.mongodb.net/?appName=Cluster0';

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Test endpoint to verify video data
app.get('/api/test/videos', async (req, res) => {
  try {
    const Video = (await import('./models/Video.js')).default;
    const videos = await Video.find({ subject: 'Mathematics' }).limit(5);
    res.json({ 
      message: 'Mathematics videos found',
      count: videos.length,
      videos: videos.map(v => ({
        id: v._id,
        title: v.title,
        grade: v.grade,
        duration: v.duration
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`API server running on :${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err.message);
    process.exit(1);
  });
