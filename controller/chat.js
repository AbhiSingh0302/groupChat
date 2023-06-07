const Signup = require('../models/signup');

exports.registeredUsers = async (req,res) => {
    try {
    const users = await Signup.findAll({
        attributes: ['username']
    })
    if(users){
        res.status(200).json(users);
    }
} catch (error) {
        res.status(404).json({'success': 'false', 'message': 'Not Found'})
}
}