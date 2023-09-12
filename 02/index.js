const { program } = require('commander');
const fs = require('fs').promises;
const readline = require('readline');
require('colors');

// setup arguments like flag, description and default values
// use this like 'node index.js -f <name of your log file>' or 'node index.js --file ...'
// <type> and second argument is used for showing hint if you try wrong syntax
// [type] can be used with optional arguments
// third option arg - default file name
program.option('-f, --file <type>', 'file for saving game results', 'game_results.txt');

program.parse(process.argv);

// create readline interface to interact with user
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// example how to use readline
// rl.on('line', (txt) => {
//   console.log('||=============>>>>>>>>>>>');
//   console.log(txt);
//   console.log('<<<<<<<<<<<=============||');
//   process.exit();
// });

/**  Counter of user attempts. */
let counter = 0;

/** Guessed number, from 1 to 10 */
const mind = Math.ceil(Math.random() * 10);

/** Path to log file. */
const logFile = program.opts().file;

/**
 * Write game results into the log file.
 * @author Sergii Goncharuk
 *
 * @param {string} msg - message to save into file
 * @returns {Promise<void>} - it means returning promise with no data
 */
const logger = async (msg) => {
  try {
    await fs.appendFile(logFile, `${new Date().toLocaleString('uk-UA')}: ${msg}\n`);

    console.log(`Successfully saved game result to the log file ${logFile}`.yellow);
  } catch (err) {
    console.log(`Something went very very wrong.. ${err.message}`.red);
  }
};

/**
 * Simple input number validation.
 * @author Sergii Goncharuk
 *
 * @param {number} num - value to validate
 * @returns {boolean}
 */
const isValid = (num) => {
  if (!Number.isNaN(num) && num > 0 && num <= 10) return true;

  if (Number.isNaN(num)) console.log('Please, enter a number!'.red);
  if (num < 1 || num > 10) console.log('Number should be between 1 and 10'.red);

  return false;
};

/**
 * Main game process.
 */
const game = () => {
  rl.question('Please, enter any whole number between 1 and 10!!\n'.green, (value) => {
    // convert value to number
    // Number(value)
    const number = +value;

    // validate number
    if (!isValid(number)) return game();

    // counter = counter + 1;
    // counter += 1;
    // ++counter;
    counter++;

    // if number is not equal guessed
    if (number !== mind) {
      console.log('Oh no!! Try again..'.red);

      return game();
    }

    const winningMessage = `Congratulations!! You guessed the number in ${counter} step(s) :]`;

    console.log(winningMessage.magenta);
    logger(winningMessage);

    // process.exit();
    rl.close();
  });
};

// Launch game.
game();
