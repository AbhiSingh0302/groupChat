const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const group = sequelize.define(process.env.GROUP_TABLE, {
    group: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    }
 });

 module.exports = group;