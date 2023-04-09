export function genericTypeGuard<T>(value: any, expectedType: string | string[]): T | undefined {
  return (
    typeof expectedType === 'string'
      ? typeof value === expectedType
      : expectedType.includes(typeof value)
  )
    ? value
    : undefined;
}
