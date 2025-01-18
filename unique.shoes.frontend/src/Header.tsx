import { useState, useRef, useEffect } from 'react'
import Miniprofile from './Miniprofile.tsx'
import useloginPageOpenedVariable from './components/Variables/OpenLoginPageVariable.ts';
import LoginPage from './LoginPage.tsx'
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
let animClosedHeader: boolean = false;
import useItemPreviewVariable from './components/Variables/ItemPreviewVariable.ts';
import { handleLoadImage, handleLoadImagesArray } from './components/API/ItemInfo.tsx';
import { handleShopCardAddItem, handleShopCartItemExist } from "./components/API/AddItemShopCart.tsx";
import { GetInfoUser_Id } from './components/API/AccountInfo.tsx';
import Cookies from 'js-cookie';


import LoadShopCart from './ShopCart.tsx';

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



const HeaderPreviewItem: React.FC = () => {

  const [tabIndex, setTabIndex] = useState<number>(0);

  const { itemPrevewGet, itemPrevewSet } = useItemPreviewVariable();
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
        setTabIndex(2);
      }
    }
  }

  const CartOutName = () => {
    return cartExist ? "Уже в корзине" : "В корзину"
  }


  //UseEffect прикрутить и создать переменную


  const TabsCompiles = () => {
    if (itemPrevewGet === null) 
        return (<></>)



    if (tabIndex === 0 ) {
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
    else if (tabIndex === 2) {
      return (<>
        <LoadShopCart/>
      </>)
    }
  }

  const TabSection = (index: number, small: boolean = false) => {
    if (index === tabIndex) {
      return small ? "header_item_preview_title small" : "header_item_preview_title"
    }
    else {
      return small ? "header_item_preview_title small inactive" : "header_item_preview_title inactive"
    }
  }

  if (itemPrevewGet !== null) 



    return (<>

        <div className="header_item_preview_title_area">
          <div className={TabSection(0)}        onClick={()=>setTabIndex(0)}>Превью товара</div>
          <div className={TabSection(1)}        onClick={()=>setTabIndex(1)}>Отзывы</div>
          <div className={TabSection(2, true)}  onClick={()=>setTabIndex(2)}>Корзина</div>
        </div>


        <div className="header_item_preview_button_back" onClick={()=>{itemPrevewSet(null);}}>Вернуться</div>

        <div className="header_item_preview_separator"></div>

        {TabsCompiles()}

      
    </>)
  else 
    return(<></>)

} 

const Header: React.FC = () => {
    
    const { loginPageOpenedGet } = useloginPageOpenedVariable();

    const [resetPreview, setResetPreview] = useState<boolean>(true);

    const { itemPrevewGet, itemPrevewSet } = useItemPreviewVariable();

    const [headerBig, setHeaderBig] = useState<boolean>(false);

    const refScrollUp = useRef<HTMLDivElement>(null);


    const handleScrollUp = () => {
        refScrollUp.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    const ResetPrev = () => {
      if (itemPrevewGet !== null && resetPreview) {
        itemPrevewSet(null);
        setResetPreview(false);
      }
    }
  
    useEffect(() => {
      ResetPrev();
    },[])

    useEffect(() => {
      if (itemPrevewGet !== null) {
        setHeaderBig(true);

      }
    },[itemPrevewGet])

 
    if (headerBig && itemPrevewGet !== null) {

      if (loginPageOpenedGet) {

        animClosedHeader = true
  
        document.body.style.overflow = "hidden";
  
        handleScrollUp();
  
        return (<>
  
          <div ref={refScrollUp}> </div>
  
          <div className="header small">
                <div className="logo"> </div>
  
                {Miniprofile(true)}
          </div>
  
          <LoginPage/>
  
        </>)
      }
      else {
  
         
        document.body.style.overflow = "auto";
  
        if (animClosedHeader === true) {
          return (<>
            <div className="header normal">
                  <div className="logo"> </div>
    
                  {Miniprofile(false)}
    
            </div>
          </>)
        }
        else {
          return (<>
            <div className="header fullsize">
                <div className="logo"> </div>
        
                {Miniprofile(false)}

                <HeaderPreviewItem/>
            </div>
          </>)
        }
  
        
      }
    }
    else {
      if (loginPageOpenedGet) {

          animClosedHeader = true
    
          document.body.style.overflow = "hidden";
    
          handleScrollUp();
    
          return (<>
    
            <div ref={refScrollUp}> </div>
    
            <div className="header small">
                  <div className="logo"> </div>
    
                  {Miniprofile(true)}
            </div>
    
            <LoginPage/>
    
          </>)
        }
        else {
    
          
          document.body.style.overflow = "auto";
    
          if (animClosedHeader === true) {
            return (<>
              <div className="header normal">
                    <div className="logo"> </div>
      
                    {Miniprofile(false)}
      
              </div>
            </>)
          }
          else {
            return (<>
              <div className="header">
                    <div className="logo"> </div>
      
                    {Miniprofile(false)}
      
              </div>
            </>)
          }
    
          
        }
    }
}

export default Header