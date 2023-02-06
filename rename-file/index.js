const path = require('path');
const fs = require('fs');


console.log('argvs', process.argv);
const [nodeProcess, nodeFile, file] = process.argv;
const dir = '/Users/danielebortolotti/Downloads';
const filePath = path.join(dir, file);

const data = fs.statSync(filePath);
const secureFilename = path.basename(filePath).replace(/\s+/g, '-');

if (!data.isFile()) return;

const birthDate = (new Date(data.birthtime).toISOString().split('T')[0]).replace(/\-/g, '.');
const newFilePath = path.join(dir, birthDate + ' - ' + secureFilename);
fs.renameSync(filePath, newFilePath);
