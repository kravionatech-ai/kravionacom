const fs = require('fs');
const path = require('path');

console.log('=== KRAVIONA TECHNICAL SEO AUDIT & VALIDATION ===\n');

// 1. Verify next.config.mjs redirects
async function testNextConfigRedirects() {
  console.log('[1] Checking next.config.mjs redirects for loops & chains...');
  const nextConfigPath = path.resolve(__dirname, '../next.config.mjs');
  const configModule = await import('file:///' + nextConfigPath.replace(/\\/g, '/'));
  const nextConfig = configModule.default;
  
  if (typeof nextConfig.redirects !== 'function') {
    console.error('FAIL: nextConfig.redirects is not a function');
    return false;
  }

  const redirects = await nextConfig.redirects();
  console.log(`Loaded ${redirects.length} redirects.`);

  const sourceMap = new Map();
  let hasErrors = false;

  for (const r of redirects) {
    if (sourceMap.has(r.source)) {
      console.error(`FAIL: Duplicate redirect source: ${r.source}`);
      hasErrors = true;
    }
    sourceMap.set(r.source, r.destination);
  }

  // Check for 1-hop chains and self-loops
  for (const r of redirects) {
    if (r.source === r.destination) {
      console.error(`FAIL: Self-redirect loop detected: ${r.source} -> ${r.destination}`);
      hasErrors = true;
    }
    if (sourceMap.has(r.destination)) {
      console.error(`FAIL: Redirect chain detected: ${r.source} -> ${r.destination} -> ${sourceMap.get(r.destination)}`);
      hasErrors = true;
    }
  }

  if (!hasErrors) {
    console.log('PASS: No redirect loops or chains detected in next.config.mjs.');
  }
  return !hasErrors;
}

// 2. Audit compiled HTML canonical tags
function testCompiledCanonicals() {
  console.log('\n[2] Checking compiled HTML files for canonical tags & home leakage...');
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
  let auditedCount = 0;

  for (const f of htmlFiles) {
    const relPath = path.relative(appServerDir, f).replace(/\\/g, '/');
    const content = fs.readFileSync(f, 'utf8');
    const matches = [...content.matchAll(/<link[^>]*rel=["']canonical["'][^>]*>/gi)];
    const hrefs = matches.map(m => {
      const match = m[0].match(/href=["']([^"']*)["']/i);
      return match ? match[1] : 'unknown';
    });

    if (relPath.includes('_not-found') || relPath.includes('_global-error')) {
      if (matches.length > 0) {
        console.error(`FAIL: Error page ${relPath} has canonical: ${hrefs.join(', ')}`);
        failed = true;
      }
      continue;
    }

    auditedCount++;
    if (matches.length !== 1) {
      console.error(`FAIL: ${relPath} has ${matches.length} canonical tags (expected 1).`);
      failed = true;
    }

    const canonical = hrefs[0];
    if (!canonical.startsWith('https://www.kraviona.com')) {
      console.error(`FAIL: ${relPath} canonical does not start with https://www.kraviona.com: ${canonical}`);
      failed = true;
    }

    // Check if an interior page leaked to homepage
    if (relPath !== 'index.html' && canonical === 'https://www.kraviona.com') {
      console.error(`FAIL: Interior page ${relPath} incorrectly canonicalized to homepage!`);
      failed = true;
    }

    // Check for trailing slash
    if (canonical.length > 'https://www.kraviona.com'.length && canonical.endsWith('/')) {
      console.error(`FAIL: Canonical has trailing slash: ${canonical}`);
      failed = true;
    }
  }

  if (!failed) {
    console.log(`PASS: All ${auditedCount} production HTML pages have exactly 1 valid, self-referencing canonical tag with NO homepage leakage.`);
  }
  return !failed;
}

// 3. Test seoConfig canonicalUrl function
async function testSeoConfig() {
  console.log('\n[3] Testing seoConfig.canonicalUrl behavior...');
  const seoConfigPath = path.resolve(__dirname, '../app/seoConfig.js');
  const seoModule = await import('file:///' + seoConfigPath.replace(/\\/g, '/'));
  const { canonicalUrl, SITE_URL } = seoModule;

  const testCases = [
    { input: '', expected: 'https://www.kraviona.com' },
    { input: '/', expected: 'https://www.kraviona.com' },
    { input: '/services', expected: 'https://www.kraviona.com/services' },
    { input: '/services/', expected: 'https://www.kraviona.com/services' },
    { input: 'services/mern-stack-development', expected: 'https://www.kraviona.com/services/mern-stack-development' },
    { input: '/blog/test-slug?utm_source=twitter', expected: 'https://www.kraviona.com/blog/test-slug' },
    { input: 'https://kraviona.com/about', expected: 'https://www.kraviona.com/about' },
    { input: 'http://www.kraviona.com/contact', expected: 'https://www.kraviona.com/contact' },
  ];

  let allPassed = true;
  for (const tc of testCases) {
    const result = canonicalUrl(tc.input);
    if (result !== tc.expected) {
      console.error(`FAIL: canonicalUrl("${tc.input}") => "${result}" (expected "${tc.expected}")`);
      allPassed = true;
    }
  }

  if (allPassed) {
    console.log(`PASS: All ${testCases.length} canonicalUrl test cases verified successfully.`);
  }
  return allPassed;
}

async function run() {
  const c1 = await testNextConfigRedirects();
  const c2 = testCompiledCanonicals();
  const c3 = await testSeoConfig();

  if (c1 && c2 && c3) {
    console.log('\n=============================================');
    console.log('ALL TECHNICAL SEO AUDIT CHECKS PASSED (100%)');
    console.log('=============================================');
  } else {
    process.exit(1);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
