const groupDb = require('../models/group');
const Signup = require('../models/signup');
const groupMessage = require('../models/groupmessage');
const groupUserDb = require('../models/groupuser');

exports.createGroup = async (req,res) => {
    try {
        const groupName = req.body;
        const id = req.params.userid;
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
        if(findGroup && findUser){
            const userAddToGrp = await groupUserDb.create({
                'groupId': findGroup.id,
                'signupId': findUser.id
            })
            res.status(201).json(userAddToGrp)
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
        if(findGroup && findUser){
            const userAdminToGrp = await groupUserDb.create({
                'groupId': findGroup.id,
                'signupId': findUser.id,
                'isAdmin': 1
            })
            res.status(201).json(userAdminToGrp);
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
        const sendChat = await groupMessage.create({
            'message': req.body.text,
            'signupId': req.params.userid,
            'groupId': req.body.groupid
        })
        res.status(201).json(sendChat);
    } catch (error) {
        res.status(404).json(error);
    }
}