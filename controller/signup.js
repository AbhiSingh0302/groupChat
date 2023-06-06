const path = require('path');
const Signup = require('../models/signup');

exports.signupreq = async (req,res)=>{
    // res.json(req.body.headers);
    // try {
    //     if(req.body.headers){
    //         await Signup.
    //     }
    // } catch (error) {
        
    // }
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


