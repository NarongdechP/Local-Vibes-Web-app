//import pkg from "pg";
//const {Pool} = pkg;

//const pool = new Pool({
    //user: "postgres",
    //password: "123456789",
    //host: "localhost",
    //port: 5432,
    //database: "local_vibes"
//});

//export {pool};
import pg from "pg";
import * as dotenv from "dotenv";

dotenv.config();

export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
