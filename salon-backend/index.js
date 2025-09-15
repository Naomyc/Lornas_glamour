require("dotenv").config();

const express = require("express");
const cors = require("cors"); //for connecting to frontend
const mongoose = require("mongoose");
const servicesRoutes = require("./routes/services");
const bookingsRoutes = require("./routes/bookings");
const staffRoutes= require("./routes/staff");
const inventoryRoutes=require("./routes/inventory");
const categoryRoutes = require('./routes/category');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB URI
const uri = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

// Connect to MongoDB with Mongoose
mongoose.connect(uri,{
  useNewUrlParser: true,      
  useUnifiedTopology: true  
})
  .then(() => {
    console.log("Connected to MongoDB Atlas via Mongoose!");

    app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
  });

  mongoose.connection.on("connected", () => {
  console.log("🔌 Mongoose connected");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("🔌 Mongoose disconnected");
});


app.get("/", (req, res) => {
  res.send("Welcome to the salon backend! MongoDB is connected.");
});

//use routes
app.use("/services", servicesRoutes);
app.use("/bookings",bookingsRoutes);
app.use("/staff",staffRoutes);
app.use("/inventory",inventoryRoutes);
app.use('/api/categories', categoryRoutes);

