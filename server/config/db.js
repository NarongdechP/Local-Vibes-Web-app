//import pkg from "pg";
//const {Pool} = pkg;

//const pool = new Pool({
    //user: "postgres",
    //password: "123456789",
    //host: "localhost",
    //port: 5432,
    //database: "local_vibes"
//});

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`🔴 Error connecting to MongoDB: ${err.message}`);
        process.exit(1); // ออกจากโปรเซสหากเชื่อมต่อไม่ได้
    }
};

export default connectDB;
