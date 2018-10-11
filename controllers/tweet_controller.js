'use strict';
const mongoose=require('mongoose');
const tweet_record=require('../models/tweet').tweet_record;
require('dotenv').load();
const twitter= require('twitter');

// establish the connection with twitter API
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
            //extracting various parameter in twitter returned response
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

            // storing those response
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

    // getting the required parameter from the user
    let page_num=req.body.page_num;
    let filter_data_type=req.body.filter_data_type;
    let filter_param=req.body.filter_param;
    let filter_type=req.body.filter_type;
    let filter_value=req.body.filter_value;
    let csv=req.body.csv;

    //deciding which fucntion to call on the basis of filter data type

    if(filter_data_type=='string'){
        stringFilter(res,page_num,filter_type,filter_param,filter_value,csv);
    }else if(filter_data_type=='number'){
        numberFilter(res,page_num,filter_type,filter_param,filter_value,csv);
    }else if(filter_data_type=='date'){
        DateFilter(res,page_num,filter_type,filter_param,filter_value,csv);
    }else{
        res.status(400).json({
            success:false,
            message: 'Invalid filter data type'
        });
    }
};

// string filter function
function stringFilter(res,page_num,filter_type,filter_param,filter_value,csv) {
    let query={};

    //deciding which operation to perform
    if(filter_type=='start'){
        //forming the query
        filter_value= new RegExp("^"+filter_value,'i');
        query[filter_param]=filter_value;
        // checking whether the user has asked for response in csv form or not
        //displaying output in csv format
        if(csv){
            res.writeHead(200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=sample.csv'
            });

            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .csv(res);
        }
        // displaying output in normal response form
        if(!csv) {
            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .exec((err, result) => {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: 'sorry! could not find matching ' + filter_param + " with the value" + filter_value
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Matching record found',
                            data: result
                        });
                    }
                });
        }

    }else if(filter_type=='end'){
        filter_value= new RegExp(filter_value+"$",'i');

        query[filter_param]=filter_value;

        // checking whether the user has asked for response in csv form or not
        //displaying output in csv format
        if(csv){
            res.writeHead(200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=sample.csv'
            });

            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .csv(res);
        }
        // displaying output in normal response form
        if(!csv) {
            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .exec((err, result) => {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: 'sorry! could not find matching ' + filter_param + " with the value " + filter_value
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Matching record found',
                            data: result
                        });
                    }
                });
        }

    }else if(filter_type=='contain'){
        filter_value= new RegExp(filter_value,'i');

        query[filter_param]=filter_value;
        // checking whether the user has asked for response in csv form or not
        //displaying output in csv format

        if(csv){
            res.writeHead(200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=sample.csv'
            });

            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .csv(res);
        }
        // displaying output in normal response form
        if(!csv) {
            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .exec((err, result) => {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: 'sorry! could not find matching ' + filter_param + " with the value " + filter_value
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Matching record found',
                            data: result
                        });
                    }
                });
        }

    }else if(filter_type=='exact'){

        query[filter_param]=filter_value;

        // checking whether the user has asked for response in csv form or not
        //displaying output in csv format
        if(csv){
            res.writeHead(200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=sample.csv'
            });

            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .csv(res);
        }

        // displaying output in normal response form
        if(!csv) {
            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .exec((err, result) => {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: 'sorry! could not find matching ' + filter_param + " with the value " + filter_value
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Matching record found',
                            data: result
                        });
                    }
                });
        }
    }else{
        res.status(400).json({
            success:false,
            message: 'Invalid filter type'
        });
    }
}

// number filter function
function numberFilter(res,page_num,filter_type,filter_param,filter_value,csv) {
    let query={};

    if(filter_type=='less'){
        query[filter_param]={'$lt':filter_value};

        // checking whether the user has asked for response in csv form or not
        //displaying output in csv format
        if(csv) {

            res.writeHead(200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=sample.csv'
            });

            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .csv(res);
        }
        // displaying output in normal response form
        if(!csv) {

            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .exec((err, result) => {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: 'sorry! could not find matching ' + filter_param + " with the value " + filter_value
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Matching record found',
                            data: result
                        });
                    }
                });
        }

    }else if(filter_type=='greater'){
        query[filter_param]={'$gt':filter_value};
        // checking whether the user has asked for response in csv form or not
        //displaying output in csv format
        if(csv){
            res.writeHead(200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=sample.csv'
            });

            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .csv(res);
        }
        // displaying output in normal response form
        if(!csv) {
            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .exec((err, result) => {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: 'sorry! could not find matching ' + filter_param + " with the value " + filter_value
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Matching record found',
                            data: result
                        });
                    }
                });
        }

    }else if(filter_type=='equal'){
        query[filter_param]=filter_value;

        // checking whether the user has asked for response in csv form or not
        //displaying output in csv format

        if(csv){
            res.writeHead(200, {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=sample.csv'
            });

            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .csv(res);
        }
        // displaying output in normal response form
        if(!csv) {
            tweet_record.find(query)
                .limit(10)
                .skip(page_num * 10)
                .exec((err, result) => {
                    if (err) {
                        res.status(500).json({
                            success: false,
                            message: 'sorry! could not find matching ' + filter_param + " with the value " + filter_value
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            message: 'Matching record found',
                            data: result
                        });
                    }
                });
        }

    }else{
        res.status(400).json({
            success:false,
            message: 'Invalid filter type'
        });
    }
}

// Date filter function

function DateFilter(res,page_num,filter_type,filter_param,filter_value,csv) {
    let start_date=filter_value.start;
    let end_date=filter_value.end;

}

// sorting function

exports.sort=(req,res)=>{
    //taking the required param from the user
    let order_param=req.body.order_param;
    let page_num=req.body.page_num;
    let order_type=req.body.order_type;
    let csv=req.body.csv;
    let query={};

    //deciding the type of order
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

    // checking whether the user has asked for response in csv form or not
    //displaying output in csv format
    if(csv){
        res.writeHead(200, {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename=sample.csv'
        });

        tweet_record.find({})
            .sort(query)
            .limit(10)
            .skip(page_num * 10)
            .csv(res);
    }
    // displaying output in normal response form
    if(!csv) {
        tweet_record.find({})
            .sort(query)
            .limit(10)
            .skip(page_num * 10)
            .exec((err, result) => {
                if (err) {
                    res.status(500).json({
                        success: false,
                        message: 'sorry! could not fetch all results'
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: 'Matching record found',
                        data: result
                    });
                }
            });
    }
}