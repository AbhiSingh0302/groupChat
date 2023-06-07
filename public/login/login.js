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
        localStorage.setItem('user', userData.data.user);
        log.innerHTML = "Successfully Login";
        log.style.color = 'green';
        setTimeout(() => {
            log.innerHTML = "";
            window.location.replace('/chat')
            // axios.get('/chat',{
            //     headers:{
            //         'Authorization': localStorage.getItem('authorization')
            //     }
            // })
            // .then((data)=>{
            //     console.log(data);
            // })
            // .catch((err) => {
            //     console.log(err);
            // })
        }, 2000)
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