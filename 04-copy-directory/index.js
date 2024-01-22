const fsPromises = require('fs').promises;
const path = require('path');

const folder = path.join(__dirname, 'files');
const folderToCopy = path.join(__dirname, 'files-copy');

const copyFolder = async () => {
  try {
    await fsPromises.rm(folderToCopy, { recursive: true, force: true });

    await fsPromises.mkdir(folderToCopy, { recursive: true });

    const files = await fsPromises.readdir(folder, { withFileTypes: true });

    await Promise.all(
      files.map(async (file) => {
        const pathFile = path.join(folder, file.name);
        const pathFileCopy = path.join(folderToCopy, file.name);
        await fsPromises.copyFile(pathFile, pathFileCopy);
      }),
    );

    console.log('Directory copied successfully!');
  } catch (error) {
    console.error(`Error copying directory: ${error.message}`);
  }
};

copyFolder();
