const db = require('./db');

const images = [
  { id: 1, type: "upper", src: "/Upperwear/top1.webp" },
  { id: 2, type: "upper", src: "/Upperwear/top2.webp" },
  { id: 3, type: "upper", src: "/Upperwear/top3.webp" },
  { id: 4, type: "lower", src: "/lower/b4.jpg" },
  { id: 5, type: "lower", src: "/lower/b3.webp" },
  { id: 6, type: "lower", src: "/lower/b2.webp" },
  { id: 7, type: "accessories", src: "/Upperwear/acc5.jpg" },
  { id: 8, type: "accessories", src: "/Upperwear/acc6.jpg" },
  { id: 9, type: "accessories", src: "/Upperwear/acc7.jpg" },
  { id: 10, type: "footwear", src: "/Upperwear/img8.jpeg" },
  { id: 11, type: "footwear", src: "/Upperwear/f4.jpeg" },
  { id: 12, type: "footwear", src: "/Upperwear/f5.jpeg" }
];

const categoryMap = {
  upper: 'upperwear',
  lower: 'lowerwear',
  accessories: 'accessories',
  footwear: 'footwear'
};

async function insertImages() {
  try {
    for (const image of images) {
      const category = categoryMap[image.type];
      const sql = 'INSERT INTO cute (category, image_url) VALUES (?, ?)';
      await db.query(sql, [category, image.src]);
      console.log(Inserted image ${image.src} with category ${category});
    }
    console.log('All images inserted successfully.');
    await db.end();
  } catch (err) {
    console.error('Error inserting images:', err);
  }
}

insertImages();