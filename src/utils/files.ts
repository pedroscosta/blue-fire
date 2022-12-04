export function stripExtension(fileName: string) {
  return fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
}
