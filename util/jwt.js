const jwt = require('jsonwebtoken')


// 簽發token
module.exports.createToken = (data)=>{
             const token = jwt.sign(data,'uuidabc',{expiresIn:'8h'})
           return token
}


// 驗證token
module.exports.verifyToken = function(required=true){
         return async (ctx,next)=>{

     const token = ctx.header.authorization? ctx.header.authorization.split('Bearer ')[1]:null
           if(token){
            // 如果有token，就驗證是否正確
            console.log(token,'token');
            // jwt.verify(token,'uuidabc',async function(err,decoded){
            //     if(err){
            //        ctx.status=400
            //        ctx.body = {msg:'token不正確'}
            //     }else{
            //         ctx.user = decoded
            //         await next()
            //     }
            // })
            try{
                const result = jwt.verify(token,'uuidabc')
                ctx.user = result
                await next()
            }catch(err){
                console.log(err,'err');
                       ctx.status=400
                   ctx.body = {msg:'token不正確'}
            }
            

           }else if(required){
            // 走到這裡就是沒有token，但是必須驗證token
            ctx.throw(400,'必須要驗證token')
            
           }else{
            // 走到這裡，就是沒有token，也無需驗證token
            await next()
           }
               
               
         }
}