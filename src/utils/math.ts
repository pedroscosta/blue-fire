export function applyToObject(o: any, f: (v: any) => any) {
  return Object.fromEntries(Object.entries(o).map(([k, v]: [k: any, v: any]) => [k, f(v)]));
}

export function roundObject(o: any) {
  return Object.fromEntries(
    Object.entries(o).map(([k, v]: [k: any, v: any]) => [k, Math.round(v)]),
  );
}
