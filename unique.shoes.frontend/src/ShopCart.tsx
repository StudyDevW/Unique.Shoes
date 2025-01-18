import { handleShopCartInfo } from "./components/API/ShopCartInfo.tsx"
import { handleLoadImage, handleLoadImagesArray } from "./components/API/ItemInfo.tsx";
import useShopCartVariable from "./components/Variables/ShopCartVariable.ts";
import { GetInfoUser_Id } from './components/API/AccountInfo.tsx';
import Cookies from 'js-cookie';
import { useState, useRef, useEffect } from 'react'

let arrImages: string[] = [];

const LoadShopCart: React.FC = () => {

    const { shopCartGet, shopCartSet } = useShopCartVariable();
    const [getArrImages, setArrImages] = useState<string[]>([]);
    const [renderedImages, setRenderedImages] = useState<string[]>([]);

    const GetInfoFromAPI = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;  

        if (accessTokens !== undefined) {
            var infoCart = await handleShopCartInfo(GetInfoUser_Id(), accessTokens);

            shopCartSet(infoCart);
        }
    }

    const imageArrayCompile = () => {

        if (shopCartGet !== null) {
            for (var i = 0; i < shopCartGet.shopCartInfo.count; i++) {
                arrImages[i] = shopCartGet.shopCartItem[i].imageLink;
            }
        }

        setArrImages(arrImages)
    }

    const renderImages = async () => {
        if (getArrImages !== null) {
            var imageOut = await handleLoadImagesArray(getArrImages);

            if (imageOut !== null) {
                setRenderedImages(imageOut);
                console.log(imageOut)
            }
        }
    }

    useEffect(()=>{
        GetInfoFromAPI();
    },[])


    useEffect(()=>{
        if (shopCartGet !== null) {
            imageArrayCompile();
            renderImages();
        }
    }, [shopCartGet || getArrImages])


    if (renderedImages !== null) 
        return (<><ShopCart imagesRendered={renderedImages}/></>)

    return (<><h1 style={{color: 'white'}}>Загрузка</h1></>)
}

const ShopCart: React.FC<{imagesRendered: string[]}> = ({imagesRendered}) => {

    const { shopCartGet, shopCartSet } = useShopCartVariable();

    if (shopCartGet === null || imagesRendered === null)
        return (<></>)

    const formatPrice = (price: number): string => {
        return price.toLocaleString('ru-RU').replace(/,/g, '.');  // Заменяем запятые на точки
    };
    

    return (<>
   
        <div className="shopcart_area_header">

            {shopCartGet.shopCartItem.map((itemCart, index) => 
                <div key={index} className="shopcart_header_item">
                    <div className="image_shoes_item_shopcart"
                    style={{backgroundImage: `url(${imagesRendered[index]})`}}></div>

                    <div className="name_shoes_item_shopcart">{itemCart.name}</div>

                    <div className="rightbar_shoes_item_shopcart">
                        <div className="price_rightbar_shopcart">{formatPrice(itemCart.price)}</div>
                        

                    </div>
                </div>
            )}

          

        

        </div>
  
    </>)
}


export default LoadShopCart