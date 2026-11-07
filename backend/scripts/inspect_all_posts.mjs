import fs from "fs";

const posts = JSON.parse(fs.readFileSync("backend/scripts/posts_inventory.json", "utf8"));

posts.forEach((p, idx) => {
  const line = `${idx + 1}. [${p.type.toUpperCase()}] [${p.catName}] ${p.slug} | Title: "${p.title}" | Words: ${p.wordCount} | Internal Views: ${p.views} | Links: ${p.internalLinksCount} int / ${p.externalLinksCount} ext | Status: ${p.status}`;
  console.log(line);
});
