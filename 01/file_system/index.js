// console.log(global);

// console.log(process);
// process.env.MODE = 'development';
// console.log(process.env);

// console.log(process.argv);
// console.log(process.cwd());

// process.exit();

// console.log(__dirname);
// console.log(__filename);

const path = require('path');
const fs = require('fs').promises;

/**
 * IIFE main function
 */
(async () => {
  try {
    // READ text file =============================
    // WINDOWS 'C:\Desktop\bla\index.js'
    // UNIX-LIKE '/Desktop/bla/index.js'

    const pathToFile = path.join('files', 'books', 'jsforchildren.txt');

    const readResult = await fs.readFile(pathToFile);

    const txt = readResult.toString();
    const filesDir = 'files';

    // const listDirContent = await fs.readdir(filesDir);
    // const dirStat = await fs.lstat(filesDir);

    // console.log(dirStat.isDirectory());
    // console.log(dirStat);

    // fs.appendFile();

    // READ json =============================

    const pathToJson = path.join('files', 'example.json');

    const jsonReadResult = await fs.readFile(pathToJson);

    const json = JSON.parse(jsonReadResult);

    console.log(json);

    json.job = 'Rock musician';

    await fs.writeFile('newJson.json', JSON.stringify(json));
  } catch (err) {
    console.log('||=============>>>>>>>>>>>');
    console.log(err);
    console.log('<<<<<<<<<<<=============||');
  }
})();
