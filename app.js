const express = require('express');

const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const loginRouter = require('./routes/login');
const sequelize = require('./utils/database');
const chatRouter = require('./routes/chat');
const signupRouter = require('./routes/signup');
const groupRouter = require('./routes/group');

const User = require('./models/signup');
const Chat = require('./models/chat');
const Group = require('./models/group');
const groupMessage = require('./models/groupmessage');
const groupUser = require('./models/groupuser');

Chat.belongsTo(User);
User.hasMany(groupMessage);
Group.hasMany(groupMessage);
Group.hasMany(groupUser);
User.hasMany(groupUser);

const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin: "*"
}))

app.use(express.static(__dirname+'/public'));

app.use(groupRouter);
app.use(chatRouter);
app.use(loginRouter);
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
