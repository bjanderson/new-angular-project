import { config } from './config.mjs';
import { execute, getPath } from './file-io.mjs';

export function createNestProject(path) {
  let command = 'npm i -g @nestjs/cli@latest';
  execute(command);

  command = `nest new server --language=TS --package-manager=npm --skip-git`;
  execute(command, path);

  const projectPath = getPath([path, 'server']);
  copyDocs(projectPath);

  command = `npm link @bjanderson/${config.name}-shared`;
  execute(command, projectPath);
}

function copyDocs(path) {
  let docsPath = getPath(['docs']);
  let command = `find ${docsPath} -maxdepth 1 -type f -execdir cp "{}" ${path} ";"`;
  execute(command);

  docsPath = getPath(['docs', 'server']);
  command = `cp -R ${docsPath}/. ${path}`;
  execute(command);
}
