var socket = io();
socket.on("connect", () => {
    console.log("connected on: ", socket.id);
});

const ul = document.getElementById('chat-ul');
const form = document.getElementById('chat-form');
const group = document.getElementById('new-group');
const text = document.getElementById('texting');
const groupLi = document.getElementById('groups');
const addOradmin = document.getElementById('addOradmin');
const selectUser = document.getElementById('select-user');
const selectGroup = document.getElementById('select-group');
const addUser = document.getElementById('add-user');
const adminUser = document.getElementById('admin-user');
const groupChatBox = document.getElementById('chat-group');

const chatUserId = localStorage.getItem('userId');
const chatUsername = localStorage.getItem("username");
let localChats = [];
let groupId = -1;

const getChats = (chats) => {
    for (let chat of chats) {
        let file = JSON.parse(chat.file);
        let li = document.createElement('li');
        li.innerHTML = chat.username + " - " + chat.text;
        if(Object.keys(file).length != 0){
            li.innerHTML = li.innerHTML + `<a href=${file.Location}> ${file.key.slice(8)} </a>`;
        }
        ul.append(li);
    }
    getGroups();
    getUsers();
}

window.addEventListener('DOMContentLoaded', () => {
    try {
        localChats = JSON.parse(localStorage.getItem("chats"));
        if (localChats) {
            getChats(localChats);
        } else {
            console.log('not available');
        }
    } catch (error) {
        console.log('not available');
    }
})

async function getGroups() {
    try {
        const allGroups = await axios.get('/group/all/' + chatUserId, {
            headers: {
                'Authorization': localStorage.getItem('authorization')
            }
        })
        const getAllGroups = allGroups.data.allGroups;
        const getAdminGroups = allGroups.data.groupsWithAdmin;
        console.log("getAdminGroups: ", getAdminGroups);
        for (let grp of getAllGroups) {
            console.log("group are: ", grp);
            let li = document.createElement('li');
            li.innerHTML = `<p id=${grp.id}> ${grp.group} </p>`;
            li.style.cssText = `
                background-color: #d3d3ff;
                padding: 10px;
                width: 100%;
                margin-bottom: 5px;
            `
            groupLi.append(li);
            document.getElementById(grp.id).addEventListener('click', (e) => {
                groupChat(e);
            })
        }
        for (let grp of getAdminGroups) {
            let opt = document.createElement('option');
            opt.value = grp.group;
            opt.innerHTML = grp.group;
            selectGroup.append(opt);
        }
    } catch (error) {
        console.log(error);
    }
}

async function getUsers() {
    try {
        const allUsers = await axios.get('/chat/user', {
            headers: {
                'Authorization': localStorage.getItem('authorization')
            }
        })
        // console.log("allusers :",allUsers.data);
        let usersData = allUsers.data;
        for (let user of usersData) {
            if(user.username !== chatUsername){
            let opt = document.createElement('option');
            opt.value = user.username;
            opt.innerHTML = user.username;
            selectUser.append(opt);
            }
        }
        
    } catch (error) {
        
    }
}

socket.on("receive-message", (latestChat,id) => {
    let chat = latestChat.chat;
    let multimedia = latestChat.result;   
    // console.log(latestChat,id);
    let li = document.createElement("li");
    li.innerHTML = chat.username+" - "+chat.text;
    if(Object.keys(multimedia).length){
        li.innerHTML = li.innerHTML + `<a href=${latestChat.result.Location}> ${latestChat.result.key.slice(8)} </a>`;
    }
    ul.append(li);
});

form.addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const text = document.querySelector('#chat-form input[type="text"]');
        const files = document.querySelector("#chat-form input[type='file']");
        const formData = new FormData();
        formData.append("text",text.value);
        for(let i=0; i<files.files.length; i++){
            formData.append("files", (files.files[i]));
        }
        console.log(...formData);
        const latestChat = await axios.post('/chat/text/' + chatUserId, formData, {
            headers: {
                'Authorization': localStorage.getItem('authorization'),
                // 'Content-Type': 'application/json'
            }
        })
        if (localChats.length == 10) {
            localChats.shift();
        }
        localChats.push(latestChat.data.chat);
        localStorage.setItem("chats", JSON.stringify(localChats));
        socket.emit("send-message", latestChat.data, groupId);
        text.value = "";
    } catch (error) {
        console.log("Something went wrong");
    }

})

