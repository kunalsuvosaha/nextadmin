import fs from 'fs';
import path from 'path';

const dataDirectory = path.join(process.cwd(), 'data');

export function getFilePath(collectionName) {
  return path.join(dataDirectory, `${collectionName}.json`);
}

export function readData(collectionName) {
  const filePath = getFilePath(collectionName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const fileContents = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(fileContents);
  } catch (error) {
    return [];
  }
}

export function writeData(collectionName, data) {
  const filePath = getFilePath(collectionName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}
