const goodmusic = require("goodmusic");
const express = require("express");
const cors = require("cors");

const app = goodmusic({
  db: { uri: process.env.uri || require("./config.js").uri, database: "songsdb" }
})

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use('/', require('./routes/songs'));

app.listen(8080, () => {
  console.log(`Server is running on port ${8080}`);
});
