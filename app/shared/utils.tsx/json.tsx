export function JSONParseWithDates(data: string) {
  return JSON.parse(data, (key, value) => {
    if (key.endsWith("At")) {
      return Date.parse(value);
    }
    return value;
  });
}
