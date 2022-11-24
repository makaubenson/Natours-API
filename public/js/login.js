import axios from "axios";
import { showAlert } from "./alerts";

export const login = async (email,password) => {
//to send http request for login, we use axios library
//axios returns a promise

try {
    const res = await axios({
        method: 'POST',
        url:'http://127.0.0.1:3000/api/v1/users/login', //login endpoint
        data: {
            email,
            password,
        }
    });

    if(res.data.status === 'success'){
        showAlert('success','Logged in successfully')
        window.setTimeout(()=>{
            location.assign('/');
        },1500)
    }

} catch(err) {
    showAlert('error',err.response.data.message)
}
};

