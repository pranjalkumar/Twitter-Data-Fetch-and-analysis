const express = require('express');
const router = express.Router();
const tweet_controller=require('../controllers/tweet_controller.js');


// routes dealing with product collection
router.post('/search_tweets',tweet_controller.storeTweet);
router.post('/tweets/filter',tweet_controller.getTweet);
router.post('/tweets/sort',tweet_controller.sort);
module.exports = router;

