import { config } from './config.mjs';
import { execute, getPath, readJsonFile, writeJsonFile } from './file-io.mjs';

export function createSharedProject(path) {
  const projectPath = getPath([path, 'shared']);
  copyDocs(projectPath);
  updatePackageJson(projectPath);
  linkProject(projectPath);
}

function copyDocs(path) {
  let docsPath = getPath(['docs', 'shared']);
  let command = `cp -R ${docsPath}/ ${path}`;
  execute(command);

  docsPath = getPath(['docs']);
  command = `find ${docsPath} -maxdepth 1 -type f -execdir cp "{}" ${path} ";"`;
  execute(command);
}

function updatePackageJson(path) {
  const packageJsonPath = getPath([path, 'package.json']);
  const packageJson = readJsonFile(packageJsonPath);
  packageJson.name = `@bjanderson/${config.name}-shared`;
  packageJson.private = true;
  writeJsonFile(packageJsonPath, packageJson, true);
}

function linkProject(path) {
  let command = `npm install`;
  execute(command, path);

  command = `npm run build`;
  execute(command, path);

  command = `npm link`;
  execute(command, path);
}
