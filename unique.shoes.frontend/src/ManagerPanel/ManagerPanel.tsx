import Header from "../Header.tsx"
import Cookies from 'js-cookie';
import CheckTokensValidate from "../TokenCheckMain.tsx"
import useButtonActivePanel from "../components/Variables/PanelMenuVariable.ts";
import AddSectionPanel from "./AddItemPanel.tsx";
import ChangeSectionPanel from "./ChangeItemPanel.tsx";
import useLoginSuccessVariable from '../components/Variables/LoginSuccessVariable.ts';
import useGetInfoUserVariable from '../components/Variables/GetInfoUserVariable.ts';
import { useEffect, useState } from 'react'
import { GetInfoUser_Role } from '../components/API/AccountInfo.tsx';
import { useNavigate } from 'react-router-dom';
import useShopCartVariable from "../components/Variables/ShopCartVariable.ts";
import { ObserverTokens } from "../components/Observer/TokenObserver.ts";
import { handleMessageGet, handleMessageGetForManager, handleMessageSendManager } from "../components/API/Feedback.tsx";

interface MessagePreviewFeed {
    sendTime: string,
    userId: number,
    userName: string,
    message: string
}


interface MessagePrintFeed {
    sendTime: string,
    userName: string,
    message: string,
    user_role: string
}


interface PropertiesButton {
    name_button: string; 
    type_button: string;
}

const ButtonElementForPanel: React.FC<PropertiesButton> = ({name_button, type_button}) => {

    const { PButtonActiveGet, PButtonActiveSet } = useButtonActivePanel();


    const ButtonActiveComplete = () => {
        PButtonActiveSet(type_button)
    }

    const ButtonTypeClass = () => {
        return `icon_area_button_panel ${type_button}`
    }

    const MainButtonActiveClass = () => {
        if (PButtonActiveGet === type_button)
            return `button_panel_with_icon active`
        else 
            return 'button_panel_with_icon'
    }

    const ActiveButtonIndicator = () => {
        if (PButtonActiveGet === type_button)
        {
            return (
            <>
                <div className="indicator_button_active_panel">

                </div>
            </>
            )
        }
        
        return (<></>)
    }

    return (<>
      <div className={MainButtonActiveClass()} onClick={ButtonActiveComplete}>
        <div className={ButtonTypeClass()}></div>

        <div className="vertical_line_button_panel"></div>

        <div className="text_area_button_panel">{name_button}</div>

        {ActiveButtonIndicator()}

      </div>
    </>)
} 

