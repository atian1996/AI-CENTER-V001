import fs from 'fs';

const meta = JSON.parse(fs.readFileSync('/tmp/original_posts_meta.json', 'utf8'));

// Helper to check and guarantee 560 <= length <= 1150
function validateLength(id, text) {
  const len = text.length;
  if (len < 560 || len > 1150) {
    console.error(`Post ${id} length ${len} out of bounds [560, 1150]`);
    process.exit(1);
  }
}

console.log('Read', meta.length, 'post metas');
