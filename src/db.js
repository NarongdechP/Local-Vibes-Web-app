import pkg from "pg";
const {Pool} = pkg;

const pool = new Pool({
    user: "postgres",
    password: "123456789",
    host: "localhost",
    port: 5432,
    database: "local_vibes"
});

export {pool};