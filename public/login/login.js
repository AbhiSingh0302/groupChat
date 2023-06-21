const form = document.querySelector('form');
const log = document.querySelector('h3');
form.addEventListener('submit',async (e) => {
    try {
    e.preventDefault();
    const userData = await axios.post('/user/login', form, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(userData){
        console.log(userData.data);
        localStorage.setItem('authorization', userData.data.token);
        localStorage.setItem("userId",userData.data.userId);
        localStorage.setItem("username",userData.data.username);
        log.innerHTML = "Successfully Login";
        log.style.color = 'green';
        setTimeout(() => {
            log.innerHTML = "";
            axios.get('/chat/all-chats',{
                headers:{
                    'Authorization': localStorage.getItem('authorization')
                }
            })
            .then((data)=>{
                // console.log("data: ",data.data);
                const chats = data.data;
                let chatArr = [];
                let len = 0;
                if(chats.length >= 10){
                    len = chats.length;
                }else{
                    len = 10;
                }
                for(let i=len-10; i<=chats.length-1; i++){
                    chatArr.push(chats[i]);
                }
                if(localStorage.getItem("chats")){
                    localStorage.removeItem("chats");
                }
                localStorage.setItem("chats",JSON.stringify(chatArr));
            })
            .catch((err) => {
                console.log(err);
            })
            window.location.replace('/chat')
        }, 1000)
    }else{
        log.innerHTML = "Not exist";
        log.style.color = 'red';
        setTimeout(() => {
            log.innerHTML = "";
        }, 2000)
    }
} catch (error) {
    log.innerHTML = "Not exist";
    log.style.color = 'red';
    setTimeout(() => {
        log.innerHTML = "";
    }, 2000)
}
}) 