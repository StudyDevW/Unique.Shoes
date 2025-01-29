import { useState, useRef, useEffect } from 'react'
import useLoadingProfile from '../Variables/LoadingProfileVariable.ts';
import '../../preprocessor/App.sass'
// import { handleLogin } from '../API/LoginAuth.tsx';
import useloginPageOpenedVariable from '../Variables/OpenLoginPageVariable.ts';
import useregisterPageOpenedVariable from '../Variables/OpenRegisterPageVariable.ts';
import { handleRegister } from '../API/RegisterAuth.tsx';

const RegisterPage: React.FC = () => {
  const { profileloadingSet } = useLoadingProfile();
  const { registerPageOpenedSet } = useregisterPageOpenedVariable();
  const { loginPageOpenedSet } = useloginPageOpenedVariable()
  const [firstNameValue, setFirstNameValue] = useState('');
  const [lastNameValue, setLastNameValue] = useState('');
  const [loginValue, setLogin] = useState('');
  const [passwordValue, setPassword] = useState('');

  const [registerHandler, setregisterHandler] = useState<boolean>(false)

  const ButtonClicked = () => {
    setregisterHandler(true)
  }

  const handlerChecker = async () => {
    if (await handleRegister(firstNameValue, lastNameValue, loginValue, passwordValue) === true) {
      loginPageOpenedSet(true)
      registerPageOpenedSet(false)
    }
    else {
      loginPageOpenedSet(false)
    }
  }

  useEffect(() => {
    if (registerHandler)
      handlerChecker();
    
  }, [registerHandler]);

  return (
    <>
        <div className="blurred_background">
            <div className="main_content_login" style={{height: '620px'}}>
              <div className="right_area_register_decor" style={{marginTop: '115px'}}>

                <div className="left_area_block first">

                </div>

                <div className="left_area_block second">
                  
                </div>

                <div className="left_area_block third">
                  
                </div>

                <div className="left_area_block four">
                  
                </div>

              </div>

              <div className="left_area_register">
                <div className="title_login" style={{marginLeft: '10px', fontSize: '55px'}}>Регистрация</div>

                <div className="input_login_area" style={{height: '450px'}}>

                  <div className="input_sideline">
                    <div className="title_input">Имя</div>

                    <input className="input_text" 
                    type="text"
                    value={firstNameValue}
                    onChange={(e) => setFirstNameValue(e.target.value)}></input>

                  </div>

                  <div className="input_sideline smallspace">
                    <div className="title_input">Фамилия</div>

                    <input className="input_text" 
                    type="text"
                    value={lastNameValue}
                    onChange={(e) => setLastNameValue(e.target.value)}></input>

                  </div>

                  <div className="input_sideline smallspace">
                    <div className="title_input">Логин</div>

                    <input className="input_text" 
                    type="text"
                    value={loginValue}
                    onChange={(e) => setLogin(e.target.value)}></input>

                  </div>

                  <div className="input_sideline smallspace">
                    <div className="title_input">Пароль</div>

                    <input type="password" className="input_text" 
                    value={passwordValue}
                    onChange={(e) => setPassword(e.target.value)}></input>

                  </div>

                  <div className="login_button" style={{marginLeft: '188px',width: '190px'}}>
                    <div className="button_text_login"onClick={ButtonClicked}>Продолжить</div>
                  </div>

                </div>

              </div>

              <div className="star first" style={{ marginLeft: "calc(100% - 65px)", marginTop: "120px" }}></div>

              <div className="star four" style={{ marginLeft: "475px", marginTop: "471px", width: "50px", height: "50px" }}></div>

              <div className="star five" style={{ marginLeft: "420px", marginTop: "239px", width: "50px", height: "50px" }}></div>


            </div>
        </div>
    </>
  )
}

export default RegisterPage
