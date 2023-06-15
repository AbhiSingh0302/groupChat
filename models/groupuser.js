const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const groupuser = sequelize.define(process.env.GROUPUSER_TABLE,{
    id:{
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    isAdmin:{
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: 0
    }
});

 module.exports = groupuser;