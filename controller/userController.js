const {User,Subscribe} = require(`../model`)
const {createToken} = require('../util/jwt')


module.exports.subscribeList = async(ctx)=>{
    const userId = ctx.request.params.userId
    const dbBack = await Subscribe.find({user:userId}).populate('channel',[
        'username',
      'image',
      'cover',
      'channeldes',
      'subscribrCount',
    ])
    console.log(dbBack,'dbBack');
    ctx.body = dbBack
}

module.exports.subscribeChannel = async (ctx)=>{
        //   登錄用戶的id
        const userId = ctx.user._id
        
        // 訂閱的頻道id
        const channelId = ctx.request.params.channelId
        if(userId===channelId){
              ctx.status=403
              ctx.body = {msg:"不能關注自己"}
        }else{
            const dbBack = await Subscribe.findOne({user:userId,channel:channelId})
       if(dbBack){
        ctx.status=403
        ctx.body={msg:"你已關注此用戶！"}
       }else{
                 //數據入庫
               const dbBack1 =await new Subscribe({user:userId,channel:channelId}).save()

                 //被關注的人subscribeCount+1
                const doc = await User.findById(channelId)
                    doc.subscribrCount++
                 await  doc.save()

                console.log(dbBack1,'dbback1');
                if(dbBack1){
                    ctx.body = {msg:'關注成功'}
                }
       }
        }
}

module.exports.getChannel = async(ctx)=>{
    // 要查詢的頻道id
     const channelId = ctx.request.params.userId
    //  查詢的用戶id
    const registerUserId = ctx.user? ctx.user._id : null
    if(registerUserId){
         const dbBack = await Subscribe.findOne({user:registerUserId,channel:channelId})
         const channelInfo = await User.findById(channelId,[
            "username",
            "image",
            "cover",
            "channeldes"

         ])

         console.log(dbBack,'dbBack');
         if(dbBack){
            channelInfo._doc.isSubscribe=true
         }else{
            channelInfo._doc.isSubscribe=false
         }
         ctx.body = channelInfo._doc
    }else{
        const dbBack1 = await User.findById(channelId)
        ctx.body = dbBack1
    }
 

}


module.exports.register = async (ctx)=>{
    
    //    數據入庫
    const userModel = new User(ctx.request.body)
    const dbBack = await userModel.save()
    // console.log(ctx.request.body);
    console.log(dbBack,'dbback');
    ctx.body = dbBack
}

module.exports.login = async (ctx)=>{
        //  查找數據庫看看是否有這個用戶
        const dbBack = await User.findOne(ctx.request.body)
        if(!dbBack){
           return ctx.throw(404,'用戶名或密碼錯誤')
        }else{
            // 簽發token
            // 注意：想要加密用戶信息，不能直接加密dbBack，只能加密dbBack._doc
           const jwt = createToken(dbBack._doc)
            ctx.body={msg:'登錄成功',dbBack,jwt}
        }
       
}


module.exports.dealWithUser = async (ctx,next)=>{
    console.log('this is to deal with user function');
    console.log(ctx,'ctx');
    console.log(ctx.params.userId,'ctx.params.userId');
    const user = await User.findById(ctx.params.userId)

    ctx.body = user

}