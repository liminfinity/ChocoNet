import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class HashService {
  async hash(data: string | Buffer, saltRound = 10): Promise<string> {
    return hash(data, saltRound);
  }
  async compare(data: string | Buffer, hash: string): Promise<boolean> {
    return compare(data, hash);
  }
}
