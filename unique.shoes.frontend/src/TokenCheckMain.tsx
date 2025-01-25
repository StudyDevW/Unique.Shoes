import { useState, useRef, useEffect } from 'react'
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
import { handleAccessTokenCheck, handleRefreshTokenUpdate } from './components/API/LoginAuth.tsx'
import Cookies from 'js-cookie';
import useLoginSuccessVariable from './components/Variables/LoginSuccessVariable.ts';
import useGetInfoUserVariable from './components/Variables/GetInfoUserVariable.ts';
import useErrAccessTokenVariable from './components/Variables/ErrAccessTokenVariable.ts';
import { useNavigate, useLocation } from 'react-router-dom';
import useOpenProfileVariable from './components/Variables/OpenProfileVariable.ts'
import { AccessCheckBackground } from './components/Observer/TokenObserver.ts';
import { GetInfoUser_Id, handleGetUserInfo } from './components/API/AccountInfo.tsx';


const CheckTokensValidate = async () => {

  const accessTokens: string = Cookies.get('AccessToken') as string;
  if (accessTokens !== undefined) {

      var userCheck = await handleGetUserInfo(accessTokens);

      if (userCheck) {
        return true;
      }

     return false;
  }

  return false;
}



export default CheckTokensValidate