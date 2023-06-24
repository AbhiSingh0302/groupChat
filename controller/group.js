const groupDb = require('../models/group');
const Signup = require('../models/signup');
const groupMessage = require('../models/groupmessage');
const groupUserDb = require('../models/groupuser');
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
    }
}

exports.createGroup = async (req,res) => {
    try {
        const groupName = req.body;
        console.log(groupName);
        const id = req.params.userid;
        const groupAlreadyExist = await groupDb.findOne({
            where:{
                'group': groupName.group
            }
        })
        console.log(groupAlreadyExist)
        if(groupAlreadyExist){
            res.status(401).json({
                "message": 'group name already exist'
            })
        }else{
            const formGroup = await groupDb.create(groupName);
            const groupCreator = await Signup.findOne({where:{id}});
            if(groupCreator && formGroup){
                    const makeGroupUser = await groupUserDb.create({
                        'groupId': formGroup.id,
                        'signupId': groupCreator.id,
                        'isAdmin': 1
                    })
                res.status(201).json(formGroup);
            }else{
                res.status(401).json({
                    "message": 'not able to create'
                })
            }
        }
    } catch (error) {
        res.status(404).json({
            "message": 'Not Found'
        })
    }
}

exports.allGroup = async (req,res) => {
 try {
    const id = req.params.userid;
    const user = await Signup.findOne({where:{id}});
    const groupList = await groupUserDb.findAll({
        where: {
            'signupId': user.id
        }
    });
    let allGroups = [];
    let groupsWithAdmin = [];
    for(let grp of groupList){
        let groupFromDb = await groupDb.findOne({
            where:{
                id: grp.groupId
            }
        })
        if(grp.isAdmin === true){
            groupsWithAdmin.push(groupFromDb)
        }
        allGroups.push(groupFromDb);
    }
    // console.log("output>>>>>>>>>>>>>>>",allGroups);
    res.status(200).json({allGroups,groupsWithAdmin});
 } catch (error) {
    res.status(404).json({
        'message': 'Not Found'
    })
 }   
}

exports.addUserToGroup = async (req,res) => {
    try {
        const groupName = req.body;
        const username = req.params.username;
        const findGroup = await groupDb.findOne({
            where: groupName
        })
        const findUser = await Signup.findOne({
            where: {
                username
            }
        })
        const userAlreadyPresent = await groupUserDb.findOne({
            where:{
                'signupId': findUser.id
            }
        })
        if(!userAlreadyPresent){
            if(findGroup && findUser){
                const userAddToGrp = await groupUserDb.create({
                    'groupId': findGroup.id,
                    'signupId': findUser.id
                })
                res.status(201).json(userAddToGrp)
            }
        }else{
            res.status(401).json({
                "success": "false",
                "message": "User already added to the group"
            })
        }
    } catch (error) {
        res.status(404).json(error);
    }
}

exports.addAdminToGroup = async (req,res) => {
    try {
        const groupName = req.body;
        const username = req.params.username;
        const findGroup = await groupDb.findOne({
            where: groupName
        })
        const findUser = await Signup.findOne({
            where: {
                username
            }
        })
        const userAlreadyPresent = await groupUserDb.findOne({
            where:{
                'signupId': findUser.id
            }
        })
        if(userAlreadyPresent){
            await groupUserDb.update({'isAdmin': 1},{where: {
                'signupId': findUser.id
            }})
        }else{
            if(findGroup && findUser){
                const userAdminToGrp = await groupUserDb.create({
                    'groupId': findGroup.id,
                    'signupId': findUser.id,
                    'isAdmin': 1
                })
                res.status(201).json(userAdminToGrp);
            }
        }
    } catch (error) {
        res.status(404).json(error);
    }
}

exports.groupChats = async (req,res) => {
    try {
        console.log(req.params);
        const groupChatsFromDb = await groupMessage.findAll({
            where:{
                'groupId': req.params.groupid
            }
        })
        console.log(groupChatsFromDb);
        res.status(200).json(groupChatsFromDb);
    } catch (error) {
        res.status(404).json({success: 'false',error});
    }
}

exports.sendChatToGroup = async (req,res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        console.log(req.files[0]);
        const result = await s3upload(req.files[0]);
        const groupUser = await Signup.findOne({
            where:{
                id: req.params.userid
            }
        })
        const chat = await groupMessage.create({
            'text': req.body.text,
            'signupId': req.params.userid,
            'groupId': req.body.groupid,
            'username': groupUser.username
        })
        res.status(201).json({chat,result});
    } catch (error) {
        res.status(404).json(error);
    }
}