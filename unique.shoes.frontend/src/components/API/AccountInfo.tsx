import axios from 'axios';
import { TokenNeedUpdate } from '../Observer/TokenObserver';
import Cookies from 'js-cookie';

interface infoOut {
    id: number,
    lastName: string,
    firstName: string,
    roles: string[]
}

let infoUser: infoOut = { id: -1, firstName: "", lastName: "", roles: [] };

const handleGetUserInfo = async (accessToken: string, retry: boolean = true): Promise<any> => {
 
    try {
        const response = await axios.get('http://localhost:8081/api/Accounts/Me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status === 200) {
            infoUser = response.data;
            console.log(infoUser)
            return true
        }

        return false

    } catch (error) {
        
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleGetUserInfo(accessTokens, false);
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


    
        return false
    } 
}

const ResetInfoUser = () => {
   
}

const GetInfoUser_Name = () => {
    return infoUser.firstName
}

const GetInfoUser_FullName = () => {
    return `${infoUser.firstName} ${infoUser.lastName}`
}

const GetInfoUser_Role = () => {
    return infoUser.roles
}

const GetInfoUser_Id = () => {
    return infoUser.id;
}


export { handleGetUserInfo, GetInfoUser_Name, GetInfoUser_FullName, GetInfoUser_Role, ResetInfoUser, GetInfoUser_Id }