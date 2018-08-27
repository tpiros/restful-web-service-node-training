const fs = require('fs');

console.log('Reading file ...');

fs.readFile('myfile.txt', 'utf8', (error, content) => {
  if (error) {
    console.error(error);
  }
  console.log('Content --> ', content);
});

console.log('Finished reading file ...');