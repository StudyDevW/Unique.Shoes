import axios from 'axios';

interface ItemProperties {
    id: number,
    hashName: string,
    name: string,
    description: string
    flags: string[]
    price: number
    count: boolean
    sizes: string[]
    imagePaths: string[]
}

let item_all_info: ItemProperties[];

const handleGetItemInfo = async (accessToken: string) => {
    try {
        const response = await axios.get('http://localhost:8082/api/Items', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        item_all_info = response.data;

        return item_all_info;

    } catch (error) {
        console.log("Внутренняя ошибка получения информации о товаре!")
        return null
    } 
}

const handleLoadImage = async (filePath: string) => {
    try {
        const response = await axios.get('http://localhost:8082/api/Items/Images/GetImage', {
            responseType: 'blob',
            headers: {
                filePath: filePath
            },
        });

        return URL.createObjectURL(response.data);

    } catch (error) {
        console.log("Внутренняя ошибка получения информации о товаре!")
        return null
    } 
}

export { handleGetItemInfo, handleLoadImage }