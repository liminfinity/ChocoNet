export const createOrigin = (host: string, port: number, protocol = 'http'): string =>
  `${protocol}://${host}:${port}`;
