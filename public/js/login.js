const login = async (email,password) => {
//to send http request for login, we use axios library
//axios returns a promise
console.log(email,password)
try {
    const res = await axios({
        method: 'POST',
        url:'http://127.0.0.1:3000/api/v1/users/login', //login endpoint
        data: {
            email:email,
            password:password
        }
    });
    console.log(res);
} catch(err) {
    console.log(err.response.data);
}
};

document.querySelector('.form').addEventListener('submit',(e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email,password)
})