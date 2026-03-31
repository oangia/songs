const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('@oangia/services/db/MongoDBService');
const app = express();

db.init(process.env.uri).database("songsdb");
// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const songsRoutes = require('./routes/songs');
app.use('/', songsRoutes);

app.listen(8080, () => {
  console.log(`Server is running on port ${8080}`);
});