import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/users.js';
import commentRoutes from './routes/comments.js';
import videoRoutes from './routes/videos.js';

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

// Auf /api/users sitzt userRoutes
// userRoutes antworten nur auf '/test'
app.use('/api/users', userRoutes);

app.use('/api/comments', commentRoutes);

app.use('/api/videos', videoRoutes);

// Listen to this Port and call this function
app.listen(8800, () => {
  connect();
  console.log('Connected to Server!');
});
