const HTMLtoDOCX = require('html-to-docx');
const fs = require('fs');
const path = require('path');

const filePath = './Flight_Tracker_Blog_Post.html';

(async () => {
    try {
        console.log("Reading HTML file...");
        const htmlContent = fs.readFileSync(filePath, 'utf8');

        console.log("Generating DOCX...");
        // html-to-docx handles the conversion buffer
        const fileBuffer = await HTMLtoDOCX(htmlContent, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            pageNumber: true,
        });

        const outputPath = './Flight_Tracker_Blog_Post.docx';
        fs.writeFileSync(outputPath, fileBuffer);

        console.log(`Success! Word Doc saved to: ${outputPath}`);

    } catch (e) {
        console.error("Error generating DOCX:", e);
    }
})();
