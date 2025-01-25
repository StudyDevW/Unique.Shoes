import { useState, useEffect } from "react"
import Cookies from 'js-cookie';
import axios from 'axios';
import { handleAccessTokenCheck, handleRefreshTokenUpdate } from "../API/LoginAuth.tsx";


const AccessTokenUpdate = async () => {
    const refreshTokens: string = Cookies.get('RefreshToken') as string;

    if (refreshTokens !== undefined) {
        try {
            await handleRefreshTokenUpdate(refreshTokens);
            return true;
        }
        catch (e) {
            console.log("Токен обновления недействителен!");
            return false;
        }
    }

    return false;
}

const AccessCheckBackground = async () => {
    const accessTokens: string = Cookies.get('AccessToken') as string;
   

    if (accessTokens !== undefined) {
        try {
            await handleAccessTokenCheck(accessTokens);
        }   
        catch (e) {
            await AccessTokenUpdate();
        }
    }
}

const TokenNeedUpdate = async () => {
    var upd = await AccessTokenUpdate();

    return upd;
}



const ObserverTokens = async () => {
    useEffect(()=>{
        const intervalId = setInterval(()=>{AccessCheckBackground()}, 2000);

        return () => clearInterval(intervalId);
    }, [])
}

export { ObserverTokens, TokenNeedUpdate, AccessCheckBackground }