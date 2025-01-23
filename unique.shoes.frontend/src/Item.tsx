import { useState, useEffect, MouseEvent } from 'react'
import './preprocessor/App.sass'
import { handleLoadImage } from './components/API/ItemInfo.tsx';
import useItemPreviewVariable from './components/Variables/ItemPreviewVariable.ts';
import useTabIndexVariable from "./components/Variables/TabIndexVariable.ts";

const ItemShoes: React.FC<{
  name_item: string,
  hash_item: string,
  type_item: string, 
  description_item: string,
  size_item: string[],
  image_paths: string[],
  id_item: number,
  animation_style: number, 
  image_prevew_link: string,
  price: number,
  onContext: (event: MouseEvent) => void
}> = ({
  name_item, 
  hash_item,
  type_item, 
  animation_style, 
  image_prevew_link, 
  size_item, 
  image_paths, 
  id_item, 
  description_item, 
  price, 
  onContext
}) => {

  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);

  const [infoOfItems, setOpeninfoOfItems] = useState<boolean>(false);
  
  const [clickedItem, setClickedItem] = useState<boolean>(false);

  const [openInfoReady, setOpenInfoReady] = useState<boolean>(false);

  const { itemPrevewGet, itemPrevewSet } = useItemPreviewVariable(); 
  
  const [openInfoClosing, setOpenInfoClosing] = useState<boolean>(false);

  const { tabIndexSet } = useTabIndexVariable();

  const [imageSrc, setImageSrc] = useState('');

  const ImagePreload = async () => {

    if (image_prevew_link !== "") {

        const imageFromAPI = await handleLoadImage(image_prevew_link);

        if (imageFromAPI !== null) {
          setImageSrc(imageFromAPI)
        }
    }
  }

  const ContextHooked = (event: MouseEvent) => {
    onContext(event);
    
    setOpenInfoClosing(false);
    setOpenInfoReady(false);
    setOpeninfoOfItems(false);
  }


  useEffect(()=>{
    ImagePreload();
  },[])

  const image_background_array: {[key: string]: string } = {
    background_1: 'url(../images/background_handdraw/background_curve.png)',
    background_2: 'url(../images/background_handdraw/background_curve_1.png)',
    background_3: 'url(../images/background_handdraw/background_curve_2.png)'
  }

  const replaceBackgroundImage = (index: number, firstImage: string, secondImage: string) => {
    setBackgroundImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = (prevImages[index] === secondImage ? firstImage : secondImage);
      return newImages;
    })
  };

  const image_switch = () => {

    replaceBackgroundImage(0, image_background_array['background_1'], image_background_array['background_3'])

    replaceBackgroundImage(1, image_background_array['background_2'], image_background_array['background_3'])

    replaceBackgroundImage(2, image_background_array['background_3'], image_background_array['background_1'])

  }

  useEffect(() => {
    const interval = setInterval(() => image_switch(), 1000); // Меняем изображение каждые 3 секунды  
    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  const marks_complete = () => {
    if (type_item === 'new_mark') {
        return (
            <>
                <div className="item_mark_new">
                    <div className="item_mark_text">Новое</div>
                </div>
            </>
            )
    }
    else if (type_item === 'demand_mark') {
      return (
          <>
              <div className="item_mark_demand">
                  <div className="item_mark_text">Хит</div>
              </div>
          </>
          )
    }
    else  {
        return (<></>)
    }
  }

  // const loading_info_bar = () => {
  //   return (
  //     <>
  //       <div className="loading_item_infobar">

  //       </div>
  //     </>
  //   )
  // }

  const infoStart = () => {
    setOpeninfoOfItems(true);
    
  }

  const infoEnd = () => {

    setOpenInfoClosing(true);


    // setOpenInfoReady(false);
  }

  useEffect(() => {
    if (infoOfItems && !openInfoReady) {
      const timer = setTimeout(() => {
        setOpenInfoReady(true);
      }, 1000);
  
      

      return () => clearTimeout(timer);
    } 
  }, [infoOfItems]);

  useEffect(() => {
    //  if (openInfoReady === true)
    //     alert()
    
  }, [openInfoReady]);

  useEffect(() => {
    if (infoOfItems && openInfoReady && openInfoClosing) {
      const timer = setTimeout(() => {
        setOpenInfoClosing(false);
        setOpenInfoReady(false);
        setOpeninfoOfItems(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
    else if (openInfoClosing) {
      setOpenInfoClosing(false);
      setOpenInfoReady(false);
      setOpeninfoOfItems(false);
    }
  
  }, [openInfoClosing]);

  const loadingBar = (RichItem: boolean) => {
      if (!infoOfItems) {
        return (<></>)
      }

      if (RichItem) {
        return (
          <>
              <div className="item_loading_bar">
                  <div className="item_loading_bar_progress rich"></div>
              </div>
          </>
          )
      }

      return (<>
           <div className="item_loading_bar">
              <div className="item_loading_bar_progress"></div>
            </div>
      </>)
     
  }

  const handleOnClick = () => {
    interface ItemProperties {
      id: number,
      hashName: string,
      name: string,
      description: string
      price: number
      sizes: string[]
      imagePaths: string[]
    }

    let itemPreview: ItemProperties = 
    {
      id: id_item,
      hashName: hash_item,
      name: name_item,
      description: description_item,
      imagePaths: image_paths,
      price: price,
      sizes: size_item
    };

    tabIndexSet(0);
    
    itemPrevewSet(itemPreview);

    setClickedItem(true)
  }




  useEffect(()=>{

    if (clickedItem && itemPrevewGet !== null) {
      console.log(itemPrevewGet);
      setClickedItem(false);
    }
  
    setClickedItem(false);
    
    
  },[clickedItem])

 

  const ItemWithMore = () => {
    if (openInfoReady && !openInfoClosing) {

      if (price > 500000) {
        return (<>
          <div className="item_release rich info" onContextMenu={onContext} onMouseEnter={infoStart} onMouseLeave={infoEnd}>
 
             
             <div className="item_rich">
                <div className="item_image start" 
                style={{
                  width: '200px',
                  height: '200px',
                  marginTop: '5px',
                  marginLeft: '5px',
                  backdropFilter: 'blur(10px)',
                  backgroundSize: 'contain', 
                  backgroundPosition: 'center',
                  backgroundImage: imageSrc !== '' ? `url(${imageSrc})` : '',
                  borderRadius: '10px',
                  border: 'solid #aea06a 1px',
                  
                }}>
    
                </div>

            
                <div className="item_name info rich">
                    <div className="item_text info rich">{name_item}</div>
                </div>
    
                <div className="item_price rich">
                    <div className="item_text info_sec">{`${price} Р`}</div>
                </div>
             </div>

          </div>
 
       </>)
      }

        return (<>
          <div className="item_release info" onContextMenu={onContext} onMouseEnter={infoStart} onMouseLeave={infoEnd}>

              <div className="item_image start" 
              style={{
                width: '200px',
                height: '200px',
                marginTop: '5px',
                marginLeft: '5px',
                backgroundSize: 'contain', 
                backgroundPosition: 'center',
                backgroundImage: imageSrc !== '' ? `url(${imageSrc})` : '',
                borderRadius: '10px',
                border: 'solid black 1px'
              }}>

              </div>

        

              <div className="item_name info">
                  <div className="item_text info">{name_item}</div>
              </div>

              <div className="item_price">
                  <div className="item_text info_sec">{`${price} Р`}</div>
              </div>
          </div>

        </>)
    }
    else if (openInfoReady && openInfoClosing) {


      if (price > 500000) {
        return (<>
          <div className="item_release info rich close" onContextMenu={onContext} onMouseEnter={infoStart} onMouseLeave={infoEnd}>
  
              <div className="item_rich">
                  <div className="item_image close" 
                  style={{
                    marginTop: '5px',
                    marginLeft: '5px',
                    backgroundSize: 'contain', 
                    backgroundPosition: 'center',
                    backgroundImage: imageSrc !== '' ? `url(${imageSrc})` : '',
                    borderRadius: '10px',
                  }}>
        
                  </div>
        
                  <div className="item_name rich info close">
                      <div className="item_text rich">{name_item}</div>
                  </div>
        
                  <div className="item_price close">
                      <div className="item_text info_sec">{`${price} Р`}</div>
                  </div>
              </div>
          </div>
  
       </>)
      }

      return (<>
        <div className="item_release info close" onContextMenu={onContext} onMouseEnter={infoStart} onMouseLeave={infoEnd}>

           <div className="item_image close" 
           style={{
             marginTop: '5px',
             marginLeft: '5px',
             backgroundSize: 'contain', 
             backgroundPosition: 'center',
             backgroundImage: imageSrc !== '' ? `url(${imageSrc})` : '',
             borderRadius: '10px',
           }}>

           </div>

           <div className="item_name info close">
               <div className="item_text">{name_item}</div>
           </div>

           <div className="item_price close">
               <div className="item_text info_sec">{`${price} Р`}</div>
           </div>
        </div>

     </>)
    }
    else {
      return (<>
        {OutputItem()}
      </>)
    }
  }

  const RichItems = () => {
    return (
      <>
  
          
          <div className="item_release rich" onClick={handleOnClick} onContextMenu={onContext} onMouseEnter={infoStart} onMouseLeave={infoEnd}>
              {marks_complete()}

              <div className="item_background" style={{backgroundImage: 'none'}}></div>
              
              {/* <div className="item_background" style={{backgroundImage: animation_style < 4 ? backgroundImages[animation_style] : 'none'}}></div>
                
           */}

              <div className="item_rich">
  
                <div className="item_image" 
                style={{
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  backgroundImage: imageSrc !== '' ? `url(${imageSrc})` : '',
                  borderRadius: '8px'
                }}>
  
                </div>
                
                <div className="item_name rich">
                    <div className="item_text rich">{name_item}</div>
                </div>

                {loadingBar(true)}
  
              </div>
          </div>
  
   
        
      </>
    )
  }

  const OutputItem = () => {
    if (price > 500000) {
      return RichItems()
    }

    return (
        <>

            
            <div className="item_release" onClick={handleOnClick} onContextMenu={ContextHooked} onMouseEnter={infoStart} onMouseLeave={infoEnd}>

              

                {marks_complete()}
            
            
                <div className="item_background" style={{backgroundImage: animation_style < 4 ? backgroundImages[animation_style] : 'none'}}></div>
                
          
                <div className="item_image" 
                style={{
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center',
                  backgroundImage: imageSrc !== '' ? `url(${imageSrc})` : '',
                  borderRadius: '8px'
                }}>

                </div>
                
                <div className="item_name">
                    <div className="item_text">{name_item}</div>
                </div>

                {loadingBar(false)}

            </div>

    
          
        </>
    )


  }

  
  return (<>
  {ItemWithMore()}

  </>)
}

export default ItemShoes
