const ul = document.querySelector('ul');
const form = document.querySelector('form');
const text = document.getElementById('texting');
const chatUser = localStorage.getItem('user');
let localChats = [];
const getChats = (chats) => {
    for(let chat of chats){
        let li = document.createElement('li');
        li.innerHTML = chat.username+" - "+chat.text;
        ul.append(li);
    }
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

// function allChats(){
//     ul.innerHTML = "";
//     axios.get('/chat/all-chats')
//     .then((data) => {
//         // console.log(data.data);
//         for(let d of data.data){
//             let li = document.createElement('li');
//             li.innerHTML = d.username+" - "+d.text;
//             ul.appendChild(li);
//         }
//     })
//     .catch(() => {
//         alert('something not right');
//     })
// }

// setInterval(()=>{
//     allChats();
// },1000)