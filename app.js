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
const { Server } = require('http');

Chat.belongsTo(User);
User.hasMany(groupMessage);
Group.hasMany(groupMessage);
Group.hasMany(groupUser);
User.hasMany(groupUser);

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
io.on("connection",socket => {
    console.log(socket.id);
})

app.use(bodyParser.json());

app.use(cors({
    origin: "*"
}))

app.use(express.static(__dirname+'/public'));
// app.get('/socket.io/socket.io.js', (req, res) => {
//     res.setHeader('Content-Type', 'application/javascript');
//     // Serve the Socket.IO script file
//     res.sendFile('/socket.io.js');
//   });
  

app.use(groupRouter);
app.use(chatRouter);
app.use(loginRouter);
app.use(signupRouter);

sequelize.sync()
.then(() => {
    http.listen(3000,() => {
        console.log("server is running at port 3000...");
    })
})
.catch((err) => {
    console.log("Some error: ",err);
})
