const db = require('@oangia/services/db/v1.0.0/MongoDBService');

// Vietnamese to English transliteration mapping
const vietnameseToEnglish = {
  'à': 'a', 'á': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
  'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
  'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
  'đ': 'd',
  'è': 'e', 'é': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
  'ê': 'e', 'ề': 'e', 'ế': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
  'ì': 'i', 'í': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
  'ò': 'o', 'ó': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
  'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
  'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
  'ù': 'u', 'ú': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
  'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
  'ỳ': 'y', 'ý': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
  'À': 'A', 'Á': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
  'Ă': 'A', 'Ằ': 'A', 'Ắ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
  'Â': 'A', 'Ầ': 'A', 'Ấ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
  'Đ': 'D',
  'È': 'E', 'É': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
  'Ê': 'E', 'Ề': 'E', 'Ế': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
  'Ì': 'I', 'Í': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
  'Ò': 'O', 'Ó': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
  'Ô': 'O', 'Ồ': 'O', 'Ố': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
  'Ơ': 'O', 'Ờ': 'O', 'Ớ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
  'Ù': 'U', 'Ú': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
  'Ư': 'U', 'Ừ': 'U', 'Ứ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
  'Ỳ': 'Y', 'Ý': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y'
};

// Helper function to transliterate Vietnamese to English
const transliterateVietnamese = (text) => {
  return text.split('').map(char => vietnameseToEnglish[char] || char).join('');
};

// Helper function to generate slug
const generateSlug = (text) => {
  return transliterateVietnamese(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

exports.getHome = async (req, res) => {
  try {
    let songs = await db.all("songs");
    
    // Add performerSlug to each song
    songs = songs.map(song => ({
      ...song,
      performerSlug: generateSlug(song.performer)
    }));

    res.render('home', { 
      songs,
      pageTitle: 'mohopam – Hợp âm bài hát',
      pageDescription: 'Tìm kiếm và xem lời bài hát, hợp âm nhanh chóng. mohopam cập nhật bộ sưu tập bài hát tiếng Việt và quốc tế.',
      pageKeywords: 'mohopam, lời bài hát, hợp âm, tìm bài hát, tiếng Việt',
      canonical: 'https://your-domain.com/',
      ogType: 'website',
      ogTitle: 'mohopam – Hợp âm bài hát',
      ogDescription: 'Tìm kiếm và xem lời bài hát, hợp âm nhanh chóng.',
      ogUrl: 'https://your-domain.com/'
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Lỗi máy chủ' });
  }
};

exports.getSongDetail = async (req, res) => {
  try {
    const { performerSlug, songSlug } = req.params;
    const song = await db.find("songs", { slug: songSlug });
    if (!song) {
      return res.status(404).render('error', { message: 'Không tìm thấy bài hát' });
    }
    
    const searchQuery = req.query.q || '';
    res.render('songDetail', { 
      song, 
      searchQuery,
      pageTitle: `${song.title} Hợp âm - mohopam`,
      pageDescription: `${song.title} bởi ${song.performer} - xem lời bài hát và hợp âm. mohopam hỗ trợ tìm kiếm nhanh tên bài hát, nghệ sĩ.`,
      canonical: `https://your-domain.com/${performerSlug}/${song.slug}`,
      ogType: 'article',
      ogTitle: `${song.title} - mohopam`,
      ogDescription: `${song.title} bởi ${song.performer} - xem lời bài hát và hợp âm.`,
      ogUrl: `https://your-domain.com/${performerSlug}/${song.slug}`,
      schema: {
        "@context": "https://schema.org",
        "@type": "MusicComposition",
        "name": song.title,
        "byArtist": song.performer,
        "description": song.genre || 'Lời bài hát và hợp âm',
        "url": `https://your-domain.com/${performerSlug}/${song.slug}`
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Lỗi máy chủ' });
  }
};

exports.createSong = async (req, res) => {
  try {
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { message: 'Lỗi khi tạo bài hát' });
  }
};

exports.getEarTraining = (req, res) => {
  res.render('eartraining', { layout: false });
};
