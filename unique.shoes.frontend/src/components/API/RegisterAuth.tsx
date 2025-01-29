import axios from 'axios';
import Cookies from 'js-cookie';


const handleRegister = async (firstName: string, lastName: string, username: string, password: string) => {

    const response = await axios.post('http://localhost:8081/api/Authentication/SignUp', {
        lastName: lastName,
        firstName: firstName,
        username: username,
        password: password
    });

    if (response.status === 200) {
        console.log('Успех:', response.data);

        return true
    }
    

    return false
}

export { handleRegister }