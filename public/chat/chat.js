const ul = document.querySelector('ul');

const getUsers = (data) => {
    for(let d of data){
        let li = document.createElement('li');
        li.innerHTML = d.username;
        ul.append(li);
    }
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
        
}
})