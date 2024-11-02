/**
 * Constructs an origin URL string from the given host, port, and protocol.
 *
 * @param host - The hostname or IP address.
 * @param port - The port number.
 * @param protocol - The protocol to use (default is 'http').
 * @returns The constructed origin URL as a string.
 */
export const createOrigin = (host: string, port: number, protocol = 'http'): string =>
  `${protocol}://${host}:${port}`;
