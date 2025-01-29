import axios from 'axios';
import { TokenNeedUpdate } from '../Observer/TokenObserver';
import Cookies from 'js-cookie';

const handleItemAdd = async (item_name: string, item_price: number, item_desc: string, item_sizes: string[], accessToken: string) => {
   
    const flag_none: string[] = [''];
   
    const response = await axios.post('http://localhost:8082/api/Items/Create', {
        name: item_name,
        description: item_desc,
        flags: flag_none,
        price: item_price,
        count: true,
        sizes: item_sizes
    }, 
    {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    } 
    );

    if (response.status === 200) {
        console.log('Успех:', response.data);

        return true
    }

    
    return false
}

const handleItemDelete = async (itemId: number, accessToken: string, retry: boolean = true) : Promise<any> => {
   
    try {
        const response = await axios.delete(`http://localhost:8082/api/Items/${itemId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            }
        });

        if (response.status === 200) {
            console.log('Успех:', response.data);

            return true
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {

            if (error.response) {
                if (error.response.status === 401 && retry) {

                    console.log("Повторный запрос!");

                    if (await TokenNeedUpdate()) {

                        const accessTokens: string = Cookies.get('AccessToken') as string;

                        return handleItemDelete(itemId, accessTokens, false);
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

export { handleItemAdd, handleItemDelete }