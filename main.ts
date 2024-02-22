import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './route/user';
import Chat from "./route/chat";

const app = express();
const port = 3000;

app.use(express.json());
app.use('/user', userRoutes);
app.use('/message', Chat);

mongoose.connect('mongodb://127.0.0.1:27017/trialshopyDatabase')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB', error);
  });