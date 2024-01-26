const defaultConfig = require('../config/config.default')
const mongoose = require('mongoose')
const user_Schema = require('./userModel')
const subscribe_Schema = require('./subscribeModel')
const video_Schema = require("./videoModel")
const videoComment_Scheme = require('./videoCommentModel')

      

    mongoose.connect(defaultConfig.mongoosePath).then(res=>{
        console.log('mongodb connected');
    })



module.exports={
    User:mongoose.model('User',user_Schema),
    Subscribe:mongoose.model('SubscribeRecords',subscribe_Schema),
    Video:mongoose.model('Video',video_Schema),
    VideoComment:mongoose.model('VideoComments',videoComment_Scheme)
    
}