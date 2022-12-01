import Redis, { type Redis as RedisType, type RedisOptions } from "ioredis";
import invariant from "tiny-invariant";

let redis: RedisType;

declare global {
  var __redis: RedisType | undefined;
}

const redisOptions: RedisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
};

invariant(process.env.REDIS_URL, "REDIS_URL is required");
const redisURL = process.env.REDIS_URL;

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the Redis with every change either.
if (process.env.NODE_ENV === "production") {
  redis = new Redis(redisURL, redisOptions);
} else {
  if (!global.__redis) {
    global.__redis = new Redis(redisURL, redisOptions);
  }
  redis = global.__redis;
}

export default redis;
