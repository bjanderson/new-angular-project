import { config, parseTemplate } from './config.mjs';
import { createDirectoryIfNotExists, readFile, writeFile } from './file-io.mjs';

const folder = 'src/interfaces';
createDirectoryIfNotExists(folder);

const interfaceTemplate = `export interface IPascalCase {
  id: string;
};
`;

const interfaceFileName = parseTemplate(`${folder}/kabab-case.interface.ts`);
const interfaceTxt = parseTemplate(interfaceTemplate);
writeFile(interfaceFileName, interfaceTxt);

const indexFile = `${folder}/index.ts`;
const index = readFile(indexFile);
let exports = index.split('\n');
exports.push(`export * from './${config.kabab}.interface';`);
exports = exports.filter((v, i, a) => a.indexOf(v) === i);
exports.sort();
writeFile(indexFile, exports.join('\n'), true);
