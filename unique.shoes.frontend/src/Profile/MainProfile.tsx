import { useState, useRef, useEffect } from 'react'
import { GetInfoUser_FullName, GetInfoUser_Id, GetInfoUser_Role  } from '../components/API/AccountInfo.tsx'
import { handleOrderCheck, handleOrdersInfo } from '../components/API/OrdersInfo.tsx'
import { handleSessionsGet } from '../components/API/SessionInfo.tsx'
import useButtonActiveProfile from '../components/Variables/ProfileMenuVariable.ts'
import useCloseProfileVariable from '../components/Variables/CloseProfileVariable.ts'
import Cookies from 'js-cookie';
import { handleLoadImage } from "../components/API/ItemInfo.tsx";
import useOpenProfileVariable from '../components/Variables/OpenProfileVariable.ts'
import { loadingComponent } from "../components/Loading/LoadingComponent.ts";
import useLoginSuccessVariable from '../components/Variables/LoginSuccessVariable.ts'
import { handleMessageGet, handleMessageSend } from '../components/API/Feedback.tsx'

var loadingOrder = new loadingComponent();

interface OrdersGetProperties {
    orders: {
       hashPay: string,
       payStatus: string,
       deliveryStatus: string,
       deliveryAddress: string, 
       price: number,
       creationDate: string,
       items: {
          itemId: number,
          hashName: string,
          name: string,
          price: number,
          countItem: number,
          size: string,
          imageLink: string
       }[]
    }[]
}

interface OrdersItem {
    itemId: number,
    hashName: string,
    name: string,
    price: number,
    countItem: number,
    size: string,
    imageLink: string
}

interface SessionGetProperties {
    timeAdd: string,
    timeUpd: string,
    timeDel: string,
    statusSession: string
}

interface MessagePrintFeed {
    sendTime: string,
    userName: string,
    message: string,
    user_role: string
}


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

interface images_rendered {
    orders: {
        items: string[]
    }[]
} 

let arrRendered: images_rendered;

const OrderInfoItems: React.FC<{item: OrdersItem}> = ({item}) => {
    const [currentItemImg, setcurrentItemImg] = useState<string>();

    const renderImage = async () => {

        var imageOut = await handleLoadImage(item.imageLink);

        if (imageOut !== null) {
            setcurrentItemImg(imageOut);
        }
    }

    const formatPrice = (price: number): string => {
        return price.toLocaleString('ru-RU').replace(/,/g, '.');  // Заменяем запятые на точки
    };


    useEffect(()=>{
        renderImage();
    },[]);

    if (currentItemImg !== null) {
        return (<> 
            <div className="order_content_main_profile_items">
                <div className="image_order_content_main_profile_items" style={{backgroundImage: `url(${currentItemImg})`}}></div>
                <div className="name_order_content_main_profile_items">{item.name}</div>
                <div className="size_order_content_main_profile_items">{`Размер: ${item.size}`}</div>
                <div className="price_order_content_main_profile_items">{`${formatPrice(item.price)}Р`}</div>
                <div className="count_order_content_main_profile_items">{`${item.countItem}шт`}</div>
            </div>
        </>)
    }
} 

const OrderInfo: React.FC<{ordersInformation: OrdersGetProperties, type: string}> = ({ordersInformation, type}) => {

    const { openProfileSet } = useOpenProfileVariable();

    const formatPrice = (price: number): string => {
        return price.toLocaleString('ru-RU').replace(/,/g, '.');  // Заменяем запятые на точки
    };



    const StatusOut = (hashPay: string) => {
        var outString: string = "";

        ordersInformation.orders.map((order) => {
            if (order.hashPay === hashPay) {
                if (order.payStatus === "waiting") {
                    outString = "waiting";
                }
                else if (order.payStatus === "payed") {
                    outString = "payed";
                }
            }
        });

        if (outString === "waiting") {
            return "Ожидает оплаты";
        }
        else if (outString === "payed") {
            return "Оплачен";
        }

        return "";
    }

    const StatusClassName = (hashPay: string) => {

        var outString: string = "";

        ordersInformation.orders.map((order, index) => {
            if (order.hashPay === hashPay) {
                if (order.payStatus === "waiting") {
                    outString = "waiting";
                }
                else if (order.payStatus === "payed") {
                    outString = "payed";
                }
            }
        });

        if (outString === "waiting") {
            return "order_content_main_profile_name status wait";
        }
        else if (outString === "payed") {
            return "order_content_main_profile_name status";
        }

        return "";
    }

    const DatePrint = (dateFrom: string) => {
        const date = new Date(dateFrom);

        const day = date.getDate();
        const month = date.toLocaleString('russian', { month: 'short' }); // Получаем название месяца
        const year = date.getFullYear();

        return `Заказ от ${day} ${month} ${year}`;
    }

    const sortedOrders = ordersInformation.orders.sort((a, b) => {
        return new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime();
    });

    const handleOnClickPay = (hash: string) => {
        if (type === "Waiting") {
            openProfileSet(false);
            window.location.href = `http://localhost:5173/${hash}`;
        }
        else {
            window.open( `http://localhost:5173/getInfo/${hash}`, '_blank');
        }
    }


    return (
    <>
        {sortedOrders.map((order, index) => 
        
            <div key={index} className="order_content_main_profile">
                <div className="order_content_main_profile_title_info">
                    <div className="order_content_main_profile_name">{DatePrint(order.creationDate)}</div>
                    <div className="order_content_main_profile_name next" onClick={()=>handleOnClickPay(order.hashPay)}>{order.hashPay}</div>
                    <div className="order_content_main_profile_name price">{`${formatPrice(order.price)}Р`}</div>
                    <div className={StatusClassName(order.hashPay)}>{StatusOut(order.hashPay)}</div>
                </div>

                <div className="orders_content_main_spaceseparator"></div>

                {order.items.map((item, index_item) => 
                   <OrderInfoItems key={index_item} item={item}/>
                )}
            </div>
        )}
    </>
    )
}

