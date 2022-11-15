const redis = require('ioredis');
const dotenv = require('dotenv');

dotenv.config();

let redisClient;
let redisCache;

try{
  redisClient = new redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    retryStrategy(times) {
      console.log("Redis reconnect retry : " + times);
      const delay = Math.min(times * 500, 2000);
      return delay;
    },
    maxRetriesPerRequest: 1,
  });

  redisClient.on('connect', function () {
    console.log('Connected to redis instance : ' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT);
  });

  redisClient.on("error", (error) => {
    console.log(error);
  });
} catch(err){
  console.log(err);
}

try{
  redisCache = require('express-redis-cache')({ client: redisClient, expire: parseInt(process.env.REDIS_EXPIRE), prefix: process.env.REDIS_PREFIX });

  redisCache.on('connect', function () {
    console.log('Redis Cache is connected to redis instance : ' + process.env.REDIS_HOST + ':' + process.env.REDIS_PORT);
  });

  redisCache.on('error', (error) => {
    console.log(error);
  });
} catch(err){
  console.log(err);
}

module.exports = redisCache;