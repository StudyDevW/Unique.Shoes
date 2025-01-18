import axios from 'axios';

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

const handleShopCartInfo = async (userId: number, accessToken: string) => {
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
        console.log("Внутренняя ошибка получения информации о корзине!")
        return null;
    }
}

export { handleShopCartInfo }