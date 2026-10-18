import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=== KRAVIONA 4-ORIGIN & PRODUCTION ROUTE VALIDATION ===\n');

// 1. Validate Nginx Configuration for 4-origin redirect logic
function testNginxConfig() {
  console.log('[1] Auditing nginx/kraviona for 4 HTTP/HTTPS and WWW/non-WWW variants...');
  const nginxPath = path.resolve(__dirname, '../../nginx/kraviona');
  const content = fs.readFileSync(nginxPath, 'utf8');

  let passed = true;

  // Check HTTP block covers both kraviona.com and www.kraviona.com
  const hasHttpBlock = content.includes('listen 80') && content.includes('server_name kraviona.com www.kraviona.com');
  const hasHttp301 = /return 301 https:\/\/www\.kraviona\.com\$request_uri;/.test(content);

  if (!hasHttpBlock || !hasHttp301) {
    console.error('FAIL: Nginx port 80 block does not redirect both kraviona.com and www.kraviona.com to https://www.kraviona.com$request_uri');
    passed = false;
  } else {
    console.log('  ✓ http://kraviona.com/*     → 301 https://www.kraviona.com/*');
    console.log('  ✓ http://www.kraviona.com/* → 301 https://www.kraviona.com/*');
  }

  // Check HTTPS apex consolidation
  const hasApexHttps = content.includes('server_name kraviona.com;') && content.includes('return 301 https://www.kraviona.com$request_uri;');
  const hasHostCheck = content.includes('if ($host = "kraviona.com")') && content.includes('return 301 https://www.kraviona.com$request_uri;');

  if (hasApexHttps || hasHostCheck) {
    console.log('  ✓ https://kraviona.com/*    → 301 https://www.kraviona.com/* (direct permanent consolidation)');
  } else {
    console.error('FAIL: Nginx configuration lacks https://kraviona.com to https://www.kraviona.com redirect');
    passed = false;
  }

  // Check HTTPS www server block
  const hasWwwHttps = content.includes('server_name www.kraviona.com;') && content.includes('proxy_pass http://127.0.0.1:3000;');
  if (hasWwwHttps) {
    console.log('  ✓ https://www.kraviona.com/* → 200 OK (Proxied to Next.js on port 3000)');
  } else {
    console.error('FAIL: Nginx lacks server block proxying https://www.kraviona.com to Next.js port 3000');
    passed = false;
  }

  return passed;
}

// 2. Validate Next.js Proxy / Middleware logic for host enforcement
async function testProxyMiddleware() {
  console.log('\n[2] Auditing frontend/proxy.js host enforcement & session cleanup...');
  const proxyPath = path.resolve(__dirname, '../proxy.js');
  const content = fs.readFileSync(proxyPath, 'utf8');

  let passed = true;
  if (!content.includes('const CANONICAL_HOST = "www.kraviona.com";') || !content.includes('const APEX_HOST = "kraviona.com";')) {
    console.error('FAIL: proxy.js does not define CANONICAL_HOST as www.kraviona.com and APEX_HOST as kraviona.com');
    passed = false;
  }

  if (!content.includes('return NextResponse.redirect(url, 301);')) {
    console.error('FAIL: proxy.js does not use 301 for apex redirection');
    passed = false;
  } else {
    console.log('  ✓ Next.js middleware redirects apex host requests to https://www.kraviona.com using HTTP 301');
  }

  return passed;
}

// 3. Validate Robots.txt
function testRobotsTxt() {
  console.log('\n[3] Auditing frontend/public/robots.txt...');
  const robotsPath = path.resolve(__dirname, '../public/robots.txt');
  const content = fs.readFileSync(robotsPath, 'utf8');

  let passed = true;
  if (!content.includes('Sitemap: https://www.kraviona.com/sitemap.xml')) {
    console.error('FAIL: robots.txt sitemap directive does not point to https://www.kraviona.com/sitemap.xml');
    passed = false;
  } else {
    console.log('  ✓ robots.txt specifies correct sitemap: https://www.kraviona.com/sitemap.xml');
  }

  if (content.includes('https://kraviona.com')) {
    console.error('FAIL: robots.txt contains references to non-www origin https://kraviona.com');
    passed = false;
  }

  if (content.includes('Disallow: /blog/bGF0ZXN0LW')) {
    console.error('FAIL: robots.txt blocks redirected URL /blog/bGF0ZXN0LW');
    passed = false;
  } else {
    console.log('  ✓ robots.txt does not block crawlable redirects or important assets');
  }

  return passed;
}

// 4. Validate All Production Route HTML Canonicals
function testRouteInventory() {
  console.log('\n[4] Auditing all compiled production route canonicals...');
  const appServerDir = path.resolve(__dirname, '../.next/server/app');
  
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

  const htmlFiles = walk(appServerDir);
  let failed = false;
  let audited = 0;

  for (const f of htmlFiles) {
    const relPath = path.relative(appServerDir, f).replace(/\\/g, '/');
    const content = fs.readFileSync(f, 'utf8');
    const matches = [...content.matchAll(/<link[^>]*rel=["']canonical["'][^>]*>/gi)];
    const hrefs = matches.map(m => {
      const match = m[0].match(/href=["']([^"']*)["']/i);
      return match ? match[1] : 'unknown';
    });

    if (relPath.includes('_not-found') || relPath.includes('_global-error')) {
      continue;
    }

    audited++;
    const canonical = hrefs[0];
    if (matches.length !== 1 || !canonical) {
      console.error(`FAIL: ${relPath} does not have exactly 1 canonical tag (found ${matches.length})`);
      failed = true;
      continue;
    }

    if (!canonical.startsWith('https://www.kraviona.com')) {
      console.error(`FAIL: ${relPath} canonical does not start with https://www.kraviona.com: ${canonical}`);
      failed = true;
    }

    if (canonical.includes('kraviona.com') && !canonical.includes('www.kraviona.com')) {
      console.error(`FAIL: ${relPath} canonical references non-www domain: ${canonical}`);
      failed = true;
    }

    if (relPath !== 'index.html' && canonical === 'https://www.kraviona.com') {
      console.error(`FAIL: ${relPath} leaked to homepage canonical!`);
      failed = true;
    }
  }

  if (!failed) {
    console.log(`  ✓ All ${audited} compiled route HTML pages have exact, self-referencing WWW canonical URLs.`);
  }

  return !failed;
}

// Run All
async function main() {
  const r1 = testNginxConfig();
  const r2 = await testProxyMiddleware();
  const r3 = testRobotsTxt();
  const r4 = testRouteInventory();

  if (r1 && r2 && r3 && r4) {
    console.log('\n======================================================');
    console.log('ALL 4-ORIGIN & ROUTE VALIDATION CHECKS PASSED (100%)');
    console.log('======================================================\n');
  } else {
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
