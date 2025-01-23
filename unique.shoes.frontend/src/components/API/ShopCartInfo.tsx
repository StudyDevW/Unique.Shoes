import axios from 'axios';
import { TokenNeedUpdate } from '../Observer/TokenObserver.ts';
import Cookies from 'js-cookie';

interface ShopCartProperties {
    shopCartInfo: {
        count: number,
        totalPrice: number
    },
    shopCartItem: {
        id: number,
        itemId: number,
        hashName: string,
        name: string,
        price: number,
        countItem: number,
        size: string,
        imageLink: string
    }[]
}

let shopcart_all_info: ShopCartProperties;

const handleShopCartInfo = async (userId: number, accessToken: string, retry: boolean = true): Promise<any> => {

    try {

        const response = await axios.get('http://localhost:8082/api/ShopCart/All', {
            params: {
                userId: userId
            },
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (response.status === 200) {
                
            shopcart_all_info = response.data;
            return shopcart_all_info;
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

                        return handleShopCartInfo(userId, accessTokens, false);
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

const handleShopCartDelete = async (itemId: number, accessToken: string, retry: boolean = true): Promise<any>  => {
    try {
        const response = await axios.delete(`http://localhost:8082/api/ShopCart/${itemId}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (response.status === 200) {
            return true;
        }
        
        return false;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {
                        
                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleShopCartDelete(itemId, accessTokens, false);
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

const handleShopCartInfoUpdateCount = async (itemId: number, countItem: number, accessToken: string, retry: boolean = true): Promise<any> => {
    try {
        const response = await axios.put(`http://localhost:8082/api/ShopCart/${itemId}`, {
            countItem: countItem
        },
        {
          
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (response.status === 200) {
            return true;
        }
        
        return false;
    }
    catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {
                        
                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleShopCartInfoUpdateCount(itemId, countItem, accessTokens, false);
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

export { handleShopCartInfo, handleShopCartDelete, handleShopCartInfoUpdateCount }