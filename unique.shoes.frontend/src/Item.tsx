import { useState, useEffect, MouseEvent } from 'react'
import './preprocessor/App.sass'
import { handleLoadImage } from './components/API/ItemInfo.tsx';



const ItemShoes: React.FC<{
  name_item: string,
  type_item: string, 
  animation_style: number, 
  image_prevew_link: string, 
  onContext: (event: MouseEvent) => void
}> = ({name_item, type_item, animation_style, image_prevew_link, onContext}) => {

  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);

  const [infoOfItems, setOpeninfoOfItems] = useState<boolean>(false);

  const [openInfoReady, setOpenInfoReady] = useState<boolean>(false);

  const [imageSrc, setImageSrc] = useState('');

  const ImagePreload = async () => {

    if (image_prevew_link !== "") {

        const imageFromAPI = await handleLoadImage(image_prevew_link);

        if (imageFromAPI !== null) {
          setImageSrc(imageFromAPI)
        }
    }
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
    setOpeninfoOfItems(false);
    setOpenInfoReady(false);
  }

  useEffect(() => {
    if (infoOfItems === true) {
      const timer = setTimeout(() => {
        setOpenInfoReady(true);
      }, 1500);
  
      return () => clearTimeout(timer);
    } 
  }, [infoOfItems]);

  useEffect(() => {
    // if (openInfoReady === true)
    //   alert()
  }, [openInfoReady]);

  return (
    <>

        
        <div className="item_release" onContextMenu={onContext} onMouseEnter={infoStart} onMouseLeave={infoEnd}>

          

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

        </div>

 
      
    </>
  )
}

export default ItemShoes
