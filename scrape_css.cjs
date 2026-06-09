const fs = require('fs');

async function scrape() {
  const r = await fetch('https://www.thedatecrew.com/');
  const html = await r.text();
  
  const cssLinks = [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m => m[1]);
  console.log('CSS Links found:', cssLinks);
  
  let combinedCss = '';
  for (const link of cssLinks) {
    if (link.startsWith('http')) {
      const cssR = await fetch(link);
      const css = await cssR.text();
      combinedCss += `\n/* Source: ${link} */\n` + css;
    }
  }
  
  fs.writeFileSync('site_css.css', combinedCss);
  console.log('Wrote site_css.css');
}

scrape().catch(console.error);
