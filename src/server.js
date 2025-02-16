import express from "express";
const app = express();
const PORT = 3000

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1>Hello, Express!</h1>");
});

app.listen(PORT, () =>{console.log(`Server is running on http://localhost:${PORT}`);
});