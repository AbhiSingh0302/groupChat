const express = require('express');

const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const signupRouter = require('./routes/signup');
const loginRouter = require('./routes/login');
const sequelize = require('./utils/database');

const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin: "*"
}))

app.use(express.static(__dirname+'/public'));

app.use(signupRouter);

app.use(loginRouter);

sequelize.sync()
.then(() => {
    app.listen(3000,() => {
        console.log("server is running at port 3000...");
    })
})
.catch((err) => {
    console.log("Some error: ",err);
})
