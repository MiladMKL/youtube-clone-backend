import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';
import videoRoutes from './routes/videos.js';
import authRoutes from './routes/auths.js';
import cookieParser from 'cookie-parser';

const app = express();

// To use dotenv
dotenv.config();

const connect = () => {
  mongoose.set('strictQuery', false);
  mongoose
    .connect(process.env.MONGO)
    .then(() => {
      console.log('Connected to DB');
    })
    .catch((err) => {
      throw err;
    });
};

app.use(cookieParser());

// Damit express json verarbeiten kann!
app.use(express.json());

app.use('/api/auths', authRoutes);

// Auf /api/users sitzt userRoutes - userRoutes antworten nur auf '/test'
app.use('/api/users', userRoutes);

app.use('/api/comments', commentRoutes);

app.use('/api/videos', videoRoutes);

// Middleware for error
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  return res.status(status).json({
    success: false,
    status: status,
    message: message,
  });
});

// Listen to this Port and call this function
app.listen(8800, () => {
  connect();
  console.log('Connected to Server!');
});
