import axios from 'axios';


let fullNameInternal: string = "";
let firstNameInternal: string = "";

const handleGetUserInfo = async (accessToken: string) => {
 
    try {
        const response = await axios.get('http://localhost:8081/api/Accounts/Me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { lastName, firstName } = response.data;

        fullNameInternal = `${lastName} ${firstName}`
        firstNameInternal = firstName

        return true

    } catch (error) {
        console.log("Внутренняя ошибка получения информации о пользователе!")
        return false
    } finally {
    }
}


const GetInfoUser_Name = () => {
    return firstNameInternal
}

const GetInfoUser_FullName = () => {
    return fullNameInternal
}


export { handleGetUserInfo, GetInfoUser_Name, GetInfoUser_FullName }