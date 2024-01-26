const {User}=require('../model')
const Joi = require('joi')

module.exports.registerValidate = async (ctx,next)=>{
    const schema = Joi.object({
        username:Joi.string().min(3).max(30).required(),
        password:Joi.string().min(3).max(30).required(),
        email:Joi.string().email().required(),
        phone:Joi.string().pattern(/^1[3456789]\d{9}$/).required(),

    })

    const {error,value} = schema.validate(ctx.request.body)
    if(error){
        ctx.throw(400,error)
    }
    
    // 驗證手機號碼唯一性
    const dbBack1 = await User.findOne({phone:value.phone})
    
    if(dbBack1){
        ctx.throw(400,'手機已被註冊')
    }
    const dbBack2 = await User.findOne({email:value.email})
    if(dbBack2){
        ctx.throw(400,'電郵已被註冊')
    }

    // console.log(schema.validate(ctx.request.body),'schema');
   await next()
}

module.exports.loginValidate = async (ctx,next)=>{
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(3).max(30).required(),
    })

    const {error,value}=schema.validate(ctx.request.body)
       
      if(error){
        ctx.throw(400,error)
      }
      await next()
}