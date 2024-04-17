const fs = require('fs');
const ejs = require('ejs');

// Read mock data from mockData.json
const { playerSummaries } = require('./script');
console.log(playerSummaries);

const currentPage = 1;
const totalPages = 15;

// Read EJS template file
const template = fs.readFileSync('./views/index.ejs', 'utf-8');

// Render EJS template with mock data
const renderedHtml = ejs.render(template,  { playerSummaries, currentPage, totalPages });

// Write rendered HTML to output file
fs.writeFileSync('./public/index.html', renderedHtml, 'utf-8');

console.log('HTML file generated successfully.');
