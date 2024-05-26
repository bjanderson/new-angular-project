import { execSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

export function getPath(segments) {
  return resolve(...segments);
}

export function createDirectory(path) {
  try {
    mkdirSync(path, { recursive: true });
  } catch (err) {
    console.error(`Failed to create directory: ${path}`);
    console.error(err);
    process.exit(1);
  }
}

export function pathExists(path) {
  return existsSync(path);
}

export function createDirectoryIfNotExists(path) {
  if (!pathExists(path)) {
    createDirectory(path);
  }
}

export function readFile(fileName) {
  try {
    const fileContents = readFileSync(fileName, { encoding: 'utf-8' });
    return fileContents;
  } catch (error) {
    return '';
  }
}

export function readJsonFile(filename) {
  if (pathExists(filename)) {
    try {
      const str = readFile(filename);
      return JSON.parse(str);
    } catch (err) {
      console.error(`ERROR: Could not read file ${filename}`);
      return {};
    }
  }
  return {};
}

export function writeFile(file, text, overwrite = false) {
  if (!overwrite && pathExists(file)) {
    console.error(`${file} already exists. Enter a different name.`);
    process.exit(1);
  }
  try {
    writeFileSync(file, text, { encoding: 'utf-8' });
  } catch (err) {
    console.error(`Failed to write file: ${file}`);
    console.error(err);
    process.exit(1);
  }
}

export function writeJsonFile(filename, json, overwrite = false) {
  const str = JSON.stringify(json, null, 2);
  writeFile(filename, str, overwrite);
}

export function execute(command, dir) {
  try {
    if (dir == null) {
      return execSync(command).toString().trim();
    } else {
      return execSync(command, { cwd: dir }).toString().trim();
    }
  } catch (err) {
    console.error(`Error executing command: ${command}`);
    console.error(err.toString());
    return '';
  }
}
