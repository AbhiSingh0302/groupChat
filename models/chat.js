const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const userChat = sequelize.define(process.env.CHAT_TABLE, {
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    text: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    file: {
      type: Sequelize.DataTypes.STRING,
    }
 });

 module.exports = userChat;