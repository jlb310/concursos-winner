import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url || !url.includes('instagram.com/')) {
            return NextResponse.json({ error: 'URL de Instagram inválida' }, { status: 400 });
        }

        console.log(`Analyzing URL: ${url}`);

        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();

        // Go to URL and wait for load
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

        // Basic check for private/login wall
        const content = await page.content();
        if (content.includes('Restricted profile') || content.includes('Login • Instagram')) {
            await browser.close();
            return NextResponse.json({ error: 'Post privado o requiere login' }, { status: 403 });
        }

        // Wait for comments to load (this selector is fragile and changes often)
        // We try to wait for a generic list item or role
        try {
            await page.waitForSelector('ul', { timeout: 5000 });
        } catch (e) {
            console.warn("Could not find expected list selector, trying to parse anyway");
        }

        // Extract comments
        // Note: Instagram class names are obfuscated (e.g., "x1lliihq"). 
        // We'll use a more generic approach by looking for list items and text.
        const participants = await page.evaluate(() => {
            const results = [];

            // This is a "best effort" selector strategy
            // Logic: Look for elements that resemble comments
            // Usually comments are in <ul> lists inside the discussion area

            const listItems = document.querySelectorAll('ul li');

            for (const li of listItems) {
                // Try to find a username (usually an anchor tag with href matching username)
                const usernameEl = li.querySelector('h3, span, a[href^="/"]');
                const commentEl = li.querySelector('span[dir="auto"], div[dir="auto"]');
                const imgEl = li.querySelector('img');

                if (usernameEl && commentEl) {
                    const username = usernameEl.textContent?.trim() || 'Unknown';
                    const comment = commentEl.textContent?.trim() || '';
                    const avatar = imgEl?.src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

                    if (username && comment && username !== 'Log in' && username !== 'Follow') {
                        results.push({
                            id: Math.random().toString(36).substr(2, 9),
                            username,
                            comment,
                            avatar
                        });
                    }
                }
            }

            // Filter duplicates (sometimes Instagram renders multiple lists)
            const unique = new Map();
            results.forEach(p => unique.set(p.username, p));
            return Array.from(unique.values());
        });

        await browser.close();

        // Fallback if scraping failed to find anything (strict selector issues)
        if (participants.length === 0) {
            return NextResponse.json({
                warning: 'No se encontraron comentarios automáticamente (posible bloqueo de selectores).',
                participants: []
            });
        }

        return NextResponse.json({ participants });

    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: 'Error al analizar el post. Intenta nuevamente.' }, { status: 500 });
    }
}
