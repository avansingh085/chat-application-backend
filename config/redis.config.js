const  { Redis } =require('@upstash/redis');
const {REDIS_ENDPOINT,REDIS_PASS}=require('./server.config.js');
const redis = new Redis({
  url: REDIS_ENDPOINT,
  token: REDIS_PASS
})


module.exports=redis;