const SupportPage: React.FC = () => {

    const [messageSendClick, setMessageSendClick] = useState<boolean>(false);

    const [messageSendUpd, setMessageSendUpd] = useState<boolean>(false);

    const [messagesUpd, setMessagesUpd] = useState<boolean>(false);

    const [messageInput, setMessageInput] = useState<string>("");

    const [userIdFinded, setUserIdFinded] = useState<number>(0);

    const [messagesUser, setMessagesUser] = useState<MessagePrintFeed[]>();

    const [messagesOut, setMessagesOut] = useState<MessagePreviewFeed[]>();

    const SendMessage = async (userId: number, messageSend: string) =>{
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
            if (await handleMessageSendManager(userId, messageSend, accessTokens)) {
                console.log("Cообщение отправлено!");
                setMessageSendUpd(true);
                
            }
        }
    }

    const GetMessagesPrev = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
            var messagesGet = await handleMessageGetForManager(accessTokens);

            if (messagesGet !== null) {
                setMessagesOut(messagesGet);
            }
        }
    }

    const GetMessages = async (userId: number) => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
            var messagesGet = await handleMessageGet(userId, accessTokens);

            if (messagesGet !== null) {
                setMessagesUser(messagesGet);
                setUserIdFinded(userId)
                setMessagesUpd(true);
            }
        }
    }

    const OnClickUserPrev = async (userId: number) => {
        GetMessages(userId);
    }

    useEffect(()=>{
        GetMessagesPrev();
        
    }, [])

    useEffect(()=>{
        if (messagesOut !== undefined)
            console.log(messagesOut)
    },[messagesOut])

    useEffect(()=>{
        if (messagesUpd) {
            console.log(messagesUser)
            setMessagesUpd(false)
        }
    }, [messagesUpd])

    useEffect(()=>{
        if (messageSendClick && messageInput !== "" && userIdFinded !== 0) {
            SendMessage(userIdFinded, messageInput);
      
            setMessageSendClick(false);
        }
    }, [messageSendClick])

    useEffect(()=>{
        if (messageSendUpd) {
            setMessageInput("");
            GetMessages(userIdFinded);
            setMessageSendUpd(false);
            //GetMessages();
        }
    }, [messageSendUpd])

    const handleKeyDownBack = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (!messageSendClick)
                setMessageSendClick(true);
        }
          
    };

    const DatePrint = (dateFrom: string) => {
        const date = new Date(dateFrom);

        const day = date.getDate();
        const month = date.toLocaleString('russian', { month: 'short' }); // Получаем название месяца

        const formattedHours = String(date.getHours()).padStart(2, '0');
        const formattedMinutes = String(date.getMinutes()).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes} `;
    }

    const sortedMessagesPrev = messagesOut?.sort((a, b) => {
        return new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime();
    });

    const sortedMessagesChat = messagesUser?.sort((a, b) => {
        return new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime();
    });

    return (<>
         <div className="support_manager_panel_area">

            {(sortedMessagesPrev !== undefined) && sortedMessagesPrev.map((user, index) => 
                <div key={index} className="support_manager_panel_item" onClick={()=>OnClickUserPrev(user.userId)}>
                    <div className="support_manager_panel_item_name">
                        {`${user.userName} | ${DatePrint(user.sendTime)}`}
                    </div>

                    <div className="support_manager_panel_item_message">
                        {`Вам: ${user.message}`} 
                    </div>
                </div>
            )}

           

            
         </div>

         <div className="support_manager_panel_area next">
            <div className="support_manager_panel_chat_title">Чат с пользователем</div>

            <div className="support_manager_panel_area_of_chat">
                {(sortedMessagesChat !== undefined) && sortedMessagesChat.map((message, index) => 
                    <div key={index}>
                        {(message.user_role === "User") && 
                            <div className="message_content_support">
                                <div className="message_content_support_manager">
                                    <div className="message_content_support_manager_title">{`${message.userName} | ${DatePrint(message.sendTime)}`}</div>
                                    <div className="message_content_support_manager_message">{message.message}</div>
                                </div>
                            </div>
                        }

                        {(message.user_role === "Manager") && 
                            <div className="message_content_support">
                                <div className="message_content_support_user">
                                    <div className="message_content_support_user_title">{`${DatePrint(message.sendTime)} | Вы`}</div>
                                    <div className="message_content_support_user_message">{message.message}</div>
                                </div>
                            </div>
                        }

                    </div>
                    
                )}
            </div>

            {(sortedMessagesChat !== undefined) && 
                <input  className="input_text whitefull" 
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  style={{width: '540px', marginTop: "600px", marginLeft: "120px", textAlign: 'right'}}
                  onKeyDown={(e) => handleKeyDownBack(e)}>
  
                </input>
            }

            {/* <>

           
                    {(message.user_role === "User") && 
                        <div className="message_content_support">
                            <div className="message_content_support_user">
                                <div className="message_content_support_user_title">{`${DatePrint(message.sendTime)} | Вы`}</div>
                                <div className="message_content_support_user_message">{message.message}</div>
                            </div>
                        </div>
                    }

                    {(message.user_role === "Manager") && 
                        <div className="message_content_support">
                        <div className="message_content_support_manager">
                            <div className="message_content_support_manager_title">{`Ответ менеджера | ${DatePrint(message.sendTime)}`}</div>
                            <div className="message_content_support_manager_message">{message.message}</div>
                        </div>
                        </div>
                    }
                </div>
            </>} */}
                
         </div>
    </>)
}

const ManagerPanel: React.FC = () => {

    const { PButtonActiveGet } = useButtonActivePanel();

    const [managerAccess, managerAccessSet] = useState<boolean>(false);

    const { loginSuccessGet, loginSuccessSet } = useLoginSuccessVariable();

    const navigate = useNavigate()

    
    const NavigatorOfSections = () => {
        if (PButtonActiveGet === "add_button")
            return (<AddSectionPanel/>)
        else if (PButtonActiveGet === "change_button")
            return (<ChangeSectionPanel/>)
        else if (PButtonActiveGet === "garant_button")
            return (<SupportPage/>)

        return (<></>)
    }

    const TitleTextSections = () => {
        if (PButtonActiveGet === "add_button")
            return "Добавить товар"
        else if (PButtonActiveGet === "change_button")
            return "Изменить товар"
        else if (PButtonActiveGet === "garant_button")
            return "Поддержка"

        return "Неизвестная секция"
    }

    const { shopCartGet, shopCartSet } = useShopCartVariable();

    useEffect(()=>{
        shopCartSet(null);
        loginSuccessSet(false);
    }, [])

    // const ScalingElements = () => {
    //     const element = document.querySelector<HTMLElement>('.main_area_manager');

    //     if (element) {
     
    //             // Получаем текущие размеры окна
    //         const windowWidth = window.innerWidth;
    //         const windowHeight = window.innerHeight;

    //     // Вычисляем новый масштаб (например, в зависимости от ширины окна)
    //         const scale = Math.min(windowWidth / 1570, windowHeight / 846); // Замените 1200 и 800 на ваши значения

    //     // Применяем новый масштаб
    //         element.style.transform = `scale(${scale})`;
        
    //     }
    // }

    // ScalingElements();

    useEffect(()=>{
        if (!managerAccess) {
            const interval = setInterval(() => {
                var roleUser = GetInfoUser_Role();

                if (loginSuccessGet && roleUser !== null) {
                    if (roleUser.includes('Manager') || roleUser.includes('Admin')) {
                        managerAccessSet(true)
                    }
                    else {
                        navigate("/")
                    }
                }
                else {
                    console.log(roleUser)
                    managerAccessSet(false)
                    navigate("/")
                }
            }, 1000); 
            return () => clearInterval(interval);
        }
    }, [managerAccess])
    


    const AccessForSections = () => {

        if (managerAccess) {
            return (
            <>
                <div className="left_panel_manager">
                    <div className="area_of_buttons_panel">

                        <div className="title_group_panel">Товар</div>
                        <ButtonElementForPanel name_button="Добавить" type_button="add_button"/>
                        <ButtonElementForPanel name_button="Изменить" type_button="change_button"/>
                        <ButtonElementForPanel name_button="Скидки" type_button="sale_button"/>
                        

                        <div className="title_group_panel">Пользователи</div>
                        <ButtonElementForPanel name_button="Поддержка" type_button="garant_button"/>

                    </div>
                </div>

                <div className="title_section_panel">{TitleTextSections()}</div>
                
                <div className="main_area_manager">
                    {NavigatorOfSections()}
                </div>
            </>
            )
        }
        else {
            return (<></>)
        }
    }


    return (<>
        
        <Header/>

        {AccessForSections()}

    </>)
}

export default ManagerPanel