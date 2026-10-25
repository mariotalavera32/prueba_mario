import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createApp } from '../src/api/app';

// Servidor aislado para Playwright: API real + Mongo temporal, sin tocar la base local
async function main() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  const port = Number(process.env.PORT) || 3100;
  createApp().listen(port, () => console.log(`API de pruebas en http://localhost:${port}`));

  const stop = async () => {
    await mongoose.disconnect();
    await mongod.stop();
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

main();
