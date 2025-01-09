import axios from 'axios';

const handleItemAdd = async (item_name: string, item_price: number, item_desc: string, item_sizes: string[], accessToken: string) => {
   
    const flag_none: string[] = [''];
   
    const response = await axios.post('http://localhost:8082/api/Items/Create', {
        name: item_name,
        description: item_desc,
        flags: flag_none,
        price: item_price,
        count: true,
        imageLink: '../images/inprogress',
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

export { handleItemAdd }