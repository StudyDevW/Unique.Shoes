import axios from 'axios';
import { TokenNeedUpdate } from '../Observer/TokenObserver.ts';
import Cookies from 'js-cookie';

interface SessionGetProperties {
    timeAdd: string,
    timeUpd: string,
    timeDel: string,
    statusSession: string
}

let sessions: SessionGetProperties[] = [];

const handleSessionsGet = async (accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:8081/api/Authentication/Sessions`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (response.status === 200) {
            sessions = response.data;
            return sessions;
        }

        return null;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleSessionsGet(accessTokens, false);
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

export { handleSessionsGet }