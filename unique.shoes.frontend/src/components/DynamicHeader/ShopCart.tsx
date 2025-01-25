import { handleShopCartDelete, handleShopCartInfo, handleShopCartInfoUpdateCount } from "../API/ShopCartInfo.tsx"
import { handleGetItemInfo, handleLoadImage, handleLoadImagesArray } from "../API/ItemInfo.tsx";
import useShopCartVariable from "../Variables/ShopCartVariable.ts";
import { GetInfoUser_Id } from '../API/AccountInfo.tsx';
import Cookies from 'js-cookie';
import { useState, useRef, useEffect } from 'react'
import useTabIndexVariable from "../Variables/TabIndexVariable.ts";
import useItemPreviewVariable from "../Variables/ItemPreviewVariable.ts";
import { loadingComponent } from "../Loading/LoadingComponent.ts";
import { handleOrderRequest } from "../API/OrdersInfo.tsx";
let arrImages: string[] = [];

var loadingImages = new loadingComponent();
var blockRenderImages: boolean = false;
var reloadingItems: boolean = false;

const LoadShopCart: React.FC = () => {

    const { shopCartGet, shopCartSet } = useShopCartVariable();
    const [getArrImages, setArrImages] = useState<string[]>([]);
    const [renderedImages, setRenderedImages] = useState<string[]>([]);
    const [runningA, setRunningA] = useState<boolean>(false);

    const [blockRender, setBlockRender] = useState<boolean>(false);

    const GetInfoFromAPI = async () => {

        const accessTokens: string = Cookies.get('AccessToken') as string;  

        shopCartSet(null)

        if (accessTokens !== undefined) {
            var infoCart = await handleShopCartInfo(GetInfoUser_Id(), accessTokens);

           
            shopCartSet(infoCart);
        }
        else {
            shopCartSet(null);
        }
    }

    const imageArrayCompile = () => {

        if (shopCartGet !== null) {
            for (var i = 0; i < shopCartGet.shopCartItem.length; i++) {
                arrImages[i] = shopCartGet.shopCartItem[i].imageLink;
            }

            setArrImages(arrImages)


        }



    }

    const renderImages = async () => {
        if (getArrImages !== null) {
            var imageOut = await handleLoadImagesArray(getArrImages);

            if (imageOut !== null) {
                setRenderedImages(imageOut);

                loadingImages.endLoading();
            }
        }
    }

    useEffect(()=>{
        GetInfoFromAPI();

        loadingImages.startLoading();
        loadingImages.startLoadingAnimation();

        blockRenderImages = false;
    },[])

    useEffect(()=>{
        if (reloadingItems) {
            GetInfoFromAPI();
            setRunningA(false);
            loadingImages.stopLoadingTimer();
            loadingImages.startLoadingAnimation();
            blockRenderImages = false;
            reloadingItems = false;
        }
    }, [reloadingItems])

    useEffect(()=>{
        if (renderedImages[0] === '') { //Костыльный фикс на прогрузку изображений
            GetInfoFromAPI();
        }
    }, [renderedImages])

    useEffect(()=>{
        if (shopCartGet !== null && !blockRenderImages) {
            imageArrayCompile();
            renderImages();
        }
    }, [shopCartGet || getArrImages])



    const AnimationChecker = () => {
        if (loadingImages.getStatusLoadingAnimation().isCompleted) {
            setRunningA(true);
            blockRenderImages = true;
        }
    }

    useEffect(()=>{
        if (!runningA) { 
            const intervalId = setInterval(()=>AnimationChecker(), 1000); 

            return () => clearInterval(intervalId);    
        }
    }, [runningA])


    if (loadingImages.getLoading() || !runningA) {

        if (!runningA && shopCartGet !== null) {
            
            return (<>
                <div className="shopcart_area_header">
                    {shopCartGet.shopCartItem.map((itemCart, index) => 
                        <div key={index} className="shopcart_header_item">
                            <div className="image_shoes_item_shopcart loading"></div>

                            <div className="name_shoes_item_shopcart loading"></div>

                            <div className="size_shoes_item_shopcart loading"></div>

                            {/*  */}
                        </div>
                    )}
                </div>

                <div className="shopcart_area_finalprice">
                    <div className="shopcart_finalprice_buybutton loading"></div>
            
                    <div className="shopcart_finalprice_info_area loading"></div>

                    <div className="shopcart_finalprice_info_area loading smallw"></div>

                </div>
            </>)
        }

        return (<>
            <div className="shopcart_area_header">
                <div className="shopcart_title_empty">Загрузка</div>
            </div>
        </>)
    }


      
    return (<><ShopCart imagesRendered={renderedImages}/></>)
    
    
}

interface PayItemsProperties {
    hashName: string,
    size: string,
    count: number
}

var itemsToPay: PayItemsProperties[] = [];

const ShopCart: React.FC<{imagesRendered: string[]}> = ({imagesRendered}) => {

    const { shopCartGet, shopCartSet } = useShopCartVariable();

    const { tabIndexSet } = useTabIndexVariable();

    const [countItemCart, setCountItemCart] = useState<number[]>([]);

    const [updateCart, setUpdateCart] = useState<boolean>(false);

    const { itemPrevewSet } = useItemPreviewVariable(); 


    const [payShopCart, setpayShopCart] = useState<boolean>(false);

    const [addressOrder, setAddressOrder] = useState<string>("");

    const [synchronizeCart, setSynchronizeCart] = useState<boolean>(false);

    const GetInfoFromAPIUpdate = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;  

        if (accessTokens !== undefined) {
            var infoCart = await handleShopCartInfo(GetInfoUser_Id(), accessTokens);
      
            shopCartSet(infoCart);

        }
    }

    const increaseCountCart = (index: number, itemId: number) => {
        if (shopCartGet !== null) {

            if (synchronizeCart) {

                updateCartFunc(itemId, countItemCart[index] + 1);

                setCountItemCart(prev => {
                    prev[index] += 1;
                    return prev;
                })

                setSynchronizeCart(false);
            }
        }


    }

    const decreaseCountCart = (index: number, itemId: number) => {

        if (shopCartGet !== null) {
            
            if (countItemCart[index] > 1) {
          
                if (synchronizeCart ) {

                    updateCartFunc(itemId, countItemCart[index] - 1);

                    setCountItemCart(prev => {
                        prev[index] = (prev[index] -= 1);
                        return prev;
                    })

                    setSynchronizeCart(false);
                }
            }
            else {

                updateCartFunc(itemId, 1);

                setCountItemCart(prev => {
                    prev[index] = (prev[index] = 1);
                    return prev;
                })

                setSynchronizeCart(false);
            }
        }
    }

    const DeleteItem = async (itemId: number) => {
        const accessTokens: string = Cookies.get('AccessToken') as string;  

        if (accessTokens !== undefined) {
            await handleShopCartDelete(itemId, accessTokens);
            reloadingItems = true;
            setSynchronizeCart(false);
        }
    }

    const ItemGetInfo = async (hashName: string) => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
  
            const getInfo = await handleGetItemInfo()
        
            if (getInfo !== null) {
               // setInfoItem(getInfo);

               getInfo.map((item) => {
                    if (item.hashName === hashName)
                    {
                        itemPrevewSet(item);
                        tabIndexSet(0);
                    }
               })
            }
    
        }
    }

    const BackToPreviewItem = (hashName: string) => {
        ItemGetInfo(hashName);
    }

    const SyncFunc = () => {
        if (shopCartGet !== null) {
            
            console.log(`shopCartGet.shopCartItem.length ${shopCartGet.shopCartItem.length}`)
    
            console.log(shopCartGet)

            for (var i = 0; i < shopCartGet.shopCartItem.length; i++) {

                setCountItemCart(prev => {
                    prev[i] = shopCartGet.shopCartItem[i]?.countItem;
                    return prev;
                })
                
            }

    
        }
    }

 
    
    const updateCartFunc = async (itemId: number, countItem: number) => {
        const accessTokens: string = Cookies.get('AccessToken') as string;  

        if (accessTokens !== undefined) {
            if (await handleShopCartInfoUpdateCount(itemId, countItem, accessTokens)) {
                setUpdateCart(true); 
            }
            else {
                setSynchronizeCart(true);
                setUpdateCart(false);
            }
        }

        setSynchronizeCart(false);
    }



    const PayRequest = async () => {
        if (shopCartGet !== null) {
            itemsToPay.length = 0;

            shopCartGet.shopCartItem.map((itemCart) => {
                itemsToPay.push({hashName: itemCart.hashName, count: itemCart.countItem, size: itemCart.size})
            });

            const accessTokens: string = Cookies.get('AccessToken') as string;  

            if (accessTokens !== undefined && itemsToPay !== undefined) {
                var hashPay = await handleOrderRequest(GetInfoUser_Id(),  addressOrder, shopCartGet.shopCartInfo.totalPrice, itemsToPay, accessTokens)
                if (hashPay !== null) {
                    window.location.href = `http://localhost:5173/${hashPay}`;
                    setpayShopCart(false);
                }
                else {
                    console.log("Неудалось создать заказ!")
                }
           
            }
        }
    }

    useEffect(()=>{

        if (updateCart) {
            GetInfoFromAPIUpdate();
            setSynchronizeCart(false);
            setUpdateCart(false);
  
        }
    
        
    }, [updateCart])


    useEffect(()=>{
        if (!synchronizeCart) {
            GetInfoFromAPIUpdate();
            SyncFunc();
            setSynchronizeCart(true);
        }
    }, [synchronizeCart || countItemCart])

    useEffect(()=>{

    }, [payShopCart])

    if (shopCartGet === null || imagesRendered === null)
        return (<></>)

    const formatPrice = (price: number): string => {
        return price.toLocaleString('ru-RU').replace(/,/g, '.');  // Заменяем запятые на точки
    };
    

    return (<>

        {(payShopCart) && ( 
            <div className="blurred_background_cart">
                <div className="shopcart_pay_window">
                    <div className="shopcart_pay_window_title">Укажите адрес</div>

                    <div className="shopcart_pay_window_back" onClick={()=>setpayShopCart(false)}>Отменить</div>

                    <div className="shopcart_pay_window_input_area">
                    
                        <input className="input_text whitefull" 
                        type="text"
                        value={addressOrder}
                        onChange={(e) => setAddressOrder(e.target.value)}></input>
                    </div>

                    <div className="buttonarea_complete" 
                    style={{marginTop: '75px', marginLeft: '36px', width: '320px', fontSize: '20px'}}
                    onClick={()=>PayRequest()}>
                        {`Оплатить ${formatPrice(shopCartGet.shopCartInfo.totalPrice)}Р`}
                    </div>
                </div>
            </div>
        )}
       
     

        <div className="shopcart_area_header">

            {(shopCartGet.shopCartItem.length === 0 && 
                (<>
                    <div className="shopcart_title_empty">Товаров в корзине еще нет</div>
                </>))}

            {shopCartGet.shopCartItem.map((itemCart, index) => 
                <div key={index} className="shopcart_header_item">
                    <div className="image_shoes_item_shopcart"
                    style={{backgroundImage: `url(${imagesRendered[index]})`}}
                    onClick={()=>BackToPreviewItem(itemCart.hashName)}></div>

                    <div className="name_shoes_item_shopcart"
                    onClick={()=>BackToPreviewItem(itemCart.hashName)}>{itemCart.name}</div>

                    <div className="size_shoes_item_shopcart">{`Размер: ${itemCart.size}`}</div>

                    <div className="rightbar_shoes_item_shopcart">
                        <div className="price_rightbar_shopcart">{`${formatPrice(itemCart.price)}Р`}</div>
                        
                        <div className="count_items_rightbar_shopcart">
                            <div className="count_items_rightbar left" onClick={()=>decreaseCountCart(index, itemCart.id)}></div>
                            <div className="count_items_rightbar middle">
                                {countItemCart[index]}
                            </div>
                            <div className="count_items_rightbar right" onClick={()=>increaseCountCart(index, itemCart.id)}></div>
                            <div className="count_items_rightbar delete" onClick={()=>DeleteItem(itemCart.id)}></div>
                        </div>
                    </div>
                </div>
            )}

        </div>

        <div className="shopcart_area_finalprice">
            {(shopCartGet.shopCartInfo.count > 0) && (<div className="shopcart_finalprice_buybutton" onClick={()=>setpayShopCart(true)}>Перейти к оформлению</div>)}

            {(shopCartGet.shopCartInfo.count === 0) && (<div className="shopcart_finalprice_buybutton">Нет товаров для заказа</div>)}

            <div className="shopcart_finalprice_description">Способы доставки и время доступны во время оформления заказа</div>
       
            <div className="shopcart_finalprice_separator"></div>
       
            <div className="shopcart_finalprice_info_area">
                <div className="shopcart_finalprice_info">Корзина</div>

                <div className="shopcart_finalprice_info desc">
                    <div className="shopcart_finalprice_info_text">{`Товары: ${shopCartGet.shopCartInfo.count}шт.`}</div>
                    <div className="shopcart_finalprice_info_text reverse">{`${formatPrice(shopCartGet.shopCartInfo.totalPrice)}Р`}</div>
                </div>
            </div>

            {(shopCartGet.shopCartInfo.count > 0) && (<>
                <div className="shopcart_finalprice_separator"></div>

                <div className="shopcart_finalprice_info_area">
                    <div className="shopcart_finalprice_info">Итого</div>

                    <div className="shopcart_finalprice_info desc">
                        <div className="shopcart_finalprice_info_text">{`Заказ на ${formatPrice(shopCartGet.shopCartInfo.totalPrice)}Р`}</div>
                    </div>
                </div>
            </>)}

         

        </div>
    
  
    </>)
}


export default LoadShopCart