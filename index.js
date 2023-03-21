const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { dbConnection } = require("./database/config");

// Express server
const app = express();

// DB
dbConnection();

// Middlewares
app.use(express.json());
// CORS
app.use(cors());

// Public Directory
app.use(express.static("public"));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Listen petitions
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
