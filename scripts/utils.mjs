import { execute } from './file-io.mjs';

export function getPackageVersion(packageName) {
  const command = `npm show ${packageName} version`;
  return execute(command) || '*';
}
