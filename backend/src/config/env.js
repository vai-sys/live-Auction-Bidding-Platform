const dotenv=require("dotenv");

dotenv.config();


const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,

  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
  MONGO_URI :process.env.MONGO_URI
};



module.exports= env;