const MyOrders: React.FC = () => {

    const [ordersInfo, setOrdersInfo] = useState<OrdersGetProperties | null>(null);

    const [runningA, setRunningA] = useState<boolean>(false);

    useEffect(()=>{
        loadingOrder.startLoading();
        loadingOrder.startLoadingAnimation();
    }, [])

    const AnimationChecker = () => {
        if (loadingOrder.getStatusLoadingAnimation().isCompleted) {
            setRunningA(true);
            SetInfo("payed");
            // blockRenderImages = true;
        }
    }

    useEffect(()=>{
        if (!runningA) { 
            const intervalId = setInterval(()=>AnimationChecker(), 1000); 
            return () => clearInterval(intervalId);    
        }
    }, [runningA])


    
    const SetInfo = async (type: string) => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
            var orders: OrdersGetProperties = await handleOrdersInfo(GetInfoUser_Id(), accessTokens);

            if (orders !== null) {

                loadingOrder.endLoading();

                if (type !== "all") {

                    var filtered = orders.orders.filter(order => order.payStatus === type);

                    var orderToOut: OrdersGetProperties = orders; 

                    orderToOut.orders = filtered;

                    setOrdersInfo(orderToOut);
                }
                else {
                    setOrdersInfo(orders);
                }
            }
        }
    }

    const { openProfileGet } = useOpenProfileVariable();

 
    const [subTabButton, setSubTabButton] = useState<string>("Payed");
    const [subTabButtonClicked, setSubTabButtonClicked] = useState<boolean>(true);


    const SetActiveTabButton = (active: string) => {
        setSubTabButton(active);
        setSubTabButtonClicked(true);
    }

    const OutActiveTab = (active: string) => {
        if (active === subTabButton) {
            return "button_right_main_profile";
        }

        return "button_right_main_profile inactive"
    }

    const OutActiveTabSeparator = (active: string) => {
        if (active === subTabButton) {
            return (<>
                <div className="button_right_main_profile_separator"></div>
            </>)
        }

        return (<></>)
    }

    useEffect(()=>{
        if (subTabButton === "Payed") {
            SetInfo("payed");
        }
        
        if (subTabButton === "Waiting") {
            SetInfo("waiting");
        }

        setSubTabButtonClicked(false);

    }, [subTabButtonClicked])



    return (
    <>
        <div className="title_main_profile_content">Мои заказы</div>


        <div className="area_button_right_main_profile_area">
         

        
       
            <div className={OutActiveTab("Payed")} onClick={()=>SetActiveTabButton("Payed")}>
                Оплаченные
                {OutActiveTabSeparator("Payed")}
            </div>

            <div className={OutActiveTab("Waiting")} onClick={()=>SetActiveTabButton("Waiting")}>
                Ожидают оплаты
                {OutActiveTabSeparator("Waiting")}
            </div>

        </div>

        <div className="content_main_profile_area">
            {(ordersInfo !== null) && (<OrderInfo ordersInformation={ordersInfo} type={subTabButton}/>)}
        </div>

    </>)
}

var sessions: SessionGetProperties[] = [];

