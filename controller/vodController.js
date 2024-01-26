var RPCClient = require('@alicloud/pop-core').RPCClient
const{accessKeyID,accessKeySecret}=require('../util/key')


function initVodClient(accessKeyId1,accessKeySecret1){
    var regionId = 'cn-shanghai'
    var client = new RPCClient({
        accessKeyId:accessKeyId1,
        accessKeySecret:accessKeySecret1,
        // accessKeyId,
        // accessKeySecret,
        endpoint:'http://vod.'+regionId+'.aliyuncs.com',
        apiVersion:'2017-03-21'
    })

    return client
}

exports.getvod = async (ctx)=>{
       
    var client = initVodClient(accessKeyID,accessKeySecret)

    const vodback =  await client.request("CreateUploadVideo",{
        Title:ctx.request.query.title,
        FileName:ctx.request.query.FileName
     },{})

     console.log(vodback,'vodback');
     ctx.body = vodback
}

const getVideoUrl1 = async(id)=>{

    var client = initVodClient(accessKeyID,accessKeySecret)

    const vodback =  await client.request("GetPlayInfo",{
        VideoId:id,
     },{})


     return vodback.PlayInfoList.PlayInfo[0].PlayURL
}

exports.getVideoUrl = async (ctx) =>{
    const videoId = ctx.request.url.split('/')[ctx.request.url.split('/').length-1]
    
    const url = await getVideoUrl1(videoId)


    ctx.body = url
}

module.exports.getVideoUrl2=getVideoUrl1