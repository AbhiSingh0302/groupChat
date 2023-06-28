const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const archivedChat = sequelize.define("archivedChat", {
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

 module.exports = archivedChat;