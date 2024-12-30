import { useState, useRef, useEffect } from 'react'
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
import { handleAccessTokenCheck, CheckErrorAccessToken, handleRefreshTokenUpdate } from './components/API/LoginAuth.tsx'
import Cookies from 'js-cookie';
import useLoginSuccessVariable from './components/Variables/LoginSuccessVariable.ts';
import useGetInfoUserVariable from './components/Variables/GetInfoUserVariable.ts';

import { handleGetUserInfo } from './components/API/AccountInfo.tsx';

const CheckTokensValidate = () => {

    const { profileloadingSet } = useLoadingProfile();
    const { loginSuccessGet } = useLoginSuccessVariable();
    const { userCheckSet } = useGetInfoUserVariable();

    const TokensUpdate = () => {
      const refreshTokens: string = Cookies.get('RefreshToken') as string;
  
      handleRefreshTokenUpdate(refreshTokens)
    }
  
  
    const TokenCheck = async () => {
      const accessTokens: string = Cookies.get('AccessToken') as string;
      if (accessTokens !== undefined) {
        if (await handleAccessTokenCheck(accessTokens)) {
          profileloadingSet(true)
        }
      }
      else {
        profileloadingSet(false)
      }
    }
  
    const UserGetInfo = async () => {
      const accessTokens: string = Cookies.get('AccessToken') as string;
      if (accessTokens !== undefined) {

        if (await handleGetUserInfo(accessTokens) === true) {
          userCheckSet(true)
          
        }

        profileloadingSet(false)
      }

  
    }
  
    useEffect(() => {
      TokenCheck();
    }, []);
  
    useEffect(() => {
      if (CheckErrorAccessToken() === true)
        TokensUpdate();
    }, [CheckErrorAccessToken()]);
  
    useEffect(() => {
      if (loginSuccessGet) {
          UserGetInfo();
      }
    }, [loginSuccessGet]);

}

export default CheckTokensValidate