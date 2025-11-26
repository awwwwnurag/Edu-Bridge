import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    videoUrl: {
      type: String,
      required: true
    },
    thumbnailUrl: {
      type: String,
      required: true
    },
    duration: {
      type: String, // e.g., "12 min"
      required: true
    },
    subject: {
      type: String,
      required: true,
      enum: ['Mathematics', 'Science', 'Social Studies', 'English', 'Hindi', 'Moral Science', 'Languages', 'General']
    },
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 8
    },
    language: {
      type: String,
      required: true,
      enum: ['English', 'Hindi', 'Tamil', 'Telugu', 'Marathi', 'Bengali', 'Gujarati', 'Kannada']
    },
    views: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);
export default Video;