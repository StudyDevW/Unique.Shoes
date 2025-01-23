import { useState, useRef, useEffect } from 'react'
import { GetInfoUser_FullName, GetInfoUser_Role  } from '../components/API/AccountInfo.tsx'
import useButtonActiveProfile from '../components/Variables/ProfileMenuVariable.ts'
import useCloseProfileVariable from '../components/Variables/CloseProfileVariable.ts'

const LeftMainProfileButtons: React.FC<{type_button: string, name_button: string}> = ({type_button, name_button}) => {

    const { MPButtonActiveGet, MPButtonActiveSet } = useButtonActiveProfile();


    const ButtonActiveComplete = () => {
        MPButtonActiveSet(type_button)
    }

    const MainButtonActiveClass = () => {
        if (MPButtonActiveGet === type_button)
            return `main_profile_button clicked`
        else 
            return 'main_profile_button'
    }

    const ActiveButtonIndicator = () => {
        if (MPButtonActiveGet === type_button)
        {
            return (
            <>
                <div className="indicator_button_active_panel profile">

                </div>
            </>
            )
        }
        
        return (<></>)
    }

    return (<>
        <div className={MainButtonActiveClass()} onClick={ButtonActiveComplete}>
            {name_button}
            
            {ActiveButtonIndicator()}
        </div>

      
       
    </>)
}

const MyOrders: React.FC = () => {
    return (
    <>
        <div className="title_main_profile_content">Мои заказы</div>

        <div className="content_main_profile_area">
            
        </div>

    </>)
}

const MainProfile: React.FC = () => {

    const { MPButtonActiveGet, MPButtonActiveSet } = useButtonActiveProfile();

    const { closeProfileSet } = useCloseProfileVariable();

    const RolesOut = () => {
        if (GetInfoUser_Role().includes("Admin")) {
            return "Администратор"
        }

        if (GetInfoUser_Role().includes("Manager")) {
            return "Менеджер сайта"
        }

        if (GetInfoUser_Role().includes("User")) {
            return "Обычный пользователь"
        }
    }

    return (
    <>
        <div className="blurred_background">

            <div className="main_content_profile">

                <div className="left_main_profile_area">

                    <div className="main_profile_userinfo_area">

                        <div className="main_profile_userinfo_avatar"></div>

                        <div className="main_profile_userinfo_fullname">{GetInfoUser_FullName()}</div>

                        <div className="main_profile_userinfo_change">{RolesOut()}</div>

                     

                    </div>

                    <div className="shopcart_finalprice_separator margined"></div>

                    <div className="main_profile_buttons_area">
                    
                        <LeftMainProfileButtons name_button='Мои заказы' type_button='MyOrders'/>

                        <LeftMainProfileButtons name_button='Мои отзывы' type_button='MyFeedback'/>

                        <LeftMainProfileButtons name_button='Способы оплаты' type_button='MyPayment'/>
                    </div>

                    <div className="shopcart_finalprice_separator margined" style={{top: '-5px'}}></div>

                    <div className="main_profile_buttons_area small">
                        <div className="main_profile_button exit" onClick={()=>closeProfileSet(true)}>
                            Выход из профиля
                        </div>
                    </div>

                </div>

                <div className="right_main_profile_area">
                    {(MPButtonActiveGet === "MyOrders") && (<MyOrders/>)}
                </div>

            </div>

        </div>
    
    </>)
}

export default MainProfile