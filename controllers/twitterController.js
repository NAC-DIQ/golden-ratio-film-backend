// Get User Tweet timeline by user ID
// https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/quick-start

const { response } = require('express');
const needle = require('needle');

// this is the ID for @TwitterDev
const userId = '1103926767905955840';
const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=15&exclude=retweets%2Creplies&tweet.fields=attachments%2Cauthor_id%2Ccreated_at&expansions=attachments.media_keys%2Cauthor_id&media.fields=preview_image_url%2Ctype%2Curl&user.fields=name%2Cusername`;

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const bearerToken = process.env.BEARER_TOKEN;

const getUserTweets = async (req, res) => {
  let userTweets = [];

  // we request the author_id expansion so that we can print out the user name later
  let params = {
    max_results: 15,
    'tweet.fields': 'attachments,author_id,created_at,public_metrics',
    'media.fields': 'preview_image_url,type,url',
    'user.fields': 'name,username,profile_image_url,verified',
    expansions: 'attachments.media_keys,author_id',
    exclude: 'retweets,replies',
  };

  const options = {
    headers: {
      'User-Agent': 'v2UserTweetsJS',
      authorization: `Bearer ${bearerToken}`,
    },
  };

  let hasNextPage = true;
  let nextToken = null;
  let userName;
  console.log('Retrieving Tweets...');

  let resp = await getPage(params, options, nextToken);

  res.send(resp);
};

const getPage = async (params, options, nextToken) => {
  if (nextToken) {
    params.pagination_token = nextToken;
  }

  try {
    const resp = await needle('get', url, params, options);
    console.log(url);
    if (resp.statusCode != 200) {
      console.log(`${resp.statusCode} ${resp.statusMessage}:\n${resp.body}`);
      return;
    }
    return resp.body;
  } catch (err) {
    throw new Error(`Request failed: ${err}`);
  }
};

module.exports = {
  getUserTweets,
};
