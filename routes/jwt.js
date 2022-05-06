const jwt = require("jsonwebtoken");
const jwtSecreKey =  "private key",
        oneHoure = 60 *1000 * 60;
const sign = (payload) => jwt.sign(payload,jwtSecreKey,{
    expiresIn:oneHoure*12,
}),
    getPayLoadToken = (token)=>{
        if(!token) return;
        try {
            return jwt.verify(token,jwtSecreKey)
        } catch (error) {
            return
        }
    }
module.exports = {sign,getPayLoadToken}