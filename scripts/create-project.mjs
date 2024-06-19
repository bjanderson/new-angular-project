import { config } from './config.mjs';
import { createAngularProject } from './create-angular-project.mjs';
import {
  createDirectory,
  execute,
  getPath,
  writeJsonFile,
} from './file-io.mjs';
import { getPackageVersion } from './utils.mjs';

export function createProject() {
  const dir = config.dir;
  const name = config.name;
  const path = getPath([dir, name]);

  initProject(path);

  // createSharedProject(path);

  createAngularProject(path);

  // createNestProject(path);
}

function initProject(path) {
  createDirectory(path);

  let command =
    'wget https://gist.githubusercontent.com/bjanderson/163bf4e68e4c0cddada02d6fa7a6ceb6/raw/7f7d4ee09ba48015dd2aeae1c0a64ec2ae4844b8/LICENSE';
  execute(command, path);

  command = 'npm init -y';
  execute(command, path);

  createPackageJson(path);

  // command = 'git init';
  // execute(command, path);

  // command = 'git add -a';
  // execute(command, path);

  // command = 'git commit -m "initial commit"';
  // execute(command, path);
}

function createPackageJson(path) {
  const packageJsonPath = getPath([path, 'package.json']);
  const json = {
    name: `@bjanderson/${config.name}`,
    version: '0.0.0',
    author: 'Bartley Anderson',
    license: 'MIT',
    private: true,
    scripts: {
      'start:server': 'npm run start --prefix ./server',
      'start:ui': 'npm run start --prefix ./ui',
      start: 'run-p -r start:server start:ui',
    },
    devDependencies: { 'npm-run-all': getPackageVersion('npm-run-all') },
  };
  writeJsonFile(packageJsonPath, json, true);
}