group.addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const createGroup = await axios.post('/group/create/' + chatUserId, group, {
            headers: {
                'Authorization': localStorage.getItem('authorization'),
                'Content-Type': 'application/json'
            }
        })
        if (createGroup) {
            console.log("group: ", createGroup);
            let li = document.createElement('li');
            li.innerHTML = `<p id=${createGroup.data.id}> ${createGroup.data.group} </p>`;
            li.style.cssText = `
                background-color: #d3d3ff;
                padding: 10px;
                width: 100%;
                margin-bottom: 5px;
            `
            groupLi.append(li);
            document.getElementById(createGroup.data.id).addEventListener('click', (e) => {
                groupChat(e);
            })
            let opt = document.createElement('option');
            opt.value = createGroup.data.group;
            opt.innerHTML = createGroup.data.group;
            selectGroup.append(opt);
            group.children[0].value = "";
        } else {
            console.log("group not formed");
        }
    } catch (error) {
        console.log(error);
    }
})


async function groupChat(e) {
    try {
        groupId = e.target.id;  
        const allGroupLi = groupLi.children;
        for(let oneGrp of allGroupLi){
            if(oneGrp.children[0].id === groupId){
                oneGrp.style.backgroundColor = "rgb(128 128 255)"
            }else{
                oneGrp.style.backgroundColor = "#d3d3ff";
            }
        }
        console.log(groupId);
        groupChatBox.style.display = 'block';
        group.style.display = "none";
        const grpChats = await axios.get('/group/groupchat/' + groupId, {
            headers: {
                'Authorization': localStorage.getItem('authorization')
            }
        })
        socket.emit("join-room",groupId);
        const chatsFromGrp = grpChats.data;
        console.log(grpChats);
        const listItems = document.querySelectorAll('#chat-ul li');

        listItems.forEach(listItem => {
            listItem.parentNode.removeChild(listItem);
        });

        for (let chat of chatsFromGrp) {
            let li = document.createElement('li');
            let file = JSON.parse(chat.file);
            li.innerHTML = chat.username+" - "+chat.text;
            if(Object.keys(file).length != 0){
                li.innerHTML = li.innerHTML + `<a href=${file.Location}> ${file.key.slice(8)} </a>`;
            }
            ul.append(li);
        }
    } catch (error) {
        console.log("Something went wrong: ",error);
    }
}

groupChatBox.addEventListener('submit', async (e) => {
    e.preventDefault();
    // const text = document.querySelector('#chat-group input[type="text"]').value;

    const text = document.querySelector('#chat-group input[type="text"]');
        const files = document.querySelector("#chat-group input[type='file']");
        const formData = new FormData();
        formData.append("text",text.value);
        formData.append("groupid",groupId);
        for(let i=0; i<files.files.length; i++){
            formData.append("files", (files.files[i]));
        }
        console.log(...formData);
    const sendGrpChat = await axios.post('/group/sendchat/' + chatUserId, formData, {
        headers: {
            'Authorization': localStorage.getItem('authorization'),
            // 'Content-Type': 'application/json'
        }
    })
    // console.log("sfd",sendGrpChat.data);
    socket.emit("send-message", sendGrpChat.data, groupId);
    text.value = "";
    files.value = "";
    // let li = document.createElement('li');
    // li.innerHTML = sendGrpChat.data.username+" - "+sendGrpChat.data.message;
    // ul.append(li);
})

addUser.addEventListener('click', async () => {
    try {      
        if (selectUser.value != "" && selectGroup.value != "") {
            const addUserToGroup = await axios.post('/group/adduser/' + selectUser.value, { group: selectGroup.value }, {
                headers: {
                    'Authorization': localStorage.getItem('authorization'),
                    'Content-Type': 'application/json'
                }
            })
            console.log(addUserToGroup);
            selectUser.value = "";
            selectGroup.value = "";
        } else {
            console.log("Empty select");
        }
    } catch (error) {
        console.log(error);
        alert(error.response.data.message);
    }
})

adminUser.addEventListener('click', async () => {
    try {
        if (selectUser.value != "" && selectGroup.value != "") {
            const addAdminToGroup = await axios.post('/group/adminuser/' + selectUser.value, { group: selectGroup.value }, {
                headers: {
                    'Authorization': localStorage.getItem('authorization'),
                    'Content-Type': 'application/json'
                }
            })
            console.log(addAdminToGroup);
            alert("User become admin");
            selectUser.value = "";
        selectGroup.value = "";
        } else {
            console.log("Empty select");
        }
    } catch (error) {
        console.log("Some error: ", error);
    }
})