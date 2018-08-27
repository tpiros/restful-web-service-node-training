const path = require('path');
const fs = require('fs');

const files = fs.readdirSync('/tmp');
const tmpFiles = files.filter(file => path.extname(file) === '.tmp');
console.log(tmpFiles);