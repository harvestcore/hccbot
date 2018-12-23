console.log('HCC\'s Mastodon BOT');

require('dotenv').config();
const Mastodon = require('mastodon-api');
const GitHub = require('github-api');

const GH = new GitHub({
    token: process.env.GITHUB_TOKEN
});

const M = new Mastodon({
    client_key: process.env.CLIENT_KEY,
    client_secret: process.env.CLIENT_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    timeout_ms: 60 * 1000,
    api_url: 'https://botsin.space/api/v1/'
});

const listener = M.stream('streaming/user');
listener.on('error', err => console.log(err));

function postToot(params) {
    M.post('statuses', params, (error, data) => {
        if (error) {
            console.error(error);
        } else {
            console.log(data);
        }
    });
}

function favToot(id) {
    M.post(`statuses/${id}/favourite`, (error, data) => {
        if (error) console.error(error);
        else console.log(`Favorited ${id} ${data.id}`);
    });
}

function reblogToot(id) {
    M.post(`statuses/${id}/reblog`, (error, data) => {
        if (error) console.error(error);
        else console.log(`Reblogged ${id} ${data.id}`);
    });
}

listener.on('message', msg => {
    if (msg.event === 'notification') {
        const acct = msg.data.account.acct;
        
        if (msg.data.type === 'follow') {
            postToot({status: `@${acct} Welcome`});
        } else if (msg.data.type === 'mention') {
            const regex1 = /(like|favou?rite|❤)/i;
            const content = msg.data.status.content;
            const id = msg.data.status.id;
            if (regex1.test(content)) {
                favToot(id);
            }

            const regex2 = /(boost|reblog|retweet)/i;
            if (regex2.test(content)) {
                reblogToot(id);
            }
        }
    }
});

function checkPush() {
    // check if user has pushed some commits
}
