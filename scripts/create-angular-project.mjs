import { config } from './config.mjs';
import { execute, getPath, readJsonFile, writeJsonFile } from './file-io.mjs';
import { getPackageVersion } from './utils.mjs';

export function createAngularProject(path) {
  let command = 'npm i -g @angular/cli@latest';
  execute(command);

  command = `ng new ui --prefix=ui --style=scss --routing --minimal --skip-git --standalone --ssr=false`;
  execute(command, path);

  const projectPath = getPath([path, 'ui']);
  command = 'ng add @angular/material --skip-confirmation';
  execute(command, projectPath);

  copyDocs(projectPath);
  updatePackageJson(projectPath);

  createTsConfigSpec(path);

  updateAngularJson(path);

  command = `npm link @bjanderson/${config.name}-shared`;
  execute(command, projectPath);
}

function copyDocs(path) {
  let docsPath = getPath(['docs']);
  let command = `find ${docsPath} -maxdepth 1 -type f -execdir cp "{}" ${path} ";"`;
  execute(command);

  docsPath = getPath(['docs', 'ui']);
  command = `cp -R ${docsPath}/. ${path}`;
  execute(command);
}

function updatePackageJson(path) {
  const packageJsonPath = getPath([path, 'package.json']);
  const packageJson = readJsonFile(packageJsonPath);
  packageJson.name = `@bjanderson/${config.name}-ui`;
  packageJson.private = true;
  packageJson.scripts = {
    ng: 'ng',
    start: 'ng serve',
    build: 'ng build',
    watch: 'ng build --watch --configuration development',
    sass: 'sass --load-path ./node_modules --load-path ./ --no-source-map',
    'sass:material': 'npm run sass src/material.scss ./tmp/material.css',
    test: 'jest --verbose',
    'test:coverage': 'jest --coverage',
    'test:watch': 'jest --watch',
    updatelink: `npm rm @bjanderson/${config.name}-shared && npm link @bjanderson/${config.name}-shared && ng cache clear`,
  };

  const dependencyProjects = [
    ...Object.keys(packageJson.dependencies),
    `@bjanderson/${config.name}-shared`,
    '@bjanderson/utils',
    '@fortawesome/fontawesome-free',
    'luxon',
    'ngx-toastr',
    'uuid',
  ];
  dependencyProjects.sort();

  dependencyProjects.forEach((d) => {
    if (packageJson.dependencies[d]) {
      packageJson.dependencies[d] = packageJson.dependencies[d]
        .replace('~', '')
        .replace('^', '');
    } else {
      packageJson.dependencies[d] = getPackageVersion(d);
    }
  });

  const devDependencyProjects = [
    ...Object.keys(packageJson.devDependencies),
    '@types/luxon',
    '@types/uuid',
    '@types/jest',
    'jest',
    'jest-preset-angular',
  ];
  devDependencyProjects.sort();

  devDependencyProjects.forEach((d) => {
    if (packageJson.devDependencies[d]) {
      packageJson.devDependencies[d] = packageJson.devDependencies[d]
        .replace('~', '')
        .replace('^', '');
    } else {
      packageJson.devDependencies[d] = getPackageVersion(d);
    }
  });

  writeJsonFile(packageJsonPath, packageJson, true);
}

function updateAngularJson(path) {
  const angularJsonPath = getPath([path, 'angular.json']);
  const angularJson = readJsonFile(angularJsonPath);
  console.log('angularJsonPath :>> ', angularJsonPath);
  console.log('angularJson :>> ', angularJson);
  // angularJson.projects.ui.architect.build.options.styles = [
  //   'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
  //   'node_modules/ngx-toastr/toastr.css',
  //   'src/material.scss',
  //   'src/styles.scss',
  // ];
  // console.log('angularJson :>> ', angularJson);
  // writeJsonFile(angularJsonPath, angularJson, true);
}

function createTsConfigSpec(path) {
  const tsConfigSpec = {
    extends: './tsconfig.json',
    compilerOptions: {
      esModuleInterop: true,
      emitDecoratorMetadata: true,
      outDir: './out-tsc/spec',
      types: ['jest'],
    },
    include: ['src/**/*.spec.ts', 'src/**/*.d.ts'],
  };

  const tsConfigSpecPath = getPath([path, 'tsconfig.spec.json']);
  writeJsonFile(tsConfigSpecPath, tsConfigSpec, true);
}
