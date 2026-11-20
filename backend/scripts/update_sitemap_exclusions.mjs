import fs from 'fs';

const candidatePaths = ['frontend/lib/sitemapData.js', 'frontend/app/sitemap.js'];
const filePath = candidatePaths.find(p => fs.existsSync(p)) || candidatePaths[0];
let content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

const excludedList = [
  "bGF0ZXN0LW",
  "ai-news-august-2026",
  "what-is-mern-stack-the-complete-2026-guide-for-developers",
  "what-is-mern-stack-the-complete-2026-guide-for-developer",
  "complete-guide-for-developers",
  "complete-guide-for-developer",
  // 7 Merged & 301-Redirected Commercial Posts (Excluded from XML Sitemap)
  "why-choosing-a-top-mern-stack-development-company-in-india-changes-the-game",
  "mern-stack-development-company-delhi",
  "mern-stack-development-company-in-india",
  "mern-stack-development-company-india",
  "technical-seo-agency-delhi",
  "best-ai-automation-company-in-delhi-how-businesses-are-growing-smarter-in-2025",
  "best-ai-automation-company-in-delhi-ncr-india-in-2025",
  "reactjs-development-company-india",
  "website-development-company-in-delhi",
];

const newBlock = `const EXCLUDED_SLUGS = [\n${excludedList.map(s => `  "${s}",`).join('\n')}\n];`;

content = content.replace(/const EXCLUDED_SLUGS = \[[^\]]*\];/s, newBlock);
fs.writeFileSync(filePath, content);
console.log('Successfully updated EXCLUDED_SLUGS in frontend/app/sitemap.js');
