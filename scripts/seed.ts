import mongoose from 'mongoose';
import { Task } from '../src/api/task.model';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/qa-demo';

async function main() {
  await mongoose.connect(uri);
  await Task.deleteMany({});
  await Task.insertMany([
    { title: 'Aprender Playwright', completed: true },
    { title: 'Escribir pruebas de API' },
    { title: 'Revisar la base en Compass' },
  ]);
  console.log('Datos de ejemplo cargados en', uri);
  await mongoose.disconnect();
}

main();
