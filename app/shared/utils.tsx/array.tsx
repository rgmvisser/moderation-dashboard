export const sameElements = <T extends any>(a: T[], b: T[]) => {
  return a.length === b.length && a.every((v, i) => v === b[i]);
};
