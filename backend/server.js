require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: "http://macollectionjv.duckdns.org",
    credentials: true,
  })
);
app.use(bodyParser.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
const games = require("./routes/games");

app.use("/api/games", games);

app.get("/proxy", async (req, res) => {
  const name = req.query.name;
  const apiKey =
    "e2632452c70b87623a7abd8f06273b80f723db6158242bebb380284efa6a251c"; // Ideally, use process.env for keys
  const platform = req.query.platform;
  const url = `https://api.thegamesdb.net/v1/Games/ByGameName?apikey=${apiKey}&name=${name}&filter%5Bplatform%5D=${platform}`;
  console.log("l'url :", url);
  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (err) {
    console.error("Error in /proxy route:", err.message);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
