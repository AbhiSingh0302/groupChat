const ul = document.querySelector('ul');
const form = document.querySelector('form');
const text = document.getElementById('texting');
const User = localStorage.getItem('user');
let userId = 0;
const getUsers = (data) => {
    for(let d of data){
        console.log(d);
        if(d.username == User){
            userId = d.id;
        }
        // let li = document.createElement('li');
        // li.innerHTML = d.username;
        // ul.append(li);
    }
    allChats();
}

window.addEventListener('DOMContentLoaded',async () => {
    try {
    const chat = await axios.get('/chat/user',{
        headers:{
            'Authorization': localStorage.getItem('authorization')
        }
    })
    if(chat){
        console.log(chat.data);
        getUsers(chat.data);
    }else{
        console.log('not available');
    }
} catch (error) {
    console.log('not available');
}
})

form.addEventListener('submit',(e) => {
    e.preventDefault();
    console.log(userId);
    const allUsers = document.querySelectorAll('li');
    // for(let user of allUsers){
    //     console.log('li is ',user.innerHTML);
    //     if(user.innerHTML == User){
            axios.post('/chat/text/'+userId,form,{
                headers:{
                    'Content-Type': 'application/json'
                }
            }).then((chat) => {
                // let li = document.createElement('li');
                // li.innerHTML = chat.data.username+" - "+chat.data.text;
                // ul.append(li);
                allChats();
            })
        // }
    // }
    text.value = "";
})

function allChats(){
    ul.innerHTML = "";
    axios.get('/chat/all-chats')
    .then((data) => {
        // console.log(data.data);
        for(let d of data.data){
            let li = document.createElement('li');
            li.innerHTML = d.username+" - "+d.text;
            ul.appendChild(li);
        }
    })
    .catch(() => {
        alert('something not right');
    })
}

// setInterval(()=>{
//     allChats();
// },1000)