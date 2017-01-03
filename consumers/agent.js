/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T21:08:41+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-05-06T22:20:52+08:00
* @License: The MIT License (MIT)
*/


require('babel-core/register')({
  presets: ['es2015-node5', 'stage-3'],
});
require('babel-polyfill');


const Queue = require('bull');
const request = require('superagent');
const co = require('co');

const config = require('../src/config');


const agentQueue = Queue(
  `${config.queue.name}:agent`,
  config.queue.port,
  config.queue.hostname,
  {
    db: config.queue.db,
  }
);

agentQueue.process((msg, done) => {
  console.log('agent receive event ', msg.data);
  co(function *() {
    switch (msg.data.type) {
      case 'user.sync':
      case 'user.add':
      case 'user.update':
        request
          .post(msg.data.callback)
          .send(msg.data)
          .set('authorization', `oauth ${msg.data.identify}`)
          .end((err) => {
            if (err) {
              console.log(`${msg.data.callback} return error`, err);
              done(err);
              return;
            }
            console.log(`${msg.data.callback} send success`);
            done();
          });
        break;
      default:
        break;
    }
  })
  .catch((err) => {
    console.log(err);
    done(err);
  });
});
