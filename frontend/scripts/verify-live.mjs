import https from 'node:https';
import http from 'node:http';

const tests = [
  { url: 'http://kraviona.com/about', expectedStatus: [301, 308], checkLocation: 'https://www.kraviona.com' },
  { url: 'http://www.kraviona.com/about', expectedStatus: [301, 308], checkLocation: 'https://www.kraviona.com' },
  { url: 'https://kraviona.com/about', expectedStatus: [301, 308], checkLocation: 'https://www.kraviona.com' },
  { url: 'https://www.kraviona.com/about', expectedStatus: [200] },
  { url: 'https://www.kraviona.com/case-studies', expectedStatus: [200] },
  { url: 'https://www.kraviona.com/blog', expectedStatus: [200] },
  { url: 'https://www.kraviona.com/services/mern-stack-development', expectedStatus: [200] },
  { url: 'https://www.kraviona.com/what-is-mern-stack-the-complete-2026-guide-for-developers', expectedStatus: [301, 308], checkLocation: '/next-gen-web-development/what-is-mern-stack-the-complete-2026-guide-for-developer' }
];

async function runCheck(test) {
  try {
    const res = await fetch(test.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
      redirect: 'manual'
    });
    const status = res.status;
    const location = res.headers.get('location') || '';
    const passedStatus = test.expectedStatus.includes(status);
    const passedLoc = !test.checkLocation || location.includes(test.checkLocation);

    let canonical = null;
    if (status === 200) {
      const html = await res.text();
      const match = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);
      if (match) {
        const hrefMatch = match[0].match(/href=["']([^"']*)["']/i);
        canonical = hrefMatch ? hrefMatch[1] : match[0];
      }
    }

    return { url: test.url, status, location, canonical, passed: passedStatus && passedLoc };
  } catch (err) {
    return { url: test.url, error: err.message, passed: false };
  }
}

(async () => {
  console.log('=== RUNNING LIVE HTTP / HTTPS & CANONICAL VERIFICATION ===\n');
  let allPassed = true;
  for (const t of tests) {
    const res = await runCheck(t);
    const mark = res.passed ? 'PASS' : 'FAIL';
    if (!res.passed) allPassed = false;
    console.log(`[${mark}] ${res.url}`);
    console.log(`       Status: ${res.status || res.error} | Redirect: ${res.location || 'None'} | Canonical: ${res.canonical || 'N/A'}`);
  }
  console.log('\n==============================================');
  if (allPassed) {
    console.log('ALL LIVE VERIFICATION TESTS PASSED (100%)');
  } else {
    console.log('SOME TESTS FAILED (Review above)');
  }
  console.log('==============================================');
})();
