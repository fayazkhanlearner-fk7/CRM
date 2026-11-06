require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/UserRoutes");
const customerRoutes = require("./routes/CustomerRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("Missing MONGO_URI or JWT_SECRET. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ success: true, message: "CRM API is running" }));
app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
