const mongoose=require('mongoose');
//for exporting the data in csv format
const mongoose_csv = require('mongoose-csv');
// tweet schema
const tweet_recordSchema= mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    tweet_text:{type:String},
    tweet_username:{type:String},
    tweet_user_screenname:{type:String},
    retweet_count:{type:Number},
    tweet_fav_count:{type:Number},
    tweet_language:{type:String},
    tweet_date:{type:Date},
    user_followers_count:{type:Number},
    users_mentions_count:{type:Number},
    url:{type:String}
});
//adding the plugin
tweet_recordSchema.plugin(mongoose_csv);

const tweet_record=mongoose.model('tweet_record',tweet_recordSchema);

module.exports={
    tweet_record:tweet_record
}
// module.exports=mongoose.model('Product',productSchema);