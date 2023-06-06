const path = require('path');
const Signup = require('../models/signup');

exports.signupreq = async (req,res)=>{
    try {
        console.log(req.body);
        const {username,email,phone,password} = req.body;
        if(req.body){
            const user = await Signup.create({username,email,phone,password});
            res.status(200).json({
                'success': true,
                user
            })
        }else{
            throw new Error('Not Found!!');
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            'success': false,
            error
        })
    }
}

exports.signuppage = async (req,res) => {
    try {
        await res.status(200).sendFile(path.join(__dirname,'../','public/signup','signup.html'));
    } catch (error) {
        res.status(404).json({
            'success': false,
            'error': 'Page not found'
        })
    }
}


