const fs = require('fs').promises;
const path = require('path');
const targetDirectory = path.join(__dirname, 'project-dist');
const componentsDirectory = path.join(__dirname, 'components');
const stylesDirectory = path.join(__dirname, 'styles');
const templateFilePath = path.join(__dirname, 'template.html');
const assetsDirectory = path.join(__dirname, 'assets');
const targetAssetsDirectory = path.join(targetDirectory, 'assets');
const targetHtmlFilePath = path.join(targetDirectory, 'index.html');
const targetCssFilePath = path.join(targetDirectory, 'style.css');

async function createProjectDistDirectory() {
  try {
    await fs.mkdir(targetDirectory, { recursive: true });

    await Promise.all([
      generateHtmlFile(),
      mergeStylesFiles(),
      copyAssetsFiles(),
    ]);

    console.log('Project successfully created in project-dist folder.');
  } catch (err) {
    console.error('Error creating project:', err);
  }
}

async function generateHtmlFile() {
  try {
    let templateContent = await fs.readFile(templateFilePath, 'utf-8');
    const componentFiles = await fs.readdir(componentsDirectory, {
      withFileTypes: true,
    });

    for (const file of componentFiles) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const componentName = path.parse(file.name).name;
        const componentContent = await fs.readFile(
          path.join(componentsDirectory, file.name),
          'utf-8',
        );
        templateContent = templateContent.replace(
          `{{${componentName}}}`,
          componentContent,
        );
      }
    }

    await fs.writeFile(targetHtmlFilePath, templateContent);
  } catch (err) {
    console.error('Error generating HTML file:', err);
  }
}

async function mergeStylesFiles() {
  try {
    const files = await fs.readdir(stylesDirectory, { withFileTypes: true });
    let stylesContent = '';

    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const styleContent = await fs.readFile(
          path.join(stylesDirectory, file.name),
          'utf-8',
        );
        stylesContent += styleContent;
      }
    }

    await fs.writeFile(targetCssFilePath, stylesContent);
  } catch (err) {
    console.error('Error merging styles:', err);
  }
}

async function copyAssetsFiles(
  fromDirectory = assetsDirectory,
  toDirectory = targetAssetsDirectory,
) {
  try {
    await fs.rm(toDirectory, { recursive: true, force: true });
    await fs.mkdir(toDirectory, { recursive: true });
    const files = await fs.readdir(fromDirectory, { withFileTypes: true });

    await Promise.all(
      files.map(async (file) => {
        const sourceFilePath = path.join(fromDirectory, file.name);
        const targetFilePath = path.join(toDirectory, file.name);

        if (file.isFile()) {
          await fs.copyFile(sourceFilePath, targetFilePath);
        } else if (file.isDirectory()) {
          await copyAssetsFiles(sourceFilePath, targetFilePath);
        }
      }),
    );
  } catch (err) {
    console.error('Error copying assets:', err);
  }
}

createProjectDistDirectory();
