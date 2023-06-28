const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
var CronJob = require('cron').CronJob;


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
const archivedChat = require('./models/archivedChat');


Chat.belongsTo(User);
User.hasMany(groupMessage);
Group.hasMany(groupMessage);
Group.hasMany(groupUser);
User.hasMany(groupUser);


app.use(bodyParser.json());

app.use(cors({
    origin: "*"
}))

app.use(express.static(__dirname+'/public'));

const job = new CronJob(
    '0 0 * * *',
    async function() {
        try {    
            console.log("cron job is working")
            const allChats = await Chat.findAll();
            const allGrpChats = await groupMessage.findAll();
            console.log(allChats.length);
            if(allChats.length != 0){
                for(let chat of allChats){
                    await archivedChat.create({
                        "username": chat.username,
                        "text": chat.text,
                        "file": chat.file
                    })
                    await Chat.destroy({
                        where:{
                            "id": chat.id
                        }
                    });
                }
            }else{
                console.log("no chats are available");
            }
            console.log(allGrpChats.length);
            if(allGrpChats.length != 0){
                for(let chat of allGrpChats){
                    await archivedChat.create({
                        "username": chat.username,
                        "text": chat.text,
                        "file": chat.file
                    })
                    await groupMessage.destroy({
                        where:{
                            "id": chat.id
                        }
                    });
                }
            }else{
                console.log("no group chats are available");
            }
        } catch (error) {
            console.log(error);
        }
    },
    null,
    true,
    'America/Los_Angeles'
);

io.on("connection",socket => {
    console.log("socket.io is connected at: ",socket.id);
    socket.on("send-message",(message,id) => {
        if(id === -1){
            io.emit("receive-message",message);
        }else{
            io.to(id).emit("receive-message",message);
        }
    })
    socket.on("join-room", room => {
        socket.join(room);
    })
})

app.use(groupRouter);
app.use(chatRouter);
app.use(loginRouter);
app.use(signupRouter);
app.use((req,res) => {
    res.sendFile(path.join(__dirname,'public/signup/signup.html'))
})

sequelize.sync()
.then(() => {
    http.listen(3000,() => {
        console.log("server is running at port 3000...");
    })
})
.catch((err) => {
    console.log("Some error: ",err);
})
