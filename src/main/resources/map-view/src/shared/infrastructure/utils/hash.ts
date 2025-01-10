export const hash = (source: string) =>
  [...source]
    .reduce((hash, c) => (Math.imul(31, hash) + c.charCodeAt(0)) | 0, 0)
    .toString();
