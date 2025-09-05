import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { 
        conn: null, 
        promise: null,
    }
}

export const connectDB = async () => {
    if (cached.conn) return cached.conn;
    
    if (!cached.promise) {
        const opts = {
            dbName: "Product-Ecommerce",
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        };
        
        cached.promise = mongoose.connect(MONGODB_URL, opts)
            .catch(error => {
                console.error('MongoDB connection error:', error);
                cached.promise = null;
                throw error;
            });
    }

    try {
        cached.conn = await cached.promise;
        console.log('MongoDB connected successfully');
        return cached.conn;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
}
