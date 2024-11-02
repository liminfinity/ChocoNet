import type { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  /**
   * Called once the module has been initialized.
   * Establishes a connection to the database.
   */
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
  /**
   * Called before the application is torn down.
   * Closes the database connection.
   */
  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
