const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const userSignup = sequelize.define(process.env.SIGNUP_TABLE, {
    username: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    }
 });

 module.exports = userSignup;