import axios from 'axios';
import Cookies from 'js-cookie';
import useLoginSuccessVariable from '../Variables/LoginSuccessVariable.ts';


let errAccessToken: boolean = false;
let errRefreshToken: boolean = false;

const handleLogin = async (username: string, password: string) => {

    try {
      
        const response = await axios.post('http://localhost:8081/api/Authentication/SignIn', {
            username: username,
            password: password
        });

        console.log('Успех:', response.data);

        const { accessToken, refreshToken } = response.data;

        Cookies.set('AccessToken', accessToken, { expires: 1 });
        Cookies.set('RefreshToken', refreshToken, { expires: 7 });

        return true

    } catch (err) {
        // Обработайте ошибку
        return false
    } 
}

const handleAccessTokenCheck = async (accessToken: string) => {
    try {

        const response = await axios.get('http://localhost:8081/api/Authentication/Validate', {
            headers: {
                accessToken: accessToken,
            },
        });

        console.log('Токен валид!');

        return true

    } catch (err) {
        return false
    }
}

const handleRefreshTokenUpdate = async (refreshTokenIn: string) => {
    try {
        const { loginSuccessSet } = useLoginSuccessVariable();

        Cookies.remove('AccessToken');
        Cookies.remove('RefreshToken');

        const response = await axios.post('http://localhost:8081/api/Authentication/Refresh', {
            refreshToken: refreshTokenIn
        });

        loginSuccessSet(true);

        console.log('Токены обновлены!:', response.data);

        const { accessToken, refreshToken } = response.data;

        Cookies.set('AccessToken', accessToken, { expires: 1 });
        Cookies.set('RefreshToken', refreshToken, { expires: 7 });
        
    } catch (err) {
 
    } finally {

    }
}

const CheckErrorAccessToken = () => {
    return errAccessToken
}


const LoginSignOut = () => {

    
    Cookies.remove('AccessToken');
    Cookies.remove('RefreshToken');

    console.log('Выход из аккаунта!');
}

export { 
    handleLogin, 
    handleAccessTokenCheck, 
    handleRefreshTokenUpdate, 
    LoginSignOut, 
    CheckErrorAccessToken 
}