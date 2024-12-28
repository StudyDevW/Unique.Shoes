import { useState } from 'react'
import './preprocessor/App.sass'
import { handleLogin } from './components/API/LoginAuth.tsx';

const LoginPage: React.FC = () => {

  const [loginValue, setLogin] = useState('');
  const [passwordValue, setPassword] = useState('');

  const ButtonClicked = () => {
    handleLogin(loginValue, passwordValue)
  }

  return (
    <>
        <div className="blurred_background">
            <div className="main_content_login">
              <div className="left_area_login_decor">

                <div className="left_area_block first">

                </div>

                <div className="left_area_block second">
                  
                </div>

                <div className="left_area_block third">
                  
                </div>

                <div className="left_area_block four">
                  
                </div>

              </div>

              <div className="right_area_login">
                <div className="title_login">Вход</div>

                <div className="input_login_area">

                  <div className="input_sideline">
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

                  <div className="login_button">
                    <div className="button_text_login" onClick={ButtonClicked}>Войти</div>
                  </div>

                </div>

              </div>

              <div className="star second" style={{ marginLeft: "calc(100% - 65px)", marginTop: "390px" }}></div>

              <div className="star third" style={{ marginLeft: "45px", marginTop: "39px", width: "50px", height: "50px" }}></div>

              <div className="star four" style={{ marginLeft: "395px", marginTop: "391px", width: "50px", height: "50px" }}></div>

              <div className="star five" style={{ marginLeft: "200px", marginTop: "239px", width: "50px", height: "50px" }}></div>


            </div>
        </div>
    </>
  )
}

export default LoginPage
