const form = document.querySelector('form');
const log = document.querySelector('h3');
form.addEventListener('submit',async (e) => {
    try {
    e.preventDefault();
    const userData = await axios.post('/user/signup', form, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if(userData){
        log.innerHTML = "Successfully Registered";
        log.style.color = 'green';
        setTimeout(() => {
            log.innerHTML = "";
            document.getElementById("login-page").click();
        }, 2000)
    }else{
        log.innerHTML = "User already registered";
        log.style.color = 'red';
        setTimeout(() => {
            log.innerHTML = "";
        }, 2000)
    }
} catch (error) {
    console.log(error);
    log.innerHTML = "User already registered";
    log.style.color = 'red';
    setTimeout(() => {
        log.innerHTML = "";
    }, 2000)
}
})