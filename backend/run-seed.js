require("dotenv").config();
const mongoose = require("mongoose");
const seedDB = require("./seed");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected. Forcing re-seed for new YouTube ID...");
    await seedDB();
    console.log("Seeding complete. Exiting...");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
