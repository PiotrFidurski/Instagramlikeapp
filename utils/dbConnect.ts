import { Db, MongoClient } from "mongodb";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

type MongoConnection = {
  client: MongoClient;
  db: Db;
};

// declare global {
//   namespace NodeJS {
//     interface Global {
//       mongoose: {
//         connection: MongoConnection | null;
//         promise: Promise<MongoConnection> | null;
//       };
//     }
//   }
// }

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI env variable inside .env.local");
}

let cached = (global as any).mongoose as any;
if (!cached)
  cached = (global as any).mongoose = { connection: null, promise: null };

async function dbConnect() {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      bufferMaxEntries: 0,
      useFindAndModify: false,
      useCreateIndex: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, options).then((mongoose) => {
      return mongoose;
    }) as Promise<MongoConnection>;
    cached.connection = await cached.promise;
    return cached.connection;
  }
}

export default dbConnect;
