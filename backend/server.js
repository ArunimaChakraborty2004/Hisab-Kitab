require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const seedDB = require("./seed");

// connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");
    await seedDB(); // Automatically seed the database if it's empty
  })
  .catch(err => console.error("DB Error:", err));

// routes
app.use("/api/transactions", require("./routes/transactions"));

app.listen(process.env.PORT, () =>
  console.log("Backend running on port", process.env.PORT)
);

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// mount kyc route
app.use('/api/kyc', require('./routes/kyc'));

app.use('/api/education', require('./routes/education'));
app.use('/api/schemes', require('./routes/schemes'));
app.use('/api/savings-plans', require('./routes/savings'));
app.use('/api/quiz', require('./routes/quiz'));
