const ejs = require('ejs');
const fs = require('fs');
const data = require('./script.js'); // replace with the path to your script.js file

ejs.renderFile('./views/index.ejs', data, {}, function(err, str){
    // str => Rendered HTML string
    fs.writeFileSync('./index.html', str);
});