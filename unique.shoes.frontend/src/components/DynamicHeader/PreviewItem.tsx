import { useState, useRef, useEffect } from 'react'
import { handleLoadImage, handleLoadImagesArray } from '../API/ItemInfo.tsx';
import { handleShopCardAddItem, handleShopCartItemExist } from "../API/AddItemShopCart.tsx";
import { GetInfoUser_Id } from '../API/AccountInfo.tsx';
import Cookies from 'js-cookie';
import useItemPreviewVariable from '../Variables/ItemPreviewVariable.ts';
import useTabIndexVariable from '../Variables/TabIndexVariable.ts';

let sizeMapper = new Map<string, boolean>([
    ['36 RU', false],
    ['37 RU', false],
    ['38 RU', false],
    ['39 RU', false],
    ['40 RU', false],
    ['41 RU', false],
    ['42 RU', false],
    ['43 RU', false],
  ]);



const ImagePreviewMain: React.FC<{imageLink: string[], price: number}> = ({imageLink, price}) => {

    const [activeIndex, setActiveIndex] = useState<number>(0);
  
    const [lastActiveIndex, setLastActiveIndex] = useState<number>(-1);
  
    const [stopCaruselAuto, setStopCaruselAuto] = useState<boolean>(false);
  
    const [stopCaruselAutoTimer, setStopCaruselAutoTimer] = useState<number>(20);
  
    const [startCaruselAuto, setStartCaruselAuto] = useState<boolean>(false);
  
    
  
    const handleClickIndexed = (index: number) => {
      if (activeIndex !== index) {
        setActiveIndex(index)
        setStopCaruselAuto(true)
        console.log(`Изображение выбрано ${index}, прокрутка отключена`)
      }
    }
  
    const CaruselImages = () => {
      if (imageLink.length > 1) {
        return (
        <>
          <div className="header_item_preview_images_carusel">
            {imageLink.map((image, index) => 
              <div key={index} className="header_item_preview_images_item"
                onClick={() => handleClickIndexed(index)}
                style={
                  { backgroundImage: `url(${image})`}
                }>
  
                {index === activeIndex && 
                (<div className="image_selected_preview_carusel"></div>)}
  
              </div>
            )}     
          </div>
        </>
        );
      }
      else {
        return (<></>)
      }
    }
  
    const UpdateAutoIndex = () => {
  
      if (stopCaruselAuto) {
        return;
      }
  
      let checkerMaxImg = imageLink.length - 1;
  
      if (activeIndex < checkerMaxImg) {
        setActiveIndex(prev => prev + 1)
      }
      else {
        setActiveIndex(0)
        setLastActiveIndex(-1)
      }
    }
  
  
    const EnableCaruselAutoAgain = () => {
      for (var i = 0; i < imageLink.length; i++) {
        if (i !== activeIndex) {
          setActiveIndex(i)
          setLastActiveIndex(i - 1)
          break;
        }
      }
  
      setStopCaruselAutoTimer(21);
      setStopCaruselAuto(false);
      setStartCaruselAuto(false);
    }
  
    useEffect(()=>{
      if (stopCaruselAuto) {
        const intervalId = setInterval(()=>setStartCaruselAuto(true), 20000); 
  
        return () => clearInterval(intervalId);
      }
    },[stopCaruselAuto])
  
    useEffect(()=>{
      if (startCaruselAuto)
        EnableCaruselAutoAgain();
    },[startCaruselAuto])
  
    useEffect(()=>{
      if (stopCaruselAuto) {
        const intervalId = setInterval(()=>setStopCaruselAutoTimer(prev => prev - 1), 1000); 
  
        return () => clearInterval(intervalId);
      }
    },[stopCaruselAuto])
  
    useEffect(() => {
      if (activeIndex > lastActiveIndex && imageLink.length > 0) {
        const intervalId = setInterval(UpdateAutoIndex, 7000); 
  
        console.log(imageLink.length)
        console.log(activeIndex)
  
    
        setLastActiveIndex(activeIndex)
        
  
        return () => clearInterval(intervalId);
      }
      
    }, [activeIndex || imageLink]); 
  
  
  
  
    const loadingBarImage = () => {
      if (imageLink.length === 1) 
        return (<></>) 
  
  
      if (stopCaruselAuto) {
        return (<>
          <div className="header_item_preview_area_image_bar_notify">
            {`Прокрутка остановлена, возобновление через ${stopCaruselAutoTimer} секунд`}
          </div>
        </>);
      }
  
      if (activeIndex === lastActiveIndex && !stopCaruselAuto) {
        return (<>
          <div className="header_item_preview_area_image_bar">
            <div className="header_item_preview_area_image_bar_progress"></div>
          </div>
        </>);
      }
  
    }
  
   
    return (<>
      <div className={price > 500000 ? "header_item_preview_area_image rich" : "header_item_preview_area_image"}
      style=
      {
        {
          backgroundImage: imageLink[activeIndex] !== undefined ? `url(${imageLink[activeIndex]})` : 'url(../images/missing_image.png)',
          backgroundSize: imageLink[activeIndex] !== undefined ? 'cover' : '250px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      }>
  
          {price > 500000 && ( 
            <div className="left_corner_decor_rich_header"></div>
          )}
  
          {price > 500000 && ( 
            <div className="left_corner_decor_rich_header study"></div>
          )}
      </div>
  
      {loadingBarImage()}
  
      {CaruselImages()}
      </>)
  
}
  
const AnimatedDescription: React.FC<{description: string}> = ({description}) => {
  
    const scrollContainerRef = useRef<HTMLDivElement>(null);
  
    const [timerAnim, setTimerAnim] = useState<boolean>(false);
  
    const [downAnim, setdownAnim] = useState<boolean>(true);
  
    const [upAnim, setupAnim] = useState<boolean>(false);
  
  
    useEffect(() => {
     
  
        const intervalId = setInterval(()=>{setTimerAnim(true)}, 2000); // Частота обновления
  
        return () => clearInterval(intervalId); // Очистка при размонтировании
    
    }, []);
  
    useEffect(() => {
  
        if (timerAnim && downAnim) {
    
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const scrollHeight = scrollContainer.scrollHeight;
                const clientHeight = scrollContainer.clientHeight;
    
                let scrollTop = 0;
                let direction = 1; 
    
                const scroll = () => {
                    scrollTop += direction * 0.5; // Скорость скролла
                    if (scrollTop >= scrollHeight - clientHeight || scrollTop <= 0) {
                    setupAnim(true);
                    setdownAnim(false);
                    return;
                    }
                    scrollContainer.scrollTo(0, scrollTop);
                };
    
                const intervalId = setInterval(scroll, 50); 
    
                return () => clearInterval(intervalId);
            }
        }
        
        
    
    }, [timerAnim]);
  
    useEffect(()=>{
        if (timerAnim && upAnim) {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
                const scrollHeight = scrollContainer.scrollHeight;
                const clientHeight = scrollContainer.clientHeight;
        
                let scrollTop = 0;
                let direction = 1; 
        
                const scroll = () => {
                    scrollTop += direction * 3.5; // Скорость скролла
        
                    if (((scrollHeight - clientHeight) - scrollTop) <= 0) {
                        setTimerAnim(false);
                        return;
                    }
        
                    scrollContainer.scrollTo(0, (scrollHeight - clientHeight) - scrollTop);
                };
        
                const intervalId = setInterval(scroll, 50); 
        
                return () => clearInterval(intervalId);
            }
        }
    },[upAnim])
  
  
    return (<>
      <div className="header_item_preview_area_description" ref={scrollContainerRef}>
          {description}
      </div>
    </>)
}
  

const PreviewItemHeader: React.FC = () => {

    //Сделать глобальную переменную, если удаляется товар из корзины, то нужно перепроверять

    const { itemPrevewGet, itemPrevewSet } = useItemPreviewVariable();
    const { tabIndexGet, tabIndexSet } = useTabIndexVariable();
    const [imageSrc, setImageSrc] = useState<string[]>([]);
    const [selectedClick, setSelectedClick] = useState<boolean>(false);
  
    const formatPrice = (price: number): string => {
      return price.toLocaleString('ru-RU').replace(/,/g, '.');  // Заменяем запятые на точки
    };
  
    const ImagePreload = async (item_images: string[]) => {
      
      if (item_images !== null) {
        if (item_images.length > 0) {
          const images = await handleLoadImagesArray(item_images);
          if (images !== null) {
            setImageSrc(images);
          }
        }
      }
    }
  
    const ClearSelectedSize = () => {
      const arraySizes: string[] = ['36 RU', '37 RU', '38 RU', '39 RU', '40 RU', '41 RU', '42 RU', '43 RU'];
  
      for (var i = 0; i < arraySizes.length; i++) {
        if (sizeMapper.get(arraySizes[i]) === true)
          sizeMapper.set(arraySizes[i], false)
  
        if (arraySizes[i] === itemPrevewGet?.sizes[0]) {
          if (sizeMapper.get(arraySizes[i]) === false) {
            sizeMapper.set(arraySizes[i], true)
          }
        }
      }
    }
  
    const SetSelectedSize = (item: string) => {
      const arraySizes: string[] = ['36 RU', '37 RU', '38 RU', '39 RU', '40 RU', '41 RU', '42 RU', '43 RU'];
  
      if (sizeMapper.get(item) === false) {
          sizeMapper.set(item, true)
      }
      
      for (var i = 0; i < arraySizes.length; i++) {
        if (arraySizes[i] !== item) {
          if (sizeMapper.get(arraySizes[i]) === true) {
            sizeMapper.set(arraySizes[i], false);
          }
        }
      }
  
      console.log(sizeMapper);
  
      setSelectedClick(true)
    }
  
    const GetSizeSelected = () => {
      const arraySizes: string[] = ['36 RU', '37 RU', '38 RU', '39 RU', '40 RU', '41 RU', '42 RU', '43 RU'];
  
      for (var i = 0; i < arraySizes.length; i++) {
        if (sizeMapper.get(arraySizes[i]) === true)
            return arraySizes[i];
      }
  
      return itemPrevewGet?.sizes[0];
    }
  
  
    useEffect(() => {
      setSelectedClick(false)
    },[selectedClick || sizeMapper])
  
    const OutputButtonStateSize = (size_string: string) => {
      if (sizeMapper.get(size_string) === true) {
          return 'item_sizeopt preview clicked'
      }
      else {
        return 'item_sizeopt preview'
      }
    } 

    const [cartExist, setCartExist] = useState<boolean>(false);

    const [cartAdded, setCartAdded] = useState<boolean>(false);
  
    const CartName = async () => {
  
      if (itemPrevewGet !== null) {
        const accessTokens: string = Cookies.get('AccessToken') as string;  
  
        if (accessTokens !== undefined) {
          try {
            if (await handleShopCartItemExist(GetInfoUser_Id(), itemPrevewGet.hashName, accessTokens)) {
              setCartExist(true)
            }
          }
          catch {
            setCartExist(false)
          }
          
         
          
        }
      }
    }
  
  
    //при вызове данного элемента рендерю изображения из массива
    useEffect(()=>{
      if (itemPrevewGet !== null) {
        ClearSelectedSize();
        ImagePreload(itemPrevewGet.imagePaths);
      }
    },[])
  
    useEffect(()=>{
      CartName();
      setCartAdded(false);
    },[cartAdded])

    const AddToCart = async () => {
        if (itemPrevewGet !== null) {
            const accessTokens: string = Cookies.get('AccessToken') as string;  

            const sizeSelected =  GetSizeSelected();

            if (!cartExist) {

                console.log(GetInfoUser_Id());

                if (accessTokens !== undefined && sizeSelected !== undefined) {
                await handleShopCardAddItem(GetInfoUser_Id(), itemPrevewGet.hashName, sizeSelected, accessTokens);
                setCartAdded(true);
                }
            }
            else {
                setCartAdded(false);
                tabIndexSet(2);
            }
        }
    }

    const CartOutName = () => {
        return cartExist ? "Уже в корзине" : "В корзину"
    }

    if (itemPrevewGet === null) 
    return (<></>)

    return (<>
        <div className="header_item_preview_area">
            <div className={itemPrevewGet.price > 500000 ? "header_item_preview_area_title rich" : "header_item_preview_area_title" }>
            {itemPrevewGet.name}
            </div>


            <div className="header_item_preview_area_rightitems">
            
                <div className={itemPrevewGet.price > 500000 ? "header_item_preview_area_price rich" : "header_item_preview_area_price"}>
                {`${formatPrice(itemPrevewGet.price)}Р`}
                </div>

                <div className="header_item_preview_area_cartbutton" onClick={AddToCart}>
                    {CartOutName()}
                </div>

                <div className="header_item_preview_area_buybutton">
                    <div className="header_item_preview_area_buybutton_text">
                        Купить
                    </div>

                    <div className="header_item_preview_area_buybutton_separator"></div>

                    <div className="header_item_preview_area_buybutton_size">
                        {GetSizeSelected()}
                    </div>
                </div>

                <div className="header_item_preview_area_sizes">
                    {itemPrevewGet.sizes.map((size, index) => 
                        <div key={index}>
                            {size !== '' && (<div key={index} className={OutputButtonStateSize(size)} onClick={()=>SetSelectedSize(size)}>
                            {size}
                            </div>)}
                        </div>
                    )}     
                </div>

                <AnimatedDescription description={itemPrevewGet.description}/>

            </div>



            <ImagePreviewMain imageLink={imageSrc} price={itemPrevewGet.price}/>

       </div>
       
    </>)
}

export default PreviewItemHeader;