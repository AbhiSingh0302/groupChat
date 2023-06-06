const path = require('path');
const Signup = require('../models/signup');
const bcrypt = require('bcrypt');

exports.login = async (req,res)=>{
    try {
        console.log(req.body);
        const {email,password} = req.body;
        if(req.body){
            const user = await Signup.findOne({
                where: {email}
            })
            if(!user){
                throw new Error('user not found')
            }else{
                const bcryptToken = await bcrypt.compare(password, user.password)
                if(bcryptToken){
                    res.status(200).json({
                        "message": "User successfully logged in"
                    })
                }else{
                    throw new Error('user not found');
                }
            }
    } 
}catch (error) {
        console.log(error);
        res.status(404).json({
            'success': false,
            error
        })
    }
}


