import axios from 'axios';
import Cookies from 'js-cookie';
import useLoginSuccessVariable from '../Variables/LoginSuccessVariable.ts';
import { ResetInfoUser } from './AccountInfo.tsx'; 
import { TokenNeedUpdate } from '../Observer/TokenObserver.ts';

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

const handleAccessTokenCheck = async (accessToken: string, retry: boolean = true): Promise<any> => {

    try {
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
    catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleAccessTokenCheck(accessTokens, false);
                    }
                }
                else {
                    console.log(`Ошибка: ${error.response.status}`);
                }
            }
            else {
                console.log("Неизвестная ошибка");
                return null;
            }

        }
    }
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

    ResetInfoUser();

    console.log('Выход из аккаунта!');
}

export { 
    handleLogin, 
    handleAccessTokenCheck, 
    handleRefreshTokenUpdate, 
    LoginSignOut, 

}