import axios from 'axios';
import { TokenNeedUpdate } from '../Observer/TokenObserver.ts';
import Cookies from 'js-cookie';

interface MessagePrintFeed {
    sendTime: string,
    userName: string,
    message: string,
    user_role: string
}

interface MessagePreviewFeed {
    sendTime: string,
    userId: number,
    userName: string,
    message: string
}

let messagesGet: MessagePrintFeed[] = []

let messagesManagerGet: MessagePreviewFeed[] = []

const handleMessageSend = async (message: string, accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.post('http://localhost:8082/api/Feedback/SendMessage/User', message, 
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.status === 200) {
            return true;
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleMessageSend(message, accessTokens, false);
                    }
                }
                else {
                    console.log(`Ошибка: ${error.response.status}`);
                }
            }
            else {
                console.log("Неизвестная ошибка");
                return false;
            }

        }

        return false;
    }
}

const handleMessageSendManager = async (userId: number, message: string, accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.post(`http://localhost:8082/api/Feedback/SendMessage/Manager/${userId}`, message, 
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
        });

        if (response.status === 200) {
            return true;
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleMessageSendManager(userId, message, accessTokens, false);
                    }
                }
                else {
                    console.log(`Ошибка: ${error.response.status}`);
                }
            }
            else {
                console.log("Неизвестная ошибка");
                return false;
            }

        }

        return false;
    }
}


const handleMessageGet = async (userId: number, accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:8082/api/Feedback/GetMessages/${userId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            messagesGet = response.data;
            return messagesGet;
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleMessageGet(userId, accessTokens, false);
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

        return null;
    }
}


const handleMessageGetForManager = async (accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:8082/api/Feedback/GetMessages/UserMessages`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (response.status === 200) {
            messagesManagerGet = response.data;
            return messagesManagerGet;
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleMessageGetForManager(accessTokens, false);
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

        return null;
    }
}


export { handleMessageSend, handleMessageGet, handleMessageGetForManager, handleMessageSendManager }