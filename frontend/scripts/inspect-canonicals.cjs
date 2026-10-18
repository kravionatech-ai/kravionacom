const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.html')) {
      results.push(file);
    }
  });
  return results;
}

const appServerDir = path.resolve(__dirname, '../.next/server/app');
const htmlFiles = walk(appServerDir);
console.log(`Found ${htmlFiles.length} HTML files.`);
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = [...content.matchAll(/<link[^>]*rel=["']canonical["'][^>]*>/gi)];
  const hrefs = matches.map(m => {
    const hrefMatch = m[0].match(/href=["']([^"']*)["']/i);
    return hrefMatch ? hrefMatch[1] : 'unknown';
  });
  const relPath = path.relative(appServerDir, f).replace(/\\/g, '/');
  console.log(relPath.padEnd(52), 'Count:', matches.length, 'Canonical:', hrefs.join(', '));
});
