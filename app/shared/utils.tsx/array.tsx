export const sameElements = <T extends string | number>(a: T[], b: T[]) => {
  return a.length === b.length && a.every((v, i) => v === b[i]);
};
