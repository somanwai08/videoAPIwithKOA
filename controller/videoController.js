const {Video,VideoComment} = require(`../model`)

module.exports.getVideoList = async(ctx)=>{
          const userId = ctx.request.params.userId
    const {pageSize=2,pageNum=1}=ctx.request.query
    const dbBack = await Video.find({user:userId},[
       "title",
    "vodvideoId",
    "createAt",
    "updatedAt",
    ]).skip(pageSize*(pageNum-1)).limit(pageSize)

    ctx.body = dbBack
}

exports.getVideoDetail = async (ctx)=>{
    console.log(ctx.request.params)
    const videoId = ctx.request.params.videoId
         const dbBack = await Video.findById(videoId).populate('user')
          
         if(dbBack){
            const vodId = dbBack._doc.vodvideoId
            const {getVideoUrl2} =require('./vodController')
            const url = await getVideoUrl2(vodId)
            dbBack._doc.url=url
            console.log(dbBack._doc,'dbBack._doc.url');

         }else{
            ctx.throw(404,'video not found')
         }
         
         
}

exports.comment = async (ctx) =>{
       const videoId = ctx.params.videoId
       const userId = ctx.user._id
       const content = ctx.request.body.content

    //    查看是否有該段視頻
       const dbBack1 = await Video.findById(videoId)
       
       if(dbBack1){
                const document = new VideoComment({
                    user:userId,
                    video:videoId,
                    content,
                })

                const dbBack = await document.save()

                if(dbBack){
                    // 該段視頻的comment數加1
                    const data = await Video.findById(videoId)
                    data.commentCount++
                    await data.save()

                    // Redis熱度排名+2

                    // 返回狀態給客戶端
                    ctx.body='評論成功'
                }else{
                     ctx.status = 500
                     ctx.body = '添加評論失敗'
                }
       }else{
        ctx.status=404
        ctx.body='視頻不存在'
       }
       
 


}