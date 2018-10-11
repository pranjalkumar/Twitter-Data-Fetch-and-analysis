const express = require('express');
const router = express.Router();
const tweet_controller=require('../controllers/tweet_controller.js');


// routes dealing with product collection

//adding tweets
router.post('/search_tweets',tweet_controller.storeTweet);

//filtering tweets on the basis of string,numeric and date filter
router.post('/tweets/filter',tweet_controller.getTweet);

//sorting tweets on the basis of various columns
router.post('/tweets/sort',tweet_controller.sort);

module.exports = router;

