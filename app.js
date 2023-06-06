const express = require('express');
// const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const signupRouter = require('./routes/signup');
const sequelize = require('./utils/database');

const app = express();

app.use(bodyParser.json());

app.use(express.static(__dirname+'/public'));

app.use(signupRouter);

sequelize.sync()
.then(() => {
    app.listen(3000,() => {
        console.log("server is running at port 3000...");
    })
})
.catch((err) => {
    console.log("Some error: ",err);
})