const MySessions: React.FC = () => {

    const GetSessions = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
            sessions = await handleSessionsGet(accessTokens);
        }
    }

    useEffect(()=>{
        GetSessions();
    }, []);

    const DatePrint = (dateFrom: string) => {
        const date = new Date(dateFrom);

        const day = date.getDate();
        const month = date.toLocaleString('russian', { month: 'short' }); // Получаем название месяца

        const formattedHours = String(date.getHours()).padStart(2, '0');
        const formattedMinutes = String(date.getMinutes()).padStart(2, '0');

        return `${day} ${month} в ${formattedHours}:${formattedMinutes} `;
    }

    const sortedSessions = sessions.sort((a, b) => {
        return new Date(b.timeAdd).getTime() - new Date(a.timeAdd).getTime();
    });

    return (
        <>
            <div className="title_main_profile_content">История активности</div>

    
            <div className="content_main_profile_area without_buttons">

                {sortedSessions.map((session, index) => 
                    <div key={index} className={`sessions_content_main_profile ${
                        session.timeDel === null ? "" : "inactive"
                    }`}>
                        <div className="sessions_content_main_profile_title">{
                            session.timeDel !== null ? `Сессия истекла ${DatePrint(session.timeDel)}` : `Сессия создана ${DatePrint(session.timeAdd)}`
                        }</div>

                        {(session.timeUpd !== null && session.timeDel === null) 
                        && <div className="sessions_content_main_profile_desc">{`Обновлена ${DatePrint(session.timeUpd)}`}
                        </div>}

                        {(session.timeDel !== null) 
                        && <div className="sessions_content_main_profile_desc">{`Была создана ${DatePrint(session.timeAdd)}`}
                        </div>}

                        <div className={`sessions_content_main_profile_status ${
                            session.statusSession === "active" ? "active" : ""
                        }`}>{
                            session.statusSession === "active" ? "Активна" : "Истекла"
                        }</div>
                    </div>
                )}

               
            </div>
    
        </>)
}


const SupportPage: React.FC = () => {

    const [messageSendClick, setMessageSendClick] = useState<boolean>(false);

    const [messageSendUpd, setMessageSendUpd] = useState<boolean>(false);

    const [messageInput, setMessageInput] = useState<string>("");

    const [messagesOut, setMessagesOut] = useState<MessagePrintFeed[]>();

    const SendMessage = async (messageSend: string) =>{
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
            if (await handleMessageSend(messageSend, accessTokens)) {
                console.log("Cообщение отправлено!");
                setMessageSendUpd(true);
             
            }
        }
    }

    const GetMessages = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
            var messagesGet = await handleMessageGet(GetInfoUser_Id(), accessTokens);

            if (messagesGet !== null) {
                setMessagesOut(messagesGet);
            }
        }
    }

    useEffect(()=>{
        GetMessages();
        
    }, [])

    useEffect(()=>{
        if (messagesOut !== undefined)
            console.log(messagesOut)
    },[messagesOut])

    useEffect(()=>{
        if (messageSendClick && messageInput !== "") {
            SendMessage(messageInput);
            setMessageSendClick(false);
        }
    }, [messageSendClick])

    useEffect(()=>{
        if (messageSendUpd) {
            setMessageInput("");
            setMessageSendUpd(false);
            GetMessages();
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

    const sortedMessages = messagesOut?.sort((a, b) => {
        return new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime();
    });

    return (<>   
        <div className="title_main_profile_content">Задать вопрос</div>

        
        <div className="content_main_profile_area without_buttons chat">
            
            {(sortedMessages !== undefined) && sortedMessages.map((message, index) =>
                <div key={index}>
                    
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
            )}
{/* 
            <div className="message_content_support">
                <div className="message_content_support_user">
                    <div className="message_content_support_user_title">Вы</div>
                    <div className="message_content_support_user_message">Ваше сообщение</div>
                </div>
            </div> */}

          
        </div>

        <input  className="input_text whitefull" 
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                style={{width: '540px', marginTop: "550px", marginLeft: "20px", textAlign: 'right'}}
                onKeyDown={(e) => handleKeyDownBack(e)}>

        </input>
    </>)
}

const MainProfile: React.FC = () => {

    const { openProfileGet } = useOpenProfileVariable();
    const { MPButtonActiveGet, MPButtonActiveSet } = useButtonActiveProfile();

    useEffect(()=>{
        MPButtonActiveSet("MyOrders");
    }, [])

    const { loginSuccessGet } = useLoginSuccessVariable();

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

    if (loginSuccessGet) {
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

                            <LeftMainProfileButtons name_button='Сессии' type_button='MySessions'/>

                            {(!GetInfoUser_Role().includes("Manager")) &&
                            <LeftMainProfileButtons name_button='Поддержка' type_button='Support'/>}
                        </div>

                        {(!GetInfoUser_Role().includes("Manager")) && 
                            <div className="shopcart_finalprice_separator margined" style={{top: '-5px'}}></div>
                        }
                        <div className="main_profile_buttons_area small">

                       

                            <div className="main_profile_button exit" onClick={()=>closeProfileSet(true)}>
                                Выход из профиля
                            </div>
                        </div>

                    </div>

                    <div className="right_main_profile_area">


                        {(MPButtonActiveGet === "MyOrders") && (<MyOrders/>)}

                        {(MPButtonActiveGet === "MySessions") && (<MySessions/>)}

                        {(MPButtonActiveGet === "Support") && (<SupportPage/>)}
                    </div>

                </div>

            </div>
        
        </>)
    }
    else {
        return (<></>)
    }
}

export default MainProfile