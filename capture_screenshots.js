const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    // Launch headless browser
    const browser = await puppeteer.launch({
        headless: "new"
    });
    const page = await browser.newPage();

    // Set a nice desktop viewport
    await page.setViewport({ width: 1440, height: 900 });

    const snapshots = [
        {
            url: 'http://localhost:3000',
            file: 'flight_card.png',
            selector: 'main',
            desc: 'Main Flight Card'
        },
        {
            url: 'http://localhost:3000/airport-dashboard?code=JFK&type=departure', // Query setup for nice view 
            file: 'dashboard.png',
            selector: 'table', // Wait for the table
            desc: 'Airport Dashboard'
        },
        {
            url: 'http://localhost:3000/architecture',
            file: 'architecture.png',
            selector: 'h1',
            desc: 'Architecture Diagram'
        }
    ];

    console.log("Starting screenshot capture...");

    for (const snap of snapshots) {
        console.log(`📸 capturing ${snap.desc}...`);
        try {
            await page.goto(snap.url, { waitUntil: 'networkidle0', timeout: 30000 });

            // Special handling for Dashboard: Type "JFK" and search
            if (snap.file === 'dashboard.png') {
                console.log('   Typing search query...');
                await page.waitForSelector('input[type="text"]');
                await page.type('input[type="text"]', 'JFK');
                await page.keyboard.press('Enter');
            }

            // Wait for specific element if needed
            if (snap.selector) {
                await page.waitForSelector(snap.selector, { timeout: 10000 });
            }

            // Artificial delay to let maps/animations settle
            await new Promise(r => setTimeout(r, 3000));

            const outPath = path.resolve(__dirname, 'public/blog_images', snap.file);
            await page.screenshot({ path: outPath });
            console.log(`   Saved to ${outPath}`);
        } catch (e) {
            console.error(`   Error capturing ${snap.url}:`, e.message);
        }
    }

    await browser.close();
    console.log("Done!");
})();
