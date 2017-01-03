/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-15T13:39:31+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-06-24T10:25:30+08:00
* @License: The MIT License (MIT)
*/


const express = require('express');
const app = express();
const request = require('superagent');
const cas = {
  name: 'demo',
  secret: '2aa389bc-998b-4a5f-83f0-bdca1fa3e63f',
  identify: '24a03e6e-d1ad-4f11-bd02-566b06b39481',
};

app.get('/', (req, res) => {
  res.redirect(`http://127.0.0.1:3000/public/oauth/authorize?name=${cas.name}&qs=http%3a%2f%2fwww.google.com%26a%3d1`);
});

app.get('/cas/oauth/callback', (req, res) => {
  const code = req.query.code;
  request
  .get(`http://127.0.0.1:3000/oauth/users/self?code=${code}`)
  .set('authorization', `oauth ${cas.secret}`)
  .end((err, r) => {
    if (err) return res.send('2333333333333333333333');
    if (r.body.code !== 0) {
      return res.send(r.body.data.value);
    }
    return res.send(`hello, big brother: ${r.body.data.value.username}`);
  });
});

app.post('/cas/oauth/callback', (req, res) => {
  const authorization = req.headers.authorization;
  // you must check the authorization code , and it should such as `oauth ${cas.identify}`
  if (authorization.split(' ') !== 2) {
    return res.send('authorization format should such as oauth $identify');
  }

  const identify = authorization.split(' ')[1];
  if (identify !== cas.identify) {
    return res.send('fuck you');
  }

  const data = req.body;
  switch (data.type) {
    case 'user.update':
      // revoke on update user
    case ‘user.add’:
      // revoke on add user
    case 'user.delete':
      // revoke on delete user
    case 'user.sync':
      // revoke on every day
    default:
});

app.listen(3001, () => {
  console.log('Example app listening on port 3001!');
});
