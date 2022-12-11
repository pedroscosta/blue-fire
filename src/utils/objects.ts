export function cleanUndefinedProps(obj: any) {
  Object.keys(obj).forEach((key) => (obj[key] === undefined ? delete obj[key] : {}));
  return obj;
}
