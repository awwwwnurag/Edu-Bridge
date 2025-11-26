import express from 'express';
import Video from '../models/Video.js';

const router = express.Router();

// GET all videos with optional filtering
router.get('/', async (req, res) => {
  try {
    const { subject, grade, language, search } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (subject) filter.subject = subject;
    if (grade) filter.grade = parseInt(grade);
    if (language) filter.language = language;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    // Increment view count
    video.views += 1;
    await video.save();
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// POST new video (admin functionality)
router.post('/', async (req, res) => {
  try {
    const videoData = req.body;
    const video = new Video(videoData);
    await video.save();
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create video' });
  }
});

// PUT update video (admin functionality)
router.put('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update video' });
  }
});

// DELETE video (admin functionality)
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

// GET videos by grade and subject
router.get('/grade/:grade/subject/:subject', async (req, res) => {
  try {
    const { grade, subject } = req.params;
    const { language } = req.query;
    
    const filter = {
      grade: parseInt(grade),
      subject,
      isActive: true
    };
    
    if (language) filter.language = language;
    
    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET videos by subject only
router.get('/subject/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const { grade, language } = req.query;
    
    const filter = {
      subject,
      isActive: true
    };
    
    if (grade) filter.grade = parseInt(grade);
    if (language) filter.language = language;
    
    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET videos by grade only
router.get('/grade/:grade', async (req, res) => {
  try {
    const { grade } = req.params;
    const { subject, language } = req.query;
    
    const filter = {
      grade: parseInt(grade),
      isActive: true
    };
    
    if (subject) filter.subject = subject;
    if (language) filter.language = language;
    
    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

export default router;