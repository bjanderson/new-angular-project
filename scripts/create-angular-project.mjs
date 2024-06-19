import { config, parseTemplate } from './config.mjs';
import {
  execute,
  getPath,
  readFile,
  readJsonFile,
  writeFile,
  writeJsonFile,
} from './file-io.mjs';
import { getPackageVersion } from './utils.mjs';

export function createAngularProject(path) {
  const projectPath = getPath([path, 'ui']);

  let command = 'npm i -g @angular/cli@latest';
  execute(command);

  command = `ng new ui --inline-style=false --inline-template=false --interactive=false --minimal=true --package-manager=npm --prefix=ui --routing=true --skip-git --ssr=false --standalone=true --strict=false --style=scss`;
  execute(command, path);

  // command = `npm link @bjanderson/${config.name}-shared`;
  // execute(command, projectPath);

  copyDocs(projectPath);
  updatePackageJson(projectPath);
  updateAngularJson(projectPath);
  createTsConfigSpec(projectPath);
  updateIndexHtml(projectPath);
  updateAppNavHtml(projectPath);

  command = `npm install`;
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
  const json = {
    name: `@bjanderson/${config.name}-ui`,
    version: '0.0.0',
    private: true,
    scripts: {
      ng: 'ng',
      start: 'ng serve',
      build: 'ng build',
      watch: 'ng build --watch --configuration development',
      sass: 'sass --load-path ./node_modules --load-path ./ --no-source-map',
      'sass:material': 'npm run sass src/material.scss ./tmp/material.css',
      'sass:styles': 'npm run sass src/styles.scss ./tmp/styles.css',
      test: 'jest --verbose',
      'test:coverage': 'jest --coverage',
      'test:watch': 'jest --watch',
      updatelink: `npm rm @bjanderson/${config.name}-shared && npm link @bjanderson/${config.name}-shared && ng cache clear`,
    },
  };

  const packageJson = readJsonFile(packageJsonPath);
  const dependencyProjects = [
    ...Object.keys(packageJson.dependencies),
    '@angular/cdk',
    '@angular/material',
    // `@bjanderson/${config.name}-shared`,
    '@bjanderson/utils',
    '@fortawesome/fontawesome-free',
    'luxon',
    'ngx-toastr',
    'uuid',
  ];
  dependencyProjects.sort();

  json.dependencies = {};
  dependencyProjects.forEach((d) => {
    if (packageJson.dependencies[d] && !d.startsWith('@angular')) {
      json.dependencies[d] = packageJson.dependencies[d]
        .replace('~', '')
        .replace('^', '');
    } else {
      json.dependencies[d] = getPackageVersion(d);
    }
  });

  const devDependencyProjects = [
    ...Object.keys(packageJson.devDependencies),
    '@angular/compiler',
    '@angular/compiler-cli',
    '@types/luxon',
    '@types/uuid',
    '@types/jest',
    'jest',
    'jest-preset-angular',
  ];
  devDependencyProjects.sort();

  json.devDependencies = {};
  devDependencyProjects.forEach((d) => {
    if (packageJson.devDependencies[d] && !d.startsWith('@angular')) {
      json.devDependencies[d] = packageJson.devDependencies[d]
        .replace('~', '')
        .replace('^', '');
    } else {
      json.devDependencies[d] = getPackageVersion(d);
    }
  });

  writeJsonFile(packageJsonPath, json, true);
}

function updateAngularJson(path) {
  const angularJsonPath = getPath([path, 'angular.json']);
  const angularJson = readJsonFile(angularJsonPath);
  angularJson.projects.ui.architect.build.options.styles = [
    'node_modules/@fortawesome/fontawesome-free/css/all.min.css',
    'node_modules/ngx-toastr/toastr.css',
    'src/material.scss',
    'src/styles.scss',
  ];
  angularJson.projects.ui.architect.build.options.stylePreprocessorOptions = {
    includePaths: ['src/styles'],
  };
  writeJsonFile(angularJsonPath, angularJson, true);
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

function updateIndexHtml(path) {
  const path = getPath([path, 'src', 'index.html']);
  let html = readFile(path);
  html = parseTemplate(html);
  writeFile(path, html, true);
}

function updateAppNavHtml(path) {
  const path = getPath([
    path,
    'src',
    'components',
    'app-nav',
    'app-nav.component.html',
  ]);
  let html = readFile(path);
  html = parseTemplate(html);
  writeFile(path, html, true);
}
