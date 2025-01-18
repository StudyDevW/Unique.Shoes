import axios from 'axios';

const handleShopCardAddItem = async (userId: number, hashName: string, size: string, accessToken: string) => {
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

    return false
}

const handleShopCartItemExist = async (userId: number, hashName: string, accessToken: string) => {
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
        

    return false
}

export { handleShopCardAddItem, handleShopCartItemExist }