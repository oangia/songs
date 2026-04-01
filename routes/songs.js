const express = require('express');
const router = express.Router();
const db = require('goodmusic/db/MongoDBService');
const { slugify, vnlize } = require('goodmusic/utils/string');

// Home
router.get('/', async (req, res) => {
  try {
    let songs = await db.all("songs");

    songs = songs.map(song => ({
      ...song,
      performerSlug: slugify(vnlize(song.performer))
    }));

    res.render('home', {
      songs,
      pageTitle: 'mohopam – Hợp âm bài hát',
      pageDescription: 'Tìm kiếm và xem lời bài hát, hợp âm nhanh chóng.',
      pageKeywords: 'mohopam, lời bài hát, hợp âm',
      canonical: 'https://mohopam.com/',
      ogType: 'website',
      ogTitle: 'mohopam – Hợp âm bài hát',
      ogDescription: 'Tìm kiếm và xem lời bài hát, hợp âm nhanh chóng.',
      ogUrl: 'https://mohopam.com/'
    });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', { message: 'Lỗi máy chủ' });
  }
});

const renderChords = (text) => {
  return text.split('\n').map(line => {
    if (!line.trim()) return '<p><br/></p>';

    let chordLine = '';
    let lyricLine = '';
    let cursor = 0;

    const regex = /\[([^\]]+)\]|([^\[]+)/g;
    let match;

    while ((match = regex.exec(line))) {
      if (match[1]) {
        const chord = `[${match[1]}]`;

        // fill spaces to current cursor
        while (chordLine.length < cursor) chordLine += ' ';

        chordLine += chord;
      } else {
        const textPart = match[2];
        lyricLine += textPart;
        cursor += textPart.length;
      }
    }

    return `
      <p class="font-mono leading-tight">
        <span class="block text-red-500 text-sm">${chordLine}</span>
        <span class="block">${lyricLine}</span>
      </p>
    `;
  }).join('');
};

// Song detail
router.get('/:artistSlug/:songSlug', async (req, res) => {
  try {
    const { artistSlug, songSlug } = req.params;
    const song = await db.find("songs", { slug: songSlug });

    if (!song) {
      return res.status(404).render('error', { message: 'Không tìm thấy bài hát' });
    }
    song.chords = renderChords(song.chords);
    const searchQuery = req.query.q || '';

    res.render('songDetail', {
      song,
      searchQuery,
      pageTitle: `${song.title} Hợp âm - mohopam`,
      pageDescription: `${song.title} bởi ${song.performer}`,
      canonical: `https://mohopam.com/${artistSlug}/${song.slug}`,
      ogType: 'article',
      ogTitle: `${song.title} - mohopam`,
      ogDescription: `${song.title} bởi ${song.performer}`,
      ogUrl: `https://mohopam.com/${artistSlug}/${song.slug}`,
      schema: {
        "@context": "https://schema.org",
        "@type": "MusicComposition",
        name: song.title,
        byArtist: song.performer,
        description: song.genre || 'Lời bài hát và hợp âm',
        url: `https://mohopam.com/${artistSlug}/${song.slug}`
      }
    });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', { message: 'Lỗi máy chủ' });
  }
});

// Ear training
router.get('/ear-training', (req, res) => {
  res.render('eartraining', { layout: false });
});

module.exports = router;