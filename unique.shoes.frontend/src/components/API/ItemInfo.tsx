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

const handleGetItemInfo = async () => {
    try {
        const response = await axios.get('http://localhost:8082/api/Items');

        if (response.status === 200)  {
            item_all_info = response.data;
            return item_all_info;
        }
            
        return null;

    } catch (error) {
        console.log("Внутренняя ошибка получения информации о товаре!");
        return null;
    } 
}

const handleLoadImage = async (filePath: string) => {
    try {
        const response = await axios.get('http://localhost:8082/api/Images/GetImage', {
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

const handleLoadImagesArray = async (filePaths: string[]) => {
    try {
        let arrImages: string[] = [''];

        for (var i = 0; i < filePaths.length; i++) {
            const response = await axios.get('http://localhost:8082/api/Images/GetImage', {
                responseType: 'blob',
                headers: {
                    filePath: filePaths[i]
                },
            });

            arrImages[i] = (URL.createObjectURL(response.data))
        }

        return arrImages;

    } catch (error) {
        console.log("Внутренняя ошибка получения информации о товаре!")
        return null
    } 
}

export { handleGetItemInfo, handleLoadImage, handleLoadImagesArray }