export const validator = (x: string) =>
  x.length > 0 ? ({ valid: true } as const) : ({ valid: false, errorText: 'Invalid' } as const);
