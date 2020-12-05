export function normaliseArrayArg(arg) {
  return arg && !Array.isArray(arg) ? [arg] : arg || [];
}
