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
        let li = document.createElement('li');
        li.innerHTML = chat.username + " - " + chat.text;
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
            li.innerHTML = `<button id=${grp.id}> ${grp.group} </button>`;
            groupLi.append(li);
            document.getElementById(grp.id).addEventListener('click', () => {
                groupChat(grp.id);
            })
        }
        for (let grp of getAdminGroups) {
            let opt = document.createElement('option');
            opt.value = grp.group;
            opt.innerHTML = grp.group;
            selectGroup.append(opt);
        }
    } catch (error) {
        
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
            let opt = document.createElement('option');
            opt.value = user.username;
            opt.innerHTML = user.username;
            selectUser.append(opt);
        }
        
    } catch (error) {
        
    }
}

socket.on("receive-message", (latestChat,id) => {
    console.log(latestChat,id);
    if(!id){
        let li = document.createElement("li");
        li.innerHTML = latestChat.username+" - "+latestChat.text;
        ul.append(li);
    }
});

form.addEventListener('submit', async (e) => {
    try {
        e.preventDefault();
        const latestChat = await axios.post('/chat/text/' + chatUserId, form, {
            headers: {
                'Authorization': localStorage.getItem('authorization'),
                'Content-Type': 'application/json'
            }
        })
        if (localChats.length == 10) {
            localChats.shift();
        }
        localChats.push(latestChat.data);
        localStorage.setItem("chats", JSON.stringify(localChats));
        socket.emit("send-message", latestChat.data, groupId);
        text.value = "";
    } catch (error) {
        console.log("Something went wrong");
    }

})

// group.addEventListener('submit', async (e) => {
//     try {
//         e.preventDefault();
//         const createGroup = await axios.post('/group/create/' + chatUserId, group, {
//             headers: {
//                 'Authorization': localStorage.getItem('authorization'),
//                 'Content-Type': 'application/json'
//             }
//         })
//         if (createGroup) {
//             console.log("group: ", createGroup);
//             let li = document.createElement('li');
//             li.innerHTML = `<button id=${createGroup.data.id}> ${createGroup.data.group} </button>`;
//             groupLi.append(li);
//             // document.getElementById(createGroup.data.id).addEventListener('click',() => {
//             //     joinGroup(createGroup.data.id);
//             // })
//             group.children[0].value = "";
//         } else {
//             console.log("group not formed");
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })


// async function groupChat(id) {
//     try {
//         groupId = id;
//         console.log(groupId);
//         groupChatBox.style.display = 'block';
//         const grpChats = await axios.get('/group/groupchat/' + id, {
//             headers: {
//                 'Authorization': localStorage.getItem('authorization')
//             }
//         })
//         const chatsFromGrp = grpChats.data;
//         console.log(grpChats);
//         const listItems = document.querySelectorAll('#chat-ul li');

//         listItems.forEach(listItem => {
//             listItem.parentNode.removeChild(listItem);
//         });

//         for (let chat of chatsFromGrp) {
//             let li = document.createElement('li');
//             li.innerHTML = chat.username+" - "+chat.message;
//             ul.append(li);
//         }
//     } catch (error) {

//     }
// }

// groupChatBox.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     let chat = document.querySelector('#chat-group input[type="text"]').value;
//     const sendGrpChat = await axios.post('/group/sendchat/' + chatUserId, { 'text': chat, 'groupid': groupId }, {
//         headers: {
//             'Authorization': localStorage.getItem('authorization'),
//             'Content-Type': 'application/json'
//         }
//     })
//     console.log(sendGrpChat.data);
//     socket.emit("send-message", sendGrpChat.data, groupId);
//     // let li = document.createElement('li');
//     // li.innerHTML = sendGrpChat.data.username+" - "+sendGrpChat.data.message;
//     // ul.append(li);
// })

// addUser.addEventListener('click', async () => {
//     if (selectUser.value != "" && selectGroup.value != "") {
//         const addUserToGroup = await axios.post('/group/adduser/' + selectUser.value, { group: selectGroup.value }, {
//             headers: {
//                 'Authorization': localStorage.getItem('authorization'),
//                 'Content-Type': 'application/json'
//             }
//         })
//         console.log(addUserToGroup);
//     } else {
//         console.log("Empty select");
//     }
// })

// adminUser.addEventListener('click', async () => {
//     try {
//         if (selectUser.value != "" && selectGroup.value != "") {
//             const addAdminToGroup = await axios.post('/group/adminuser/' + selectUser.value, { group: selectGroup.value }, {
//                 headers: {
//                     'Authorization': localStorage.getItem('authorization'),
//                     'Content-Type': 'application/json'
//                 }
//             })
//             console.log(addAdminToGroup);
//         } else {
//             console.log("Empty select");
//         }
//     } catch (error) {
//         console.log("Some error: ", error);
//     }
// })