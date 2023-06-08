const ul = document.getElementById('chat-ul');
const form = document.getElementById('chat-form');
const group = document.getElementById('new-group');
const text = document.getElementById('texting');
const groupLi = document.getElementById('groups');
const groupsJoined = document.getElementById('groups-joined');
const chatUser = localStorage.getItem('user');
let localChats = [];
const getChats = (chats) => {   
    for(let chat of chats){
        let li = document.createElement('li');
        li.innerHTML = chat.username+" - "+chat.text;
        ul.append(li);
    }
    getGroups();
    joinedGroups();
}

window.addEventListener('DOMContentLoaded',() => {
    try {
        localChats = JSON.parse(localStorage.getItem("chats"));
    if(localChats){
        // console.log(chat);
        getChats(localChats);
    }else{
        console.log('not available');
    }
} catch (error) {
    console.log('not available');
}
})

form.addEventListener('submit',async (e) => {
    try {
    e.preventDefault();
    const latestChat = await axios.post('/chat/text/'+chatUser,form,{
        headers:{
            'Authorization': localStorage.getItem('authorization'),
            'Content-Type': 'application/json'
        }
    })
    text.value = "";
    if(localChats.length == 10){
        localChats.shift();
    }
    console.log(latestChat);
    localChats.push(latestChat.data);
    localStorage.setItem("chats",JSON.stringify(localChats));
    let li = document.createElement('li');
    li.innerHTML = latestChat.data.username+" - "+latestChat.data.text;
    ul.append(li);
} catch (error) {
       console.log("Something went wrong"); 
}
    
})

group.addEventListener('submit',async (e) => {
    try {
        e.preventDefault();
    const createGroup = await axios.post('/group/create/',group,{
        headers:{
            'Authorization': localStorage.getItem('authorization'),
            'Content-Type': 'application/json'
        }
    })
    if(createGroup){
        console.log("group: ",createGroup);
        let li = document.createElement('li');
        li.innerHTML = `<button id=${createGroup.data.id}> ${createGroup.data.group} </button>`;
        groupLi.append(li);
        document.getElementById(createGroup.data.id).addEventListener('click',() => {
            joinGroup(createGroup.data.id);
        })
    }else{
        console.log("group not formed");
    }
} catch (error) {
        console.log(error);
}
})

async function joinGroup(id){
    try {
    const userJoinGroup = await axios.post('/group/join/'+id,{'username': chatUser},{
        headers:{
            'Authorization': localStorage.getItem('authorization'),
            'Content-Type': 'application/json'
        }
    })
    if(userJoinGroup){
        console.log(userJoinGroup.data);
    }
} catch (error) {
    console.log(error.data); 
}
}

async function getGroups(){
    try {
    const allGroups = await axios.get('/group/all',{
        headers:{
            'Authorization': localStorage.getItem('authorization')
        }
    })
    // console.log('groups:',allGroups.data);
    for(let grp of allGroups.data){
        // console.log(grp);
        let li = document.createElement('li');
        li.innerHTML = `<button id=${grp.id}> ${grp.group} </button>`;
        groupLi.append(li);
        document.getElementById(grp.id).addEventListener('click',() => {
            joinGroup(grp.id);
        })
    }
} catch (error) {
        
}
}

async function joinedGroups(){
    try {
        const groupJoined = await axios.get('/group/joined/'+chatUser,{
            headers:{
                'Authorization': localStorage.getItem('authorization')
            }
        })
        console.log('groupJoined: ',groupJoined);
        for(let grp of groupJoined.data){
            let li = document.createElement('li');
            li.innerHTML = grp;
            groupsJoined.append(li);
        }
        
    } catch (error) {
        
    }
}