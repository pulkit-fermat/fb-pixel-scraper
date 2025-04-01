import { chromium } from 'playwright';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'Missing ?url=' });

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(url, { waitUntil: 'networkidle' });

    const content = await page.content();

    const match = content.match(/https:\/\/connect\.facebook\.net\/signals\/config\/(\d+)/);
    const pixelId = match ? match[1] : null;

    res.status(200).json({ facebook_pixel_id: pixelId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (browser) await browser.close();
  }
}
