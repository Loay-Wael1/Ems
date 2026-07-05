const fs = require('fs');
const report = JSON.parse(fs.readFileSync('e:/work/ems/lighthouse-report-after.json'));

const getDetails = (key) => report.audits[key]?.details?.items || [];
console.log('LCP Element:', getDetails('largest-contentful-paint-element')[0]);
console.log('SEO blocked:', report.audits['is-crawlable']?.score, report.audits['is-crawlable']?.displayValue);
console.log('Render Blocking:', getDetails('render-blocking-resources'));
console.log('Unoptimized images:', getDetails('uses-optimized-images'));
console.log('Network payload size:', report.audits['total-byte-weight']?.displayValue);
console.log('Cache issues:', getDetails('uses-long-cache-ttl'));
