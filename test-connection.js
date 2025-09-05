const mongoose = require('mongoose');

async function testConnection() {
    console.log('Testing MongoDB connection...');
    const MONGODB_URI = "mongodb+srv://Aditya7400:Aditya7400@cluster0.khp8tz1.mongodb.net/Product-Ecommerce?retryWrites=true&w=majority&appName=Cluster0";
    
    console.log('Connection string:', MONGODB_URI);
    
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "Product-Ecommerce",
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB connection successful!');
        
        // Test basic operations
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));
        
        await mongoose.disconnect();
        console.log('✅ Connection closed successfully');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', error);
    }
}

testConnection();
