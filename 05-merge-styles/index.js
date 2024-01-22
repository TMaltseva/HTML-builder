const fsPromises = require('fs').promises;
const path = require('path');

const sourceFolderDir = path.join(__dirname, 'styles');
const targetDir = path.join(__dirname, 'project-dist', 'bundle.css');

async function bundleCSS() {
  try {
    await fsPromises.writeFile(targetDir, '', 'utf8');

    const files = await fsPromises.readdir(sourceFolderDir, {
      withFileTypes: true,
    });
    for (const file of files) {
      const filePath = path.join(sourceFolderDir, file.name);

      if (file.isFile() && path.extname(filePath) === '.css') {
        const data = await fsPromises.readFile(filePath, 'utf8');
        await fsPromises.appendFile(targetDir, data);
      }
    }
  } catch (err) {
    console.error('Error bundling CSS files:', err);
  }
}

bundleCSS();
