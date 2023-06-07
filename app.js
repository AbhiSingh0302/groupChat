const express = require('express');

const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');

const loginRouter = require('./routes/login');
const sequelize = require('./utils/database');
const chatRouter = require('./routes/chat');
const signupRouter = require('./routes/signup');

const User = require('./models/signup');
const Chat = require('./models/chat');
Chat.belongsTo(User);

const app = express();

app.use(bodyParser.json());

app.use(cors({
    origin: "*"
}))

app.use(express.static(__dirname+'/public'));

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
