/* eslint-disable import/prefer-default-export */
export function stripFileExtension(filename) {
  return filename.substring(0, filename.lastIndexOf('.')) || filename;
}

export function getFileFromPath(path) {
  return path.split(/[\\/]+/).pop();
}
