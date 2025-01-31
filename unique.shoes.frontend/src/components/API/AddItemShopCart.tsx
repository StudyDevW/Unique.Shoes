import axios from 'axios';
import { TokenNeedUpdate } from '../Observer/TokenObserver';
import Cookies from 'js-cookie';

const handleShopCardAddItem = async (userId: number, hashName: string, size: string, accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.post('http://localhost:8082/api/ShopCart', {
            userId: userId,
            hashName: hashName,
            countItem: 1,
            size: size
        }, 
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        } 
        );

        if (response.status === 200) {
            console.log('Товар добавлен в корзину:', response.data);

            return true
        }
    }
    catch(error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleShopCardAddItem(userId, hashName, size, accessTokens, false);
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

    return false
}

const handleShopCartItemExist = async (userId: number, hashName: string, accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.get('http://localhost:8082/api/ShopCart/Exist', {
            params: {
                userId: userId,
                hashName: hashName
            },
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status === 200) {
            if (response.data === "item_exist") {
                return true;
            }
            else {
                return false;
            }
        }
    } 
    catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleShopCartItemExist(userId, hashName, accessTokens, false);
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

    return false
}

export { handleShopCardAddItem, handleShopCartItemExist }