import axios from 'axios';
import { TokenNeedUpdate } from '../Observer/TokenObserver.ts';
import Cookies from 'js-cookie';

interface OrdersGetProperties {
    orders: {
       hashPay: string,
       payStatus: string,
       deliveryStatus: string,
       deliveryAddress: string, 
       price: number,
       creationDate: string,
       items: {
          itemId: number,
          hashName: string,
          name: string,
          price: number,
          countItem: number,
          size: string,
          imageLink: string
       }[]
    }[]
}

let orders_all_info: OrdersGetProperties;



interface PayItemsProperties {
    hashName: string,
    size: string,
    count: number
}

const handleOrderCheck = async (userId: number, accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:8082/api/Order/Check/${userId}`, {
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

                        return handleOrderCheck(userId, accessTokens, false);
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

const handleOrderRequest = async (userId: number, address: string, price_order: number, items: PayItemsProperties[],  accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.post(`http://localhost:8082/api/Order/Pay`, {
            userId: userId,
            deliveryAddress: address,
            price: price_order,
            items: items
        }, 
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (response.status === 200) {
            return response.data;
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
                        
                        return handleOrderRequest(userId, address, price_order, items, accessTokens, false);
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

const handleOrdersInfo = async (userId: number, accessToken: string, retry: boolean = true) : Promise<any> => {
    try {
        const response = await axios.get(`http://localhost:8082/api/Order/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
        });

        if (response.status === 200) {
            orders_all_info = response.data;
            return orders_all_info;
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

                        return handleOrdersInfo(userId, accessTokens, false);
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

export { handleOrdersInfo, handleOrderRequest, handleOrderCheck }