import { useState, useEffect } from 'react'
import './preprocessor/App.sass'

function ItemShoes(name_item: string, item_image: string, type_item: string, animation_style: number) {

  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);

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
    else  {
        return (<></>)
    }
  }

  return (
    <>

        <div className="item_release">

            {marks_complete()}
        
            <div className="item_background" style={{backgroundImage: backgroundImages[animation_style]}}></div>

            <div className="item_image"></div>
            
            <div className="item_name">
                <div className="item_text">{name_item}</div>
            </div>

        </div>
    </>
  )
}

export default ItemShoes
