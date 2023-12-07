// Redis utils

import { promisify } from 'util';
import redis from 'redis';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (err) => {
      console.error(`Error: ${err}`);
    });
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    const getAsync = promisify(this.client.get).bind(this.client);
    try {
      const value = await getAsync(key);
      return value;
    } catch (err) {
      throw new Error(`Error: ${err}`);
    }
  }

  async set(key, val, duration) {
    const setAsync = promisify(this.client.set).bind(this.client);
    try {
      await setAsync(key, val, 'EX', duration);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }

  async del(key) {
    const delAsync = promisify(this.client.del).bind(this.client);
    try {
      await delAsync(key);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
