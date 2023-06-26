const Signup = require('../models/signup');
const Userschat = require('../models/chat');
const AWS = require('aws-sdk')

const s3upload = async (file) => {
    try {
    const BUCKET_NAME = process.env.BUCKET_NAME;
        const IAM_USER_KEY = process.env.IAM_USER_KEY;
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET;
        let s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
        })
        var params = {
            Bucket: BUCKET_NAME,
            Key: `uploads/${file.originalname}`,
            Body: file.buffer,
            ACL: 'public-read'
        }
        return await s3bucket.upload(params).promise();
    } catch (error) {
        console.log("some error: ",error);
        return {};
    }
}

exports.registeredUsers = async (req,res) => {
    try {
    const users = await Signup.findAll({
        attributes: ['username','id']
    })
    if(users){
        res.status(200).json(users);
    }
} catch (error) {
        res.status(404).json({'success': 'false', 'message': 'Not Found'})
}
}

exports.userChat = async (req,res) => {
    try {
        console.log(req.files[0]);
        const result = await s3upload(req.files[0]);
        console.log("result: ",result);
        let file = result;
        if(Object.keys(file).length != 0){
            file = {
                'Location': result.Location,
                'key': result.key
            }
        }
        const user = await Signup.findOne({
            where:{
                id: req.params.userid
            }
        })
        if(user){
            const chat = await Userschat.create({
                'text': req.body.text,
                'file': JSON.stringify(file),
                'username': user.username,
                'signupId': user.id
            })
            if(chat){
                res.status(201).json({chat,result})
            }else{
                res.status(404).json({
                    'success': false
                })
            }
        }else{
            res.status(404).json({
                'success': false
            })
        }
    } catch (error) {
        res.status(404).json({
            'success': false,
            error
        })
    }
}

exports.allChats = async (req,res) => {
    try {
    const chats = await Userschat.findAll();
    if(chats){
        res.status(200).json(chats);
    }else{
        res.status(404).json({
            'success': 'false'
        })
    }
} catch (error) {
        res.status(404).json({
            'success': 'false'
        })
}
}