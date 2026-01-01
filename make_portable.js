const fs = require('fs');
const path = require('path');

// Configuration
const inputFile = 'Flight_Tracker_Blog_Post.html';
const outputFile = 'Flight_Tracker_Blog_Post_Portable.html';
const imageDir = 'public/blog_images';

try {
    let html = fs.readFileSync(inputFile, 'utf8');

    // Find all images in the HTML that point to our local directory
    // Matches src="public/blog_images/filename.png"
    const regex = /src="public\/blog_images\/([^"]+)"/g;

    const newHtml = html.replace(regex, (match, filename) => {
        const imagePath = path.join(imageDir, filename);
        if (fs.existsSync(imagePath)) {
            console.log(`Embedding ${filename}...`);
            const bitmap = fs.readFileSync(imagePath);
            const base64 = Buffer.from(bitmap).toString('base64');
            return `src="data:image/png;base64,${base64}"`;
        } else {
            console.warn(`Warning: Image not found ${imagePath}`);
            return match;
        }
    });

    fs.writeFileSync(outputFile, newHtml);
    console.log(`Success! Created ${outputFile} with embedded images.`);

} catch (e) {
    console.error("Error processing file:", e);
}
