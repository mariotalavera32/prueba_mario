import { MongoMemoryServer } from 'mongodb-memory-server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), '.data', 'db');
fs.mkdirSync(dbPath, { recursive: true });

// MongoDB real con datos persistentes en .data/db (a diferencia de las pruebas, que usan memoria)
async function main() {
  const mongod = await MongoMemoryServer.create({
    instance: {
      port: Number(process.env.MONGO_PORT) || 27017,
      dbPath,
      storageEngine: 'wiredTiger',
    },
  });
  console.log(`MongoDB listo en ${mongod.getUri()} (Ctrl+C para detener)`);

  const stop = async () => {
    await mongod.stop({ doCleanup: false });
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

main();
