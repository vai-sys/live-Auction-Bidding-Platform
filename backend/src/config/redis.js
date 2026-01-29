

const { Redis } = require("@upstash/redis");
const env = require("./env");

const redis = new Redis({
   url: env.UPSTASH_REDIS_URL,
  token: env.UPSTASH_REDIS_TOKEN,
});

module.exports = redis;
