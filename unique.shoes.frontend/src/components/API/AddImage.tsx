import axios from 'axios';

const handleImageUpload = async (nameItem: string, file: File[] | null, accessToken: string) => {

    if (file === null)
        return false;

    const formData = new FormData();
    
    file.forEach((image) => {
        formData.append('fileMassive', image);
    });

    const response = await axios.post(`http://localhost:8082/api/Images/Upload`, formData, 
    {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
        },
        params: {
            itemName: nameItem
        }
    } 
    );

    if (response.status === 200) {
        console.log('Изображения успешно загружены');
        return true
    }
    else {
        console.error('Ошибка при загрузке изображений');
        return false
    }
};

export { handleImageUpload }