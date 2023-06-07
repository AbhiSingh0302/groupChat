const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.encrypt = async (req,res,next) => {
    try {
        const {password} = req.body;
        if(password){
            const encryptPass = await bcrypt.hash(password,10);
            if(encryptPass){
                req.body.password = encryptPass;
                next();
            }else{
                throw new Error('Password failed');
            }
        }else{
            throw new Error('Password failed');
        }
    } catch (error) {
        return res.status(404).json(error);
    }
}


exports.authorization = (req,res,next) => {
    console.log(req.headers);
    const token = req.headers.authorization;
    // console.log(req.headers.token);
    // console.log(token);
    jwt.verify(token,process.env.JWT_KEY,(err,data) => {
        if(err){
            return res.status(500).json({
                "message": "Authorization Failed",
                err: err
            })
        }
        // req.headers = {'expenseid': data.userId};
        next();
    })
}
