import mongoose from 'mongoose';
import { createApp } from './app';

const port = Number(process.env.PORT) || 3000;
const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/qa-demo';

mongoose.connect(uri).then(() => {
  createApp().listen(port, () => console.log(`API en http://localhost:${port}`));
});
