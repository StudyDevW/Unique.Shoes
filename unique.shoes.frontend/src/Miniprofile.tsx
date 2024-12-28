import { useState, useEffect } from 'react'
import './preprocessor/App.sass'
import { SetOpenLogin, GetOpenLogin } from './components/Components.tsx'
import { CheckLoginSuccess, LoginSignOut } from './components/API/LoginAuth.tsx';

function Miniprofile(user_authed: boolean) {

  const [miniProfile, setminiProfile] = useState<boolean>();
  const [closedAnim, setclosedAnim] = useState<boolean>();

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
    SetOpenLogin(true)
  }

  const close_login_page = () => {
    setclosedAnim(false)
    SetOpenLogin(false)
  }

  const leave_from_account = () => {
    setclosedAnim(true)
    setminiProfile(false)
    LoginSignOut()
  }

  const button_profile = () => {
    if (!user_authed) {
        if (CheckLoginSuccess()) {
            return (
                <>
                    <div className="text_login" onClick={login_clicked}>Успех</div>
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

        if (CheckLoginSuccess()) {
            close_login_page();
        }
   
        return (
            <>
                <div className="text_login" onClick={close_login_page}>Вернуться</div>
            </>
        )
    
    }
  }

  const MiniprofileInAuthed = (closed: boolean) => {
    if (CheckLoginSuccess()) {

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
    else if (closedAnim) {
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
  
//   const window_of_login = () => {
//     if (loginWnd === true){ 
//         return (
//         <>
//             <div className="login_area">
                
//             </div>
//         </>
//         )
//     }}


  return (
    <>
        <div className="profile_area">
            {button_profile()}
        </div>

        {/* {window_of_login()} */}

        {MiniprofileInit()}
    </>
  )
}

export default Miniprofile
