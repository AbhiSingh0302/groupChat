const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const groupmessage = sequelize.define(process.env.GROUPMESSAGE_TABLE, {
    id:{
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    message: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: "joined"
    }
 });

 module.exports = groupmessage;