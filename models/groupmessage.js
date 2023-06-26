const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const groupmessage = sequelize.define(process.env.GROUPMESSAGE_TABLE, {
    id:{
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    text: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: "joined"
    },
    file: {
      type: Sequelize.DataTypes.STRING,
    }
 });

 module.exports = groupmessage;