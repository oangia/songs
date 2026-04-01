const goodmusic = require("goodmusic");

const app = goodmusic({
  db: { uri: process.env.uri || require("./config.js").uri, database: "songsdb" }
})

// Routes
app.use('/', require('./routes/songs'));

app.listen(8080, () => {
  console.log(`Server is running on port ${8080}`);
});