const groupDb = require('../models/group');
const Signup = require('../models/signup');
const groupMessage = require('../models/groupmessage');

exports.createGroup = async (req,res) => {
    try {
        const groupName = req.body;
        if(groupName){
            const group = await groupDb.create(groupName);
            if(group){
                res.status(201).json(group);
            }else{
                res.status(401).json({
                    error: 'group not formed'
                })
            }
        }
        else{
            res.status(404).json({
                error: 'request not found'
            })
        }
    } catch (error) {
        res.status(404).json({
            error: 'request not found'
        })
    }
}

exports.joinGroup = async (req,res) => {
    console.log(req.params);
    console.log(req.body);
    const user = await Signup.findOne({
        where:{
            'username': req.body.username
        }
    })
    const grpMsg = await groupMessage.create({
        'groupId': req.params.id,
        'signupId': user.id
    })
    res.status(201).json({
        'message': grpMsg
    })
}

exports.allGroup = async (req,res) => {
 try {
    const groupList = await groupDb.findAll();
    res.status(200).json(groupList);
 } catch (error) {
    res.status(404).json({
        'message': 'Not Found'
    })
 }   
}

exports.joinedGroup = async (req,res) => {
    try {
        console.log(req.params);
        const user = await Signup.findOne({
            where:{
                'username': req.params.username
            }
        })
        const groupsJoined = await groupMessage.findAll({
            where:{
                'signupId': user.id
            }
        })
        let groupsName = [];
        for(let grp of groupsJoined){
            const grpName = await groupDb.findByPk(grp.groupId);
            groupsName.push(grpName.group);
        }
        res.status(200).json(groupsName);
    } catch (error) {
    }
}