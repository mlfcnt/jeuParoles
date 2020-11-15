const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv").config();
const path = require("path");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "./client/build")));

app.post("/api/get-lyrics", async (req, res) => {
  try {
    const { artist: artistToCheck, track: trackToCheck } = req.body;
    if (!artistToCheck || !trackToCheck)
      throw new Error("Missing artist or track");
    const resp = await fetch(
      `https://orion.apiseeds.com/api/music/lyric/${artistToCheck}/${trackToCheck}?apikey=${process.env.API_KEY}`
    );
    const { error, result } = await resp.json();
    if (error) {
      const formattedError = error.startsWith("Lyric no found")
        ? "Paroles non trouvées pour cette chanson. Cette api est un peu pourrie"
        : error;
      return res.status(500).send({ success: false, error: formattedError });
    }
    const { artist, track } = result;
    return res.status(200).send({ success: true, artist, track });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, error: error.message || error });
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Connecté sur le port ${port}`);
});
