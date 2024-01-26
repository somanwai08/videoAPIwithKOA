const Router = require('@koa/router')

const router = new Router({prefix:'/api/v1'})
const userController = require('../controller/userController')
const {registerValidate,loginValidate} = require('../middleware/userValidate')
const {verifyToken}=require('../util/jwt')



router.get('/user/:userId',userController.dealWithUser)
router.post('/user/register',registerValidate,userController.register)
router.post('/user/login',loginValidate,userController.login)
router.get('/user/getchannel/:userId',verifyToken(false),userController.getChannel)
router.get('/user/subscribe/:channelId',verifyToken(true),userController.subscribeChannel)
router.get('/user/subscribeList/:userId',verifyToken(true),userController.subscribeList)


const vodController = require('../controller/vodController')
// 獲取上傳視頻憑證
router.get('/video/getvod',verifyToken(true),vodController.getvod)
router.get('/video/getvideourl/:vodId',vodController.getVideoUrl)



const videoController = require('../controller/videoController')
router.get('/video/getvideolist/:userId',videoController.getVideoList)
router.get('/video/getvideodetail/:videoId',videoController.getVideoDetail)
router.post('/video/comment/:videoId',verifyToken(true),videoController.comment)

module.exports=router