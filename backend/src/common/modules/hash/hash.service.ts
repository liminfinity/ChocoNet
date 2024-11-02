import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class HashService {
  /**
   * Generates a hash for the given data using bcrypt.
   *
   * @param data - The data to hash, which can be a string or a Buffer.
   * @param saltRound - The number of rounds to process the data for generating the salt. Default is 10.
   * @returns A promise that resolves to the hashed string.
   */
  async hash(data: string | Buffer, saltRound = 10): Promise<string> {
    return hash(data, saltRound);
  }
  /**
   * Compares the given data with the given hash using bcrypt.
   *
   * @param data - The data to compare, which can be a string or a Buffer.
   * @param hash - The hash to compare with.
   * @returns A promise that resolves to true if the data matches the hash, or false otherwise.
   */
  async compare(data: string | Buffer, hash: string): Promise<boolean> {
    return compare(data, hash);
  }
}
