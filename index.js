require("dotenv").config();
const express = require("express");
const app = express();
const routes = require('./routes/index');
const connectDB = require("./databaseConnection");
const cors = require("cors");
connectDB();
app.use(express.json());
app.use(cors({origin: "*"}));
app.use("/api",routes);
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
app.listen(3000, () =>{
    console.log("Server is running on port 3000")
});