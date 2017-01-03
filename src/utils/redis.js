/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-14T10:30:37+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-04-12T17:42:18+08:00
* @License: The MIT License (MIT)
*/


import Redis from 'ioredis';
import uuid from 'uuid';
import { Store } from 'koa-session2';


export default class RedisStore extends Store {
  constructor(host, port, db, key, ttl) {
    super();
    this.redis = new Redis({
      host: host,
      port: port,
      db: db,
    });
    this.key = key;
    this.redis.on('error', (err) => {
      throw err;
    });
    this.ttl = ttl;
  }

  getId(sid) {
    return `${this.key}:${sid}`;
  }

  async get(sid) {
    const data = await this.redis.get(`${this.getId(sid)}`);
    return JSON.parse(data);
  }

  async set(session, opts) {
    if (!opts.sid) {
      opts.sid = uuid.v1();
    }
    if (Object.keys(session).length !== 0) {
      await this.redis.setex(`${this.getId(opts.sid)}`, this.ttl, JSON.stringify(session));
    }

    return opts.sid;
  }

  async destory(sid) {
    return await this.redis.del(this.getId(sid));
  }
}
