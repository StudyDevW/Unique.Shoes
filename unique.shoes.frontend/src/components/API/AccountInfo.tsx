import axios from 'axios';

let roleUser: string = "";
let fullNameInternal: string = "";
let firstNameInternal: string = "";

const handleGetUserInfo = async (accessToken: string) => {
 
    try {
        const response = await axios.get('http://localhost:8081/api/Accounts/Me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { lastName, firstName, roles } = response.data;

        fullNameInternal = `${lastName} ${firstName}`
        firstNameInternal = firstName
        roleUser = roles

        return true

    } catch (error) {
        console.log("Внутренняя ошибка получения информации о пользователе!")
        return false
    } finally {
    }
}

const ResetInfoUser = () => {
    firstNameInternal = ""
    fullNameInternal = ""
    roleUser = ""
}

const GetInfoUser_Name = () => {
    return firstNameInternal
}

const GetInfoUser_FullName = () => {
    return fullNameInternal
}

const GetInfoUser_Role = () => {
    return roleUser
}



export { handleGetUserInfo, GetInfoUser_Name, GetInfoUser_FullName, GetInfoUser_Role, ResetInfoUser }