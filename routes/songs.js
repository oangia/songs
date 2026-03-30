const express = require('express');
const router = express.Router();
const songsController = require('../controllers/songsController');

// Home page - search and list songs
router.get('/', songsController.getHome);

// Ear Training page
router.get('/ear-training', songsController.getEarTraining);

// Song detail page by slug
router.get('/:artistSlug/:songSlug', songsController.getSongDetail);

// Create new song (for adding songs)
router.post('/songs', songsController.createSong);

module.exports = router;