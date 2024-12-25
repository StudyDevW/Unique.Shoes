import { useState, useRef, useEffect } from 'react'
import './preprocessor/App.sass'
import ItemShoes from './Item.tsx'

function App() {

  const [starImages, setStarImages] = useState<string[]>([]);

  const [adogImages, setAdogImages] = useState<string[]>([]);


  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  // const [dynamicWidthAssort, setDWidth] = useState<number>(0);
  // const [dynamicMarginAssort, setDMargin] = useState<number>(0);

  const image_stars_array: {[key: string]: string } = {
    star_1: 'url(../images/stars_handdraw/star_1.png)',
    star_2: 'url(../images/stars_handdraw/star_2.png)',
    star_3: 'url(../images/stars_handdraw/star_3.png)',
    star_4: 'url(../images/stars_handdraw/star_4.png)',
    star_5: 'url(../images/stars_handdraw/star_5.png)'
  }

  const adog_stars_array: {[key: string]: string } = {
    a_1: 'url(../images/a_handdraw/a_1.png)',
    a_2: 'url(../images/a_handdraw/a_2.png)',
    a_3: 'url(../images/a_handdraw/a_3.png)',
    a_4: 'url(../images/a_handdraw/a_4.png)',
    a_5: 'url(../images/a_handdraw/a_5.png)'
  }

  const replaceStarImage = (index: number, firstImage: string, secondImage: string) => {
    setStarImages(prevImages => {
      const newImages = [...prevImages];
      newImages[index] = (prevImages[index] === secondImage ? firstImage : secondImage);
      return newImages;
    })
  };

  const replaceAdogImage = (index: number, firstImage: string, secondImage: string) => {
    setAdogImages(prevImages => {
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

    replaceAdogImage(0, adog_stars_array['a_1'], adog_stars_array['a_2'])

    replaceAdogImage(1, adog_stars_array['a_2'], adog_stars_array['a_1'])

    replaceAdogImage(2, adog_stars_array['a_3'], adog_stars_array['a_2'])

    replaceAdogImage(3, adog_stars_array['a_4'], adog_stars_array['a_5'])

    replaceAdogImage(4, adog_stars_array['a_5'], adog_stars_array['a_4'])
  }


  useEffect(() => {
    const interval = setInterval(() => image_switch(), 1000); // Меняем изображение каждые 3 секунды  
    // Очистка интервала при размонтировании компонента
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        setSize({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    // Вызываем функцию, чтобы установить начальные размеры
    updateSize();

    // Добавляем обработчик события для изменения размера окна
    window.addEventListener('resize', updateSize);

    // Убираем обработчик события при размонтировании компонента
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  
  // const dynamic_marginLeft_assort = () => {
  //   let size_margin = 0;

  //   if (size.width < 1264) {
  //     size_margin = 570 + 290;
  //   }
  //   else {
  //     size_margin = 570;
  //   }

  //   return size_margin;
  // }

  // const dynamic_Width_assort = () => {
  //   let width_assort = 0

  //   if (size.width < 1264)
  //     width_assort = 540 + 290
  //   else 
  //     width_assort = 540
    
  //   return width_assort
  // }

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

          <div ref={ref} className="item_area" style={
            {
              // marginLeft: `${dynamic_marginLeft_assort()}px`,
              // width: `calc(100% - ${dynamic_Width_assort()}px)`
              
            }
          }>

          {/* <p style={{position: 'absolute', marginTop: '-3px'}}>Width: {size.width}px</p>
          <p style={{position: 'absolute', marginTop: '-3px', marginLeft: '100px'}}>Height: {size.height}px</p> */}

            {ItemShoes('item_shoes_name', 'null', 'new_mark', 0)}

            {ItemShoes('item_shoes_name', 'null', 'new_mark', 1)}

            {ItemShoes('item_shoes_name', 'null', 'new_mark', 2)}

            {ItemShoes('item_shoes_name', 'null', 'new_mark', 1)}

          </div>
        </div>

        <div className="background_decoration second"></div>
        <div className="background_decoration second area">
          <div className="a_dog first" style={{backgroundImage: adogImages[0] }}></div>
          <div className="a_dog second" style={{backgroundImage: adogImages[1] }}></div>
          <div className="a_dog third" style={{backgroundImage: adogImages[2] }}></div>
          <div className="a_dog four" style={{backgroundImage: adogImages[3] }}></div>
          <div className="a_dog five" style={{backgroundImage: adogImages[4] }}></div>
        </div>

        <div className="new_assortment">
          <div className="right_title_assortment">Хит<br></br>Продаж</div>

          <div className="button_for_more right">
            <div className="upper_text_more_button">
              Показать
            </div>

            <div className="down_text_more_button">
              полностью
            </div>
          </div>

          <div ref={ref} className="item_area left" style={
            {
              // marginLeft: `${dynamic_marginLeft_assort()}px`,
              // width: `calc(100% - ${dynamic_Width_assort()}px)`
              
            }
          }>

          {ItemShoes('item_shoes_name', 'null', 'demand_mark', 1)}

          {ItemShoes('item_shoes_name', 'null', 'demand_mark', 2)}

          {ItemShoes('item_shoes_name', 'null', 'demand_mark', 1)}

          {ItemShoes('item_shoes_name', 'null', 'demand_mark', 0)}

          {/* <p style={{position: 'absolute', marginTop: '-3px'}}>Width: {size.width}px</p>
          <p style={{position: 'absolute', marginTop: '-3px', marginLeft: '100px'}}>Height: {size.height}px</p> */}


          </div>
        </div>

      </div>

      <div className="info_items">
        
      </div>

    </>
  )
}

export default App
