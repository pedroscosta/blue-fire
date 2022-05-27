/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
import { app } from 'electron';

const fs = require('fs').promises;

const packageJson = require('../../../package.json');

export function getAppVersion() {
  return process.env.NODE_ENV === 'development'
    ? packageJson.version
    : app.getVersion();
}

export function saveStoreContents(store, filePath) {
  filePath = filePath || store.projectData.path;

  store.projectData.version = getAppVersion();
  store.projectData.path = filePath;

  const data = new Uint8Array(Buffer.from(JSON.stringify(store))); // TODO: Maybe add a compression algorithm

  fs.writeFile(filePath, data, (err) => {
    if (err) throw err;
  });
}
