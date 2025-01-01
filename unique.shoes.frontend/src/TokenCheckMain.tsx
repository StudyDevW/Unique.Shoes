import { useState, useRef, useEffect } from 'react'
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
import { handleAccessTokenCheck, handleRefreshTokenUpdate } from './components/API/LoginAuth.tsx'
import Cookies from 'js-cookie';
import useLoginSuccessVariable from './components/Variables/LoginSuccessVariable.ts';
import useGetInfoUserVariable from './components/Variables/GetInfoUserVariable.ts';
import useErrAccessTokenVariable from './components/Variables/ErrAccessTokenVariable.ts';

import { handleGetUserInfo } from './components/API/AccountInfo.tsx';

const CheckTokensValidate = () => {

    const { profileloadingSet } = useLoadingProfile();
    const { loginSuccessGet, loginSuccessSet } = useLoginSuccessVariable();
    const { userCheckSet } = useGetInfoUserVariable();
    const { errAccessGet, errAccessSet } = useErrAccessTokenVariable();

    const TokensUpdate = async () => {
      const refreshTokens: string = Cookies.get('RefreshToken') as string;
      if (refreshTokens !== undefined) {
        profileloadingSet(true);

        if (await handleRefreshTokenUpdate(refreshTokens)) {
          loginSuccessSet(true);
          errAccessSet(false);
          profileloadingSet(false);
        }
        else {
          loginSuccessSet(false);
          profileloadingSet(false);
        }
      }
      else {
        profileloadingSet(false);
      }
    }
  
  
    const TokenCheck = async () => {
      const accessTokens: string = Cookies.get('AccessToken') as string;
      if (accessTokens !== undefined) {
        profileloadingSet(true);

        try {
          const handlerCheck = await handleAccessTokenCheck(accessTokens)

          if (handlerCheck === true) {
            loginSuccessSet(true);
            errAccessSet(false);
            profileloadingSet(false);
          }
        }
        catch (err) {
          loginSuccessSet(false);
          errAccessSet(true);
          profileloadingSet(false);
        }

      }
    

      profileloadingSet(false);
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
  
    //Если AccessToken просрочен, то обновляем
    useEffect(() => {
      if (errAccessGet === true)
        TokensUpdate();
    }, [errAccessGet]);
  
    useEffect(() => {
      if (loginSuccessGet) {
          UserGetInfo();
      }
    }, [loginSuccessGet]);

}

export default CheckTokensValidate