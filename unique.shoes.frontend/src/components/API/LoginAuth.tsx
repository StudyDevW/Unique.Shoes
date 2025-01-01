import axios from 'axios';
import Cookies from 'js-cookie';
import useLoginSuccessVariable from '../Variables/LoginSuccessVariable.ts';

const handleLogin = async (username: string, password: string) => {




    const response = await axios.post('http://localhost:8081/api/Authentication/SignIn', {
        username: username,
        password: password
    });

    if (response.status === 200) {
        console.log('Успех:', response.data);

        const { accessToken, refreshToken } = response.data;

        Cookies.set('AccessToken', accessToken, { expires: 1 });
        Cookies.set('RefreshToken', refreshToken, { expires: 7 });

        return true
    }
    

    return false
  

}

const handleAccessTokenCheck = async (accessToken: string) => {

    const response = await axios.get('http://localhost:8081/api/Authentication/Validate', {
        headers: {
            accessToken: accessToken,
        },
    });


    if (response.status === 200) {
        console.log('Токен валид!');
        return true
    }

    console.log('Токен не действительный!');
    return false
}

const handleRefreshTokenUpdate = async (refreshTokenIn: string) => {

    Cookies.remove('AccessToken');
    Cookies.remove('RefreshToken');

    const response = await axios.post('http://localhost:8081/api/Authentication/Refresh', {
        refreshToken: refreshTokenIn
    });

    if (response.status === 200) {
        console.log('Токены обновлены!:', response.data);

        const { accessToken, refreshToken } = response.data;

        Cookies.set('AccessToken', accessToken, { expires: 1 });
        Cookies.set('RefreshToken', refreshToken, { expires: 7 });

        return true
    }

    console.log('Ошибка обновления токенов!');
    return false;

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

}