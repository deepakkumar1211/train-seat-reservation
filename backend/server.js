// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();
// const authRoutes = require("./routes/authRoutes");
// const seatRoutes = require("./routes/bookingRoutes");
// const connectDB = require("./db/db");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", authRoutes);
// app.use("/api/seats", seatRoutes);

// connectDB();

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// const bookingRoutes = require("./routes/bookingRoutes");
// app.use("/api/booking", bookingRoutes);



const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const connectDB = require("./db/db");

// const { connectDB } = require("./db/db");


const app = express();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/seats", bookingRoutes); // Use either '/api/seats' or '/api/booking', not both

// Connect to DB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
