const express = require('express');
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const db = require('@oangia/services/db/v1.0.0/MongoDBService');
const app = express();
const PORT = process.env.PORT || 3000;

db.init("mongodb+srv://hqnhatdn:abc123$$@cluster0.wnkrqan.mongodb.net/songsdb?retryWrites=true&w=majority").database("songsdb");
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});