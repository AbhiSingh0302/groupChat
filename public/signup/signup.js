const form = document.querySelector('form');
const log = document.querySelector('h3');
console.log('signup.js');
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
        }, 2000)
    }else{
        log.innerHTML = "User already registered";
        log.style.color = 'red';
        setTimeout(() => {
            log.innerHTML = "";
        }, 2000)
    }
} catch (error) {
    log.innerHTML = "User already registered";
    log.style.color = 'red';
    setTimeout(() => {
        log.innerHTML = "";
    }, 2000)
}
})