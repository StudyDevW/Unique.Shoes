import { useState, useEffect } from 'react'
import './preprocessor/App.sass'
import useloginPageOpenedVariable from './components/Variables/OpenLoginPageVariable.ts';
import {  LoginSignOut } from './components/API/LoginAuth.tsx';
import useLoginSuccessVariable from './components/Variables/LoginSuccessVariable.ts';
import { GetInfoUser_Name, GetInfoUser_FullName, GetInfoUser_Role, GetInfoUser_Id } from './components/API/AccountInfo.tsx';
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
import useGetInfoUserVariable from './components/Variables/GetInfoUserVariable.ts';
import useOpenProfileVariable from './components/Variables/OpenProfileVariable.ts';
import useCloseProfileVariable from './components/Variables/CloseProfileVariable.ts';
import { useNavigate, useLocation } from 'react-router-dom';

const Miniprofile = (user_authed: boolean) => {
  const [miniProfile, setminiProfile] = useState<boolean>();
  const [closedAnim, setclosedAnim] = useState<boolean>();
  const { closeProfileGet, closeProfileSet } = useCloseProfileVariable();
  const { loginSuccessGet, loginSuccessSet } = useLoginSuccessVariable();
  const { profileloadingGet, profileloadingSet } = useLoadingProfile();
  const { userCheckGet } = useGetInfoUserVariable();
  const { loginPageOpenedGet, loginPageOpenedSet } = useloginPageOpenedVariable();
  const { openProfileGet, openProfileSet } = useOpenProfileVariable();


  const location = useLocation();

  const navigate = useNavigate();
  
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

  const open_profile_page = () => {
    setclosedAnim(true)
    setminiProfile(false)
    openProfileSet(true)
  }


  const close_login_page = () => {
    setclosedAnim(false)
    loginPageOpenedSet(false)
    
  }

  const close_profile_page = () => {
    setclosedAnim(false)
    openProfileSet(false);
  }

  useEffect(()=>{
    if (closeProfileGet) {
        close_profile_page();
        setminiProfile(false)
        LoginSignOut()
        loginSuccessSet(false)
        closeProfileSet(false);
    }

  }, [closeProfileGet])


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
                <div className="text_login" onClick={() => {openProfileGet ? close_profile_page() : close_login_page() }}>Вернуться</div>
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
        
                    <div className="button_profile closed">
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
                {(location.pathname === "/manager_panel") && (<>
                    <div className="button_profile" onClick={()=>navigate("/")}>
                        <div className="text_button_profile">
                            Вернуться
                        </div>

                        <div className="text_button_profile down">
                            Перейти на главную
                        </div>
                    </div>
                </>)}

                {(location.pathname !== "/manager_panel") && (<>
                    <div className="button_profile" onClick={open_profile_page}>
                        <div className="text_button_profile">
                            Профиль
                        </div>

                        <div className="text_button_profile down">
                            Перейти в свой профиль
                        </div>
                    </div>
                </>)}

                {((GetInfoUser_Role().includes('Manager') || GetInfoUser_Role().includes('Admin')) && location.pathname !== "/manager_panel") && (
                <>
                  <div className="button_profile" onClick={()=>navigate('/manager_panel')}>
                    <div className="text_button_profile">
                        Панель Менеджера
                    </div>

                    <div className="text_button_profile down">
                        Управление сайтом
                    </div>
                </div>
                </>)}

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
    if (loginSuccessGet && userCheckGet && !profileloadingGet && !openProfileGet) { 
        
      

        if (location.pathname === "/manager_panel") {
            return (
                <>
                    <div className="avatar_mini">
        
                    </div>
                </>)
        }
        
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

  useEffect(()=>{
    if (openProfileGet && profileloadingGet && GetInfoUser_Id() !== -1) {
        open_profile_page();
    }

  }, [loginSuccessGet || GetInfoUser_Id() || profileloadingGet])


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
