require('dotenv').config();
const Mastodon = require('mastodon-api');


const M = new Mastodon({
    client_key: process.env.CLIENT_KEY,
    client_secret: process.env.CLIENT_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    timeout_ms: 60 * 1000,
    api_url: 'https://botsin.space/api/v1/'
});

function postToot(params) {
    M.post('statuses', params, (error, data) => {
        if (error) {
            console.error(error);
        } else {
            console.log(data);
        }
    });
}


const params = {
    status: 'howdy'
};

postToot(params);