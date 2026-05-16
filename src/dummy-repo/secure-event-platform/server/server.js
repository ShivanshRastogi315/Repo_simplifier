const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});