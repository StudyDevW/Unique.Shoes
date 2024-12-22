import { useState, useEffect } from 'react'
import './preprocessor/App.sass'
import ItemShoes from './Item.tsx'

function App() {

  const [starImages, setStarImages] = useState<string[]>([]);

  const image_stars_array: {[key: string]: string } = {
    star_1: 'url(../images/stars_handdraw/star_1.png)',
    star_2: 'url(../images/stars_handdraw/star_2.png)',
    star_3: 'url(../images/stars_handdraw/star_3.png)',
    star_4: 'url(../images/stars_handdraw/star_4.png)',
    star_5: 'url(../images/stars_handdraw/star_5.png)'
  }

  const replaceStarImage = (index: number, firstImage: string, secondImage: string) => {
    setStarImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = (prevImages[index] === secondImage ? firstImage : secondImage);
      return newImages;
    })
  };


  const image_switch = () => {

    replaceStarImage(0, image_stars_array['star_5'], image_stars_array['star_1'])

    replaceStarImage(1, image_stars_array['star_1'], image_stars_array['star_2'])

    replaceStarImage(2, image_stars_array['star_2'], image_stars_array['star_3'])

    replaceStarImage(3, image_stars_array['star_3'], image_stars_array['star_4'])

    replaceStarImage(4, image_stars_array['star_4'], image_stars_array['star_5'])
  }

  useEffect(() => {
    const interval = setInterval(() => image_switch(), 1000); // Меняем изображение каждые 3 секунды  
    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  return (
    <>

      <div className="header">
        <div className="logo"> </div>

      </div>


      <div className="info_items">
        <div className="background_decoration">
          <div className="star first" style={{backgroundImage: starImages[0] }}></div>
          <div className="star second" style={{backgroundImage: starImages[1] }}></div>
          <div className="star third" style={{backgroundImage: starImages[2] }}></div>
          <div className="star four" style={{backgroundImage: starImages[3] }}></div>
          <div className="star five" style={{backgroundImage: starImages[4] }}></div>
        </div>

        <div className="new_assortment">
          <div className="left_title_assortment">Новинки<br></br>Ассортимента</div>

          <div className="button_for_more">
            <div className="upper_text_more_button">
              Показать
            </div>

            <div className="down_text_more_button">
              полностью
            </div>
          </div>

          <div className="item_area">

            {ItemShoes('item_shoes_name', 'null', 'new_mark', 0)}

            {ItemShoes('item_shoes_name', 'null', 'new_mark', 1)}

            {ItemShoes('item_shoes_name', 'null', 'new_mark', 2)}

            {ItemShoes('item_shoes_name', 'null', 'new_mark', 1)}

          </div>
        </div>
      </div>
    </>
  )
}

export default App
