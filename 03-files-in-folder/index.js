const fs = require('fs');
const path = require('path');
const { stdout } = process;
const pathToFolder = path.join(__dirname, 'secret-folder');

function readFolder() {
  fs.readdir(pathToFolder, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err.message);
      return;
    }

    if (files) {
      files.forEach((file) => {
        if (file.isFile()) {
          const filePath = path.join(pathToFolder, file.name);
          const fileName = path.parse(filePath).name;
          const fileExt = path.extname(filePath).slice(1);

          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.error('Error getting file stats:', err.message);
              return;
            }

            stdout.write(
              `${fileName} - ${fileExt} - ${(stats.size / 1024).toFixed(
                2,
              )}kb\n`,
            );
          });
        }
      });
    }
  });
}

readFolder();
