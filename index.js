'use strict';

const Koa = require('koa');
const app = new Koa();
const Router = require('@koa/router');
require('dotenv').config()
const axios = require('axios');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const {google} = require('googleapis');


const router = new Router();

const data = {
    grant_type: 'client_credentials'
};

router.get('koa-example', '/', (ctx) => {
  ctx.body = 'Hello World';
});

router.get('test', '/test', async (ctx) => {
    ctx.body = 'OK'
})

router.get('search', '/spotify-search', async (ctx) => {

    const url = 'https://accounts.spotify.com/api/token';

    let config = {
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    let res = await axios.post(url, data, config)

    let {track} = ctx.request.query;

    const config2 = {
        params: {
            q: `track:${track}`,
            type: 'track',
            limit: 5
        },
        headers: {
            'Authorization': `Bearer ${res.data.access_token}`
        }
    }

    let res2 = await axios.get('https://api.spotify.com/v1/search', config2)

    ctx.body = res2.data;
});

router.get('search', '/youtube-search', async (ctx) => {
    let {track} = ctx.request.query;

    const youtube = google.youtube({
        version: 'v3',
        auth: process.env.GOOGLE_APPLICATION_CREDENTIALS
    });

    const res = await youtube.search.list({
        q: track,
        part: 'snippet',
        topic: '/m/04rlf'
    })

    ctx.body = res.data
});

app
  .use(bodyParser())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());
 

app.listen(8000);