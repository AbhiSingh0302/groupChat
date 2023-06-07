const Signup = require('../models/signup');
const Userschat = require('../models/chat');

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
        console.log("body is: ",req.body.text);
        console.log("params",req.params);
        const user = await Signup.findOne({
            where:{
                id: req.params.id
            }
        })
        if(user){
            const chat = await Userschat.create({
                'text': req.body.text,
                'username': user.username,
                'signupId': user.id
            })
            if(chat){
                res.status(201).json(chat)
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
            'success': false
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