const form = document.querySelector('form');
console.log('signup.js');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('hello');
    axios.post('/user/signup', form, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
})