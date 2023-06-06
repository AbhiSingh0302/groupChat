const bcrypt = require('bcrypt');

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