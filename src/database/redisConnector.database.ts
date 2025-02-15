import { Redis } from '@upstash/redis';
import { DatabaseConnector } from './databaseConnector.database';
import {
  InternalServerErrorException,
  NotImplementedException,
} from '@nestjs/common';

export class RedisConnector extends DatabaseConnector<Redis> {
  private db!: Redis;

  connect(): Redis {
    const redisToken = process.env.REDIS_TOKEN;

    if (!redisToken) {
      throw new InternalServerErrorException(
        'Could not connect to redis database.',
      );
    }
    const redis = new Redis({
      url: 'https://moving-warthog-57927.upstash.io',
      token: process.env.REDIS_TOKEN,
    });

    this.db = redis;

    return redis;
  }

  query(): Redis {
    if (!this.db) {
      throw new InternalServerErrorException(`Connect Db First!`);
    }
    return this.db;
  }

  disconnect() {
    throw new NotImplementedException();
  }
}
