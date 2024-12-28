import axios from 'axios';
import Cookies from 'js-cookie';

let loginSuccess: boolean = false;
let errAccessToken: boolean = false;

const handleLogin = async (username: string, password: string) => {
    try {
        const response = await axios.post('http://localhost:8081/api/Authentication/SignIn', {
            username: username,
            password: password
        });

        loginSuccess = true

        console.log('Успех:', response.data);

        const { accessToken, refreshToken } = response.data;

        Cookies.set('AccessToken', accessToken, { expires: 1 });
        Cookies.set('RefreshToken', refreshToken, { expires: 7 });

    } catch (err) {
        // Обработайте ошибку
    }
}

const handleAccessTokenCheck = async (accessToken: string) => {
    try {

        const response = await axios.get('http://localhost:8081/api/Authentication/Validate', {
            headers: {
                accessToken: accessToken,
            },
        });

        loginSuccess = true

        console.log('Токен валид!');

    } catch (err) {
        errAccessToken = true
    }
}

const handleRefreshTokenUpdate = async (refreshTokenIn: string) => {
    try {
        Cookies.remove('AccessToken');
        Cookies.remove('RefreshToken');

        const response = await axios.post('http://localhost:8081/api/Authentication/Refresh', {
            refreshToken: refreshTokenIn
        });

        loginSuccess = true

        console.log('Токены обновлены!:', response.data);

        const { accessToken, refreshToken } = response.data;

        Cookies.set('AccessToken', accessToken, { expires: 1 });
        Cookies.set('RefreshToken', refreshToken, { expires: 7 });
        
    } catch (err) {
        // Обработайте ошибку
    }
}

const CheckLoginSuccess = () => {
    return loginSuccess
}

const CheckErrorAccessToken = () => {
    return errAccessToken
}

const LoginSignOut = () => {
    loginSuccess = false
    
    Cookies.remove('AccessToken');
    Cookies.remove('RefreshToken');

    console.log('Выход из аккаунта!');
}

export { 
    handleLogin, 
    handleAccessTokenCheck, 
    handleRefreshTokenUpdate, 
    CheckLoginSuccess, 
    LoginSignOut, 
    CheckErrorAccessToken 
}