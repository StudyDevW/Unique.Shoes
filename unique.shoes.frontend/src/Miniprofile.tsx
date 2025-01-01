import { useState, useEffect } from 'react'
import './preprocessor/App.sass'
import useloginPageOpenedVariable from './components/Variables/OpenLoginPageVariable.ts';
import {  LoginSignOut } from './components/API/LoginAuth.tsx';
import useLoginSuccessVariable from './components/Variables/LoginSuccessVariable.ts';
import { GetInfoUser_Name, GetInfoUser_FullName } from './components/API/AccountInfo.tsx';
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
import useGetInfoUserVariable from './components/Variables/GetInfoUserVariable.ts';

const Miniprofile = (user_authed: boolean) => {
  const [miniProfile, setminiProfile] = useState<boolean>();
  const [closedAnim, setclosedAnim] = useState<boolean>();
  const { loginSuccessGet, loginSuccessSet } = useLoginSuccessVariable();
  const { profileloadingGet } = useLoadingProfile();
  const { userCheckGet } = useGetInfoUserVariable();
  const { loginPageOpenedSet } = useloginPageOpenedVariable();
  
  const login_clicked = () => {
    setminiProfile(prev => !prev)
  }

  const closed_wnd = () => {
    setclosedAnim(true)
    setminiProfile(false)
  }

  const open_login_page = () => {
    setclosedAnim(true)
    setminiProfile(false)
    //OpenLoginPage
    loginPageOpenedSet(true)

  }

  const close_login_page = () => {
    setclosedAnim(false)
    loginPageOpenedSet(false)
    
  }

  const leave_from_account = () => {
    setclosedAnim(true)
    setminiProfile(false)
    LoginSignOut()
    loginSuccessSet(false)
  }



    
  const button_profile = () => {

    if (profileloadingGet) {
        return (
            <>
                <div className="text_login">Загрузка...</div>
            </>
        )
    }

    if (!user_authed) {
         
        if (loginSuccessGet && userCheckGet) {
            return (
                <>
                    <div className="text_login margined" onClick={login_clicked}>{GetInfoUser_Name()}</div>

                </>
            )
        }
        else {
            return (
            <>
                <div className="text_login" onClick={login_clicked}>Войти</div>
            </>
            )
        }
    }
    else {

        return (
            <>
                <div className="text_login" onClick={close_login_page}>Вернуться</div>
            </>
        )

    }
    
  }


  const MiniprofileInAuthed = (closed: boolean) => {


    if (loginSuccessGet) {

        if (closed) {
            return (
                <>
                    <div className="button_profile closed">
                        <div className="text_button_profile">
                            Профиль
                        </div>
        
                        <div className="text_button_profile down">
                            Перейти в свой профиль
                        </div>
                    </div>
        
                    <div className="button_profile closed" onClick={leave_from_account}>
                        <div className="text_button_profile">
                            Выйти
                        </div>
        
                        <div className="text_button_profile down">
                            Выйти из аккаунта
                        </div>
                    </div>
                </>
                )
        }
        else {
            return (
            <>
                <div className="button_profile">
                    <div className="text_button_profile">
                        Профиль
                    </div>

                    <div className="text_button_profile down">
                        Перейти в свой профиль
                    </div>
                </div>

                <div className="button_profile" onClick={leave_from_account}>
                    <div className="text_button_profile">
                        Выйти
                    </div>

                    <div className="text_button_profile down">
                        Выйти из аккаунта
                    </div>
                </div>
            </>
            )
        }
    }
    else {
        if (closed) {
            return (
            <>
                <div className="button_profile closed">
                    <div className="text_button_profile">
                        Войти
                    </div>

                    <div className="text_button_profile down">
                        Если есть уже аккаунт
                    </div>
                </div>

                <div className="button_profile closed">
                    <div className="text_button_profile">
                        Регистрация
                    </div>

                    <div className="text_button_profile down">
                        Создайте новый аккаунт
                    </div>
                </div>
            </>
            )
        }
        else {
            return (
            <>
                <div className="button_profile" onClick={open_login_page}>
                    <div className="text_button_profile">
                        Войти
                    </div>

                    <div className="text_button_profile down">
                        Если есть уже аккаунт
                    </div>
                </div>

                <div className="button_profile">
                    <div className="text_button_profile">
                        Регистрация
                    </div>

                    <div className="text_button_profile down">
                        Создайте новый аккаунт
                    </div>
                </div>
            </>
            )
        }
    }
  }

  const MiniprofileInit = () => {
    if (miniProfile === true) {
        if (loginSuccessGet && userCheckGet) { 
            return (
            <>
                <div className="miniProfile" onMouseLeave={closed_wnd}>

                    <div className="text_button_profile title">
                        {GetInfoUser_FullName()}
                    </div>

                    {MiniprofileInAuthed(false)}
                    
                </div>
            </>
            )
        }
        else {
            return (
            <>
                <div className="miniProfile" onMouseLeave={closed_wnd}>

                    <div className="text_button_profile title">
                        Выберите вариант
                    </div>

                    {MiniprofileInAuthed(false)}
                    
                </div>
            </>
            )
        }
    }
    else if (closedAnim) {
        if (loginSuccessGet && userCheckGet) { 
            return (
            <>
                <div className="miniProfile closed">

                    <div className="text_button_profile title">
                        {GetInfoUser_FullName()}
                    </div>

                    {MiniprofileInAuthed(false)}
                    
                </div>
            </>
            )
        }
        else {
            return (
                <>
                    <div className="miniProfile closed">

                        <div className="text_button_profile title">
                            Выберите вариант
                        </div>

                        {MiniprofileInAuthed(true)}
                    </div>
                </>
            )
        }
    }
  }
  
  const profileAvatar = () => {
    if (loginSuccessGet && userCheckGet && !profileloadingGet) { 
        return (
        <>
            <div className="avatar_mini" onClick={login_clicked}>

            </div>
        </>
        )
    }
  }

//   const window_of_login = () => {
//     if (loginWnd === true){ 
//         return (
//         <>
//             <div className="login_area">
                
//             </div>
//         </>
//         )
//     }}

  useEffect(() => {
    if (loginSuccessGet === true)
        close_login_page();
  }, [loginSuccessGet]);



  return (
    <>
        <div className="profile_area">

            {button_profile()}

          
        </div>

        {profileAvatar()}

        {/* {window_of_login()} */}

        {MiniprofileInit()}
    </>
  )
}

export default Miniprofile
