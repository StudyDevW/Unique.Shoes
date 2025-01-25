import { useState, useRef, useEffect } from 'react'
import { GetInfoUser_FullName, GetInfoUser_Id, GetInfoUser_Role  } from '../components/API/AccountInfo.tsx'
import { handleOrderCheck, handleOrdersInfo } from '../components/API/OrdersInfo.tsx'
import useButtonActiveProfile from '../components/Variables/ProfileMenuVariable.ts'
import useCloseProfileVariable from '../components/Variables/CloseProfileVariable.ts'
import Cookies from 'js-cookie';
import { handleLoadImage } from "../components/API/ItemInfo.tsx";
import useOpenProfileVariable from '../components/Variables/OpenProfileVariable.ts'
import { loadingComponent } from "../components/Loading/LoadingComponent.ts";
import useLoginSuccessVariable from '../components/Variables/LoginSuccessVariable.ts'

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

const MainProfile: React.FC = () => {

    const { openProfileGet } = useOpenProfileVariable();
    const { MPButtonActiveGet, MPButtonActiveSet } = useButtonActiveProfile();

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
    else {
        return (<></>)
    }
}

export default MainProfile