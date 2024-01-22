const fs = require('fs');
const path = require('path');

const { stdin, stdout } = process;
const EXIT_COMMAND = 'exit';
const pathToFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToFile);

let exitHandled = false;

function exitHandler() {
  if (!exitHandled) {
    exitHandled = true;
    output.end();
    stdout.write('Good luck!\n');
    process.exit();
  }
}

process.on('exit', exitHandler);
process.on('SIGINT', exitHandler);
process.on('SIGTERM', exitHandler);

stdout.write('Hi! Enter some information:\n');

stdin.on('data', (chunk) => {
  const inputText = chunk.toString().trim();
  if (inputText === EXIT_COMMAND) {
    exitHandler();
  } else {
    output.write(chunk);
  }
});

stdin.on('end', exitHandler);
