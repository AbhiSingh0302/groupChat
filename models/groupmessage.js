const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const groupmessage = sequelize.define(process.env.GROUPMESSAGE_TABLE, {
    message: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: "joined"
    }
 });

 module.exports = groupmessage;