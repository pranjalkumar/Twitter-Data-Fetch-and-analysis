'use strict';
const mongoose=require('mongoose');
const tweet_record=require('../models/tweet').tweet_record;
require('dotenv').load();
const twitter= require('twitter');

// estabilishing the connection
const client= new twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

// getting the tweet data and storing the record in the database

exports.storeTweet= async (req,res) => {

    let query=req.body.query;
    // res.json({
    //     tweet:tweets.statuses[0]
    // })
    // console.log(query);
    await client.get('search/tweets', {q: query}, function(error, tweets, response) {
        tweets.statuses.forEach(function (tweet) {
            // console.log(tweet);
            let tweet_text=tweet.text;
            let tweet_username=tweet.user.name;
            let tweet_user_screenname=tweet.user.screen_name;
            let retweet_count=tweet.retweet_count;
            let tweet_fav_count=tweet.favorite_count;
            let tweet_language=tweet.lang;
            let tweet_date=tweet.created_at;
            let user_followers_count=tweet.user.followers_count;
            let users_mentions_count=tweet.entities.user_mentions.length;
            let url=tweet.user.url;

            const tweet_data=new tweet_record({
                _id: new mongoose.Types.ObjectId(),
                tweet_text:tweet_text,
                tweet_username:tweet_username,
                tweet_user_screenname:tweet_user_screenname,
                retweet_count:retweet_count,
                tweet_fav_count:tweet_fav_count,
                tweet_language:tweet_language,
                tweet_date:tweet_date,
                user_followers_count:user_followers_count,
                users_mentions_count:users_mentions_count,
                url:url
            });

            tweet_data.save((err,result)=>{
                if(err){
                    res.status(500).json({
                        success:false,
                        message: 'sorry! something happened, please try again'
                    });
                }
            });
        });

    });

    res.status(200).json({
        success:true,
        message: 'Tweets record inserted'
    });

};

// getting the tweets on the basis of filter
exports.getTweet=(req,res)=>{
    let page_num=req.body.page_num;
    let filter_data_type=req.body.filter_data_type;
    let filter_param=req.body.filter_param;
    let filter_type=req.body.filter_type;
    let filter_value=req.body.filter_value;

    if(filter_data_type=='string'){
        stringFilter(res,page_num,filter_type,filter_param,filter_value);
    }else if(filter_data_type=='number'){
        numberFilter(res,page_num,filter_type,filter_param,filter_value);
    }else if(filter_data_type=='date'){
        DateFilter(res,page_num,filter_type,filter_param,filter_value);
    }else{
        res.status(400).json({
            success:false,
            message: 'Invalid filter data type'
        });
    }
};

function stringFilter(res,page_num,filter_type,filter_param,filter_value) {
    let query={};

    if(filter_type=='start'){
        filter_value= new RegExp("^"+filter_value,'i');
        query[filter_param]=filter_value;
        tweet_record.find(query)
            .limit(10)
            .skip(page_num*10)
            .exec((err,result)=>{
            if(err){
                res.status(500).json({
                    success:false,
                    message: 'sorry! could not find matching '+filter_param +" with the value"+filter_value
                });
            }else {
                res.status(200).json({
                    success: true,
                    message: 'Matching record found',
                    data: result
                });
            }
        });
    }else if(filter_type=='end'){
        filter_value= new RegExp(filter_value+"$",'i');

        query[filter_param]=filter_value;
        tweet_record.find(query)
            .limit(10)
            .skip(page_num*10)
            .exec((err,result)=>{
            if(err){
                res.status(500).json({
                    success:false,
                    message: 'sorry! could not find matching '+filter_param +" with the value "+filter_value
                });
            }else {
                res.status(200).json({
                    success: true,
                    message: 'Matching record found',
                    data: result
                });
            }
        });
    }else if(filter_type=='contain'){
        filter_value= new RegExp(filter_value,'i');

        query[filter_param]=filter_value;
        tweet_record.find(query)
            .limit(10)
            .skip(page_num*10)
            .exec((err,result)=>{
            if(err){
                res.status(500).json({
                    success:false,
                    message: 'sorry! could not find matching '+filter_param +" with the value "+filter_value
                });
            }else {
                res.status(200).json({
                    success: true,
                    message: 'Matching record found',
                    data: result
                });
            }
        });
    }else if(filter_type=='exact'){

        query[filter_param]=filter_value;
        tweet_record.find(query)
            .limit(10)
            .skip(page_num*10)
            .exec((err,result)=>{
            if(err){
                res.status(500).json({
                    success:false,
                    message: 'sorry! could not find matching '+filter_param +" with the value "+filter_value
                });
            }else {
                res.status(200).json({
                    success: true,
                    message: 'Matching record found',
                    data: result
                });
            }
        });
    }else{
        res.status(400).json({
            success:false,
            message: 'Invalid filter type'
        });
    }
}

function numberFilter(res,page_num,filter_type,filter_param,filter_value) {
    let query={};

    if(filter_type=='less'){
        query[filter_param]={'$lt':filter_value};
        tweet_record.find(query)
            .limit(10)
            .skip(page_num*10)
            .exec((err,result)=>{
            if(err){
                res.status(500).json({
                    success:false,
                    message: 'sorry! could not find matching '+filter_param +" with the value "+filter_value
                });
            }else {
                res.status(200).json({
                    success: true,
                    message: 'Matching record found',
                    data: result
                });
            }
        });
    }else if(filter_type=='greater'){
        query[filter_param]={'$gt':filter_value};
        tweet_record.find(query)
            .limit(10)
            .skip(page_num*10)
            .exec((err,result)=>{
                if(err){
                            res.status(500).json({
                                success:false,
                                message: 'sorry! could not find matching '+filter_param +" with the value "+filter_value
                            });
                        }else {
                            res.status(200).json({
                                success: true,
                                message: 'Matching record found',
                                data: result
                            });
                        }
            });
    }else if(filter_type=='equal'){
        query[filter_param]=filter_value;
        tweet_record.find(query)
            .limit(10)
            .skip(page_num*10)
            .exec((err,result)=>{
            if(err){
                res.status(500).json({
                    success:false,
                    message: 'sorry! could not find matching '+filter_param +" with the value "+filter_value
                });
            }else {
                res.status(200).json({
                    success: true,
                    message: 'Matching record found',
                    data: result
                });
            }
        });
    }else{
        res.status(400).json({
            success:false,
            message: 'Invalid filter type'
        });
    }
}

function DateFilter(res,page_num,filter_type,filter_param,filter_value) {
    let start_date=filter_value.start;
    let end_date=filter_value.end;

}

exports.sort=(req,res)=>{
    let order_param=req.body.order_param;
    let page_num=req.body.page_num;
    let order_type=req.body.order_type;
    let query={};
    if(order_type=='decending'){
        query[order_param]=-1;
    }else if(order_type=='accending'){
        query[order_param]=1;
    }else{
        res.status(400).json({
            success:false,
            message: 'Invalid order type'
        });
    }
    tweet_record.find({})
        .sort(query)
        .limit(10)
        .skip(page_num*10)
        .exec((err,result)=>{
            if(err){
                res.status(500).json({
                    success:false,
                    message: 'sorry! could not fetch all results'
                });
            }else {
                res.status(200).json({
                    success: true,
                    message: 'Matching record found',
                    data: result
                });
            }
        });
}