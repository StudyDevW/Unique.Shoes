import { useState, useEffect, MouseEvent, useRef } from "react"
import { handleGetItemInfo, handleGetOneItemInfo, handleLoadImagesArray } from "../components/API/ItemInfo.tsx";
import Cookies from 'js-cookie';
import ItemShoes from "../Item.tsx";
import { handleItemDelete } from "../components/API/CreateItem.tsx";
import useMItemPreviewVariable from "../components/Variables/ManagerItemPreviewVariable.ts";
import { handleItemChange } from "../components/API/ChangeItem.tsx";

interface ItemProperties {
    id: number,
    hashName: string,
    name: string,
    description: string
    flags: string[]
    price: number
    count: boolean
    sizes: string[]
    imagePaths: string[]
}

var changeItemSelected: boolean = false;

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

let sizeMapperP = new Map<string, boolean>([
    ['36 RU', false],
    ['37 RU', false],
    ['38 RU', false],
    ['39 RU', false],
    ['40 RU', false],
    ['41 RU', false],
    ['42 RU', false],
    ['43 RU', false],
]);

let buttonMapper = new Map<string, boolean>([
    ['firstButton', false],
    ['secondButton', false]
]);

let arrayFile: File[] = [];

let compiledImagesPreview: string[] = [];

function sortStringsAndExtractNumbers(arr: string[]): { sortedStrings: string[], numbers: number[] } {

    const numbers: number[] = [];
    
    // Разделяем строки на пустые и непустые
    const nonEmptyStrings = arr.filter(str => str.trim() !== '');
    const emptyStrings = arr.filter(str => str.trim() === '');

    // Сортируем непустые строки
    const sortedNonEmptyStrings = nonEmptyStrings.map(str => {
        const num = parseFloat(str.match(/-?\d+(\.\d+)?/)?.[0] || '0');
        numbers.push(num);
        return str;
    }).sort((a, b) => {
        const numA = parseFloat(a.match(/-?\d+(\.\d+)?/)?.[0] || '0');
        const numB = parseFloat(b.match(/-?\d+(\.\d+)?/)?.[0] || '0');
        
        return numA - numB;
    });

    // Объединяем пустые строки и отсортированные непустые строки
    const sortedStrings = [...sortedNonEmptyStrings, ...emptyStrings];

    return { sortedStrings, numbers };
}

const ImagePreviewMain: React.FC<{imageLink: string[], price: number}> = ({imageLink, price}) => {

    const [activeIndex, setActiveIndex] = useState<number>(0);
  
    const [lastActiveIndex, setLastActiveIndex] = useState<number>(-1);
  
    const [stopCaruselAuto, setStopCaruselAuto] = useState<boolean>(false);
  
    const [stopCaruselAutoTimer, setStopCaruselAutoTimer] = useState<number>(20);
  
    const [startCaruselAuto, setStartCaruselAuto] = useState<boolean>(false);
  
    
  
    const handleClickIndexed = (index: number) => {
      if (activeIndex !== index) {
        setActiveIndex(index)
      }
    }
  
    const CaruselImages = () => {
      if (imageLink.length > 1) {
        return (
        <>
          <div className="header_item_preview_images_carusel" style={{marginLeft: '600px', marginTop: '125px'}}>
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
  
   
    return (<>
      <div className={price > 500000 ? "header_item_preview_area_image rich" : "header_item_preview_area_image"}
      style=
      {
        {
          backgroundImage: imageLink[activeIndex] !== undefined ? `url(${imageLink[activeIndex]})` : 'url(../images/missing_image.png)',
          backgroundSize: imageLink[activeIndex] !== undefined ? 'cover' : '250px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          marginTop: '135px',
          marginLeft: '25px'
        }
      }>
  
          {price > 500000 && ( 
            <div className="left_corner_decor_rich_header"></div>
          )}
  
          {price > 500000 && ( 
            <div className="left_corner_decor_rich_header study"></div>
          )}
      </div>

      {CaruselImages()}
      </>)
  
}
  
const AnimatedDescription: React.FC<{description: string}> = ({description}) => {
  
    const scrollContainerRef = useRef<HTMLDivElement>(null);
  
    const [timerAnim, setTimerAnim] = useState<boolean>(false);
  
    const [downAnim, setdownAnim] = useState<boolean>(true);
  
    const [upAnim, setupAnim] = useState<boolean>(false);
  
    useEffect(()=>{

    }, [description])

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
      <div className="header_item_preview_area_description" ref={scrollContainerRef} style={{color: 'black', maxHeight: '125px'}}>
          {description !== "" ? description : 'Введите описание товара'}
      </div>
    </>)
}


const PreviewItemChangeItem: React.FC<{price: number, name: string, description: string, images: string[], sizes: string[]}> = ({price, name, description, images, sizes}) => {

    //Сделать глобальную переменную, если удаляется товар из корзины, то нужно перепроверять

    const { MitemPrevewGet, MitemPrevewSet } = useMItemPreviewVariable();
    const [imageSrc, setImageSrc] = useState<string[]>([]);
    const [selectedClick, setSelectedClick] = useState<boolean>(false);
  
    const formatPrice = (price: number): string => {
      return price.toLocaleString('ru-RU').replace(/,/g, '.');  // Заменяем запятые на точки
    };
  
    const ImagePreload = () => {
      
        setImageSrc(images);
    
    }
  
    const ClearSelectedSize = () => {
      const arraySizes: string[] = ['36 RU', '37 RU', '38 RU', '39 RU', '40 RU', '41 RU', '42 RU', '43 RU'];
  
      for (var i = 0; i < arraySizes.length; i++) {
        if (sizeMapperP.get(arraySizes[i]) === true)
            sizeMapperP.set(arraySizes[i], false)
  
        // if (arraySizes[i] === MitemPrevewGet?.sizes[0]) {
        //   if (sizeMapper.get(arraySizes[i]) === false) {
        //     sizeMapper.set(arraySizes[i], true)
        //   }
        // }
      }
    }
  
    const SetSelectedSize = (item: string) => {
      const arraySizes: string[] = ['36 RU', '37 RU', '38 RU', '39 RU', '40 RU', '41 RU', '42 RU', '43 RU'];
  
      if (sizeMapperP.get(item) === false) {
          sizeMapperP.set(item, true)
      }
      
      for (var i = 0; i < arraySizes.length; i++) {
        if (arraySizes[i] !== item) {
          if (sizeMapperP.get(arraySizes[i]) === true) {
            sizeMapperP.set(arraySizes[i], false);
          }
        }
      }
  
      console.log(sizeMapperP);
  
      setSelectedClick(true)
    }
  
    const GetSizeSelected = () => {
      const arraySizes: string[] = ['36 RU', '37 RU', '38 RU', '39 RU', '40 RU', '41 RU', '42 RU', '43 RU'];
  
      for (var i = 0; i < arraySizes.length; i++) {
        if (sizeMapperP.get(arraySizes[i]) === true)
            return arraySizes[i];
      }
  
      return MitemPrevewGet?.sizes[0];
    }
  
  
    useEffect(() => {
      setSelectedClick(false)
    },[selectedClick || sizeMapper])
  
    const OutputButtonStateSize = (size_string: string) => {
        return 'item_sizeopt preview'

    } 

    const [cartExist, setCartExist] = useState<boolean>(false);

    const [cartAdded, setCartAdded] = useState<boolean>(false);
  
    const CartName = async () => {
  
    //   if (itemPrevewGet !== null) {
    //     const accessTokens: string = Cookies.get('AccessToken') as string;  
  
    //     // if (accessTokens !== undefined) {
    //     //   try {
    //     //     if (await handleShopCartItemExist(GetInfoUser_Id(), itemPrevewGet.hashName, accessTokens)) {
    //     //       setCartExist(true)
    //     //     }
    //     //   }
    //     //   catch {
    //     //     setCartExist(false)
    //     //   }
          
         
          
    //     // }
    //   }
    }
  
  
    //при вызове данного элемента рендерю изображения из массива
    useEffect(()=>{
      if (MitemPrevewGet !== null) {
        ClearSelectedSize();
  
        ImagePreload();
      }
    },[MitemPrevewGet])
  
    useEffect(()=>{
      CartName();
      setCartAdded(false);
    },[cartAdded])

    const AddToCart = async () => {
        // if (itemPrevewGet !== null) {
        //     const accessTokens: string = Cookies.get('AccessToken') as string;  

        //     const sizeSelected =  GetSizeSelected();

        //     if (!cartExist) {

        //         console.log(GetInfoUser_Id());

        //         if (accessTokens !== undefined && sizeSelected !== undefined) {
        //         await handleShopCardAddItem(GetInfoUser_Id(), itemPrevewGet.hashName, sizeSelected, accessTokens);
        //         setCartAdded(true);
        //         }
        //     }
        //     else {
        //         setCartAdded(false);
        //         tabIndexSet(2);
        //     }
        // }
    }

    const CartOutName = () => {
        return cartExist ? "Уже в корзине" : "В корзину"
    }

    const isArrayEqualToEmptyStrings = (arr: string[]): boolean => {
        // Проверяем, равен ли массив длиной 8 и все элементы пустые строки
        return arr.length === 8 && arr.every(item => item === '');
    }
    

    if (MitemPrevewGet === null) 
    return (<></>)

    return (<>
        <div className={(price !== 0 ? price : MitemPrevewGet.price) > 500000 ? "header_item_preview_area_title rich" : "header_item_preview_area_title"}  style={{color: 'black', marginTop: '20px', marginLeft: '25px'}}>
        {name !== "" ? name : MitemPrevewGet.name}
        </div>


        <div className="header_item_preview_area_rightitems" style={{marginTop: '20px'}}>
        
            <div className={(price !== 0 ? price : MitemPrevewGet.price) > 500000 ? "header_item_preview_area_price rich" : "header_item_preview_area_price"} style={{color: 'black' }}>
            {price !== 0 ? `${formatPrice(price)}Р` : `${formatPrice(MitemPrevewGet.price)}Р`}
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

                {!isArrayEqualToEmptyStrings(sizes) && sizes.map((size, index) => 
                     <div key={index}>
                        {size !== '' && (<div key={index} className={OutputButtonStateSize(size)}>
                        {size}
                        </div>)}
                     </div>
                )}


                {isArrayEqualToEmptyStrings(sizes) && MitemPrevewGet.sizes.map((size, index) => 
                    <div key={index}>
                        {size !== '' && (<div key={index} className={OutputButtonStateSize(size)}>
                        {size}
                        </div>)}
                    </div>
                )}     
            </div>

            <AnimatedDescription description={description !== "" ? description : MitemPrevewGet.description}/>

        </div>



        <ImagePreviewMain imageLink={imageSrc} price={price !== 0 ? price : MitemPrevewGet.price}/>


    </>)
}

const ContextMenu: React.FC<{ x: number; y: number; itemId: number; onClose: () => void }> = ({ x, y, itemId, onClose }) => {
    
    const { MitemPrevewGet, MitemPrevewSet } = useMItemPreviewVariable();

    const ClickDelete = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
            await handleItemDelete(itemId, accessTokens);
            onClose();
        }
    }


    const ItemGetInfo = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
  
            const getInfo = await handleGetOneItemInfo(itemId)
        
            if (getInfo !== null) {
                MitemPrevewSet(getInfo);
            }
    
        }
    }

    const ClickChange = async () => {
        changeItemSelected = true;
        ItemGetInfo();
        onClose();
    }

    return (
        <div
            className="context_menu_area"
            style={{
                top: y,
                left: x,
            }}

            onClick={onClose}>

            <div className="context_menu_secarea">
                <div className="context_buttons" onClick={()=>ClickChange()}>
                    Изменить товар
                </div>

                <div className="context_buttons red" onClick={ClickDelete}>
                    Удалить товар
                </div>
            </div>
        </div>
    );
};


const ChangeItem: React.FC = () => {

    const [selectedSizes, setSelectedSizes] = useState<string[]>(['', '', '', '', '', '', '', '']); 

    const [finalSizeSort, setfinalSizeSort] = useState<string[]>([]); 

    const [imageAddClicked, setimageAddClicked] = useState<boolean>(false);

    const [imageDeleteClicked, setimageDeleteClicked] = useState<boolean>(false);

    const { MitemPrevewGet, MitemPrevewSet } = useMItemPreviewVariable();

    const [imageBlockCount, setImageBlockCount] = useState<number>(0);

    const [imageFile, setImageFile ] = useState<File | null>(null);
    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();

        const droppedFiles = event.dataTransfer.files;

        if (droppedFiles.length > 0) {
            if (arrayFile.length < 5)
                setImageFile(droppedFiles[0]);
            else 
                console.log('лимит загружаемых изображений достигнут')
        }

    };

    const ImagePreload = async (item_images: string[]) => {
      
        if (item_images !== null) {
          if (item_images.length > 0) {
            const images = await handleLoadImagesArray(item_images);
            if (images !== null) {
              return images
            }
          }
        }

        return null;
    }

    const renderAPIimages = async () => {
        if (MitemPrevewGet !== null && MitemPrevewGet.imagePaths !== null) {
            var imagesRend = await ImagePreload(MitemPrevewGet.imagePaths);

            if (imagesRend !== null) {
                return imagesRend;
            }
        }
    }

    const getFileName = (filePath: string): string => {
        // Разделяем путь по символу '/' и берем последний элемент
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    };

    const fillUpAPIimages = async (imagesCompiled: string[]) => {
        if (MitemPrevewGet !== null && MitemPrevewGet.imagePaths !== null) {
            for (var i = 0; i < imagesCompiled.length; i++) {

                const response = await fetch(imagesCompiled[i]);
                const blob = await response.blob();

                const file = new File([blob], getFileName(MitemPrevewGet.imagePaths[i]), { type: blob.type });

                setImageFile(file);
            }
        }
    }

    const CompleteImagesFillUp = async () => {
        var imagesFromapi = await renderAPIimages();

        if (imagesFromapi !== undefined) {
            fillUpAPIimages(imagesFromapi);
        }
    }

    useEffect(()=>{
        arrayFile.length = 0;
        compiledImagesPreview.length = 0;
        if (MitemPrevewGet !== null && MitemPrevewGet.imagePaths !== null) {
            CompleteImagesFillUp();
        }
    }, [MitemPrevewGet])

    useEffect(() => {

       

        if (imageFile !== null) {
            arrayFile.push(imageFile);

            compiledImagesPreview.push(URL.createObjectURL(arrayFile[arrayFile.length - 1]))

            // imageMassiveSet(arrayFile); //после обновления стр, теряется 'File' (не стал делать)

            console.log(arrayFile)
            
            console.log(compiledImagesPreview)

            setImageBlockCount(prev => prev + 1)
            // console.log(imageMassiveGet)
        }
    
    }, [imageFile])

    const [nameItem, setNameItem] = useState<string>("");

    const [priceItem, setPriceItem] = useState<number>(0);
 
    const [descItem, setDescItem] = useState<string>("");

    const containToArraySizes = (index: number, size_name: string) => {
        setSelectedSizes(prevSize => {
            prevSize[index] = (prevSize[index] = size_name);
            return prevSize;
        })

        console.log(selectedSizes)
    };


    
    const sizeInOutputted = (size_name: string) => {

        switch (size_name) {
            case '36 RU':
            {
                if (sizeMapper.get(size_name) === true) {
                    containToArraySizes(0, size_name);
                }
                else {
                    containToArraySizes(0, '');
                }
                break;
            }
            case '37 RU': 
            {
                if (sizeMapper.get(size_name) === true) {
                    containToArraySizes(1, size_name);
                }
                else {
                    containToArraySizes(1, '');
                }
                break;
            }
            case '38 RU': 
            {
                if (sizeMapper.get(size_name) === true) {
                    containToArraySizes(2, size_name);
                }
                else {
                    containToArraySizes(2, '');
                }
                break;
            }
            case '39 RU': 
            {
                if (sizeMapper.get(size_name) === true) {
                    containToArraySizes(3, size_name);
                }
                else {
                    containToArraySizes(3, '');
                }
                break;
            }
            case '40 RU': 
            {
                if (sizeMapper.get(size_name) === true) {
                    containToArraySizes(4, size_name);
                }
                else {
                    containToArraySizes(4, '');
                }
                break;
            }
            case '41 RU': 
            {
                if (sizeMapper.get(size_name) === true) {
                    containToArraySizes(5, size_name);
                }
                else {
                    containToArraySizes(5, '');
                }
                break;
            }
            case '42 RU': 
            {
                if (sizeMapper.get(size_name) === true) {
                    containToArraySizes(6, size_name);
                }
                else {
                    containToArraySizes(6, '');
                }
                break;
            }
            case '43 RU': 
            {
                if (sizeMapper.get(size_name) === true) {
                    containToArraySizes(7, size_name);
                }
                else {
                    containToArraySizes(7, '');
                }
                break;
            }
        }

        // if (selectedSizes.length > 1) {
        //     const { sortedStrings } = sortStringsAndExtractNumbers(selectedSizes);

        //     setfinalSizeSort(sortedStrings);

        //     console.log(finalSizeSort)
        // }

    }

    const isArrayEqualToEmptyStrings = (arr: string[]): boolean => {
        // Проверяем, равен ли массив длиной 8 и все элементы пустые строки
        return arr.length === 8 && arr.every(item => item === '');
    }

    const OnClickedChangeItem = async () => {

        if (MitemPrevewGet !== null) {
            var CompletedName = nameItem !== "" ? nameItem : MitemPrevewGet.name;

            var CompletedDesc = descItem !== "" ? descItem : MitemPrevewGet.description;

            var CompletedPrice = priceItem !== 0 ? priceItem : MitemPrevewGet.price;
        
            var CompletedSizes = !isArrayEqualToEmptyStrings(finalSizeSort) ? finalSizeSort : MitemPrevewGet.sizes;

            const accessTokens: string = Cookies.get('AccessToken') as string;
            if (accessTokens !== undefined) {
                if (await handleItemChange(MitemPrevewGet.id, CompletedName, CompletedPrice, CompletedDesc, CompletedSizes, accessTokens)) {
                    
                    MitemPrevewSet(null);

                    changeItemSelected = false;


                    alert("Товар успешно изменен!");
                
                }
            }

        }
        // CheckTokensValidate();

        if (priceItem === undefined) {
            alert('Цена имеет недопустимое выражение')
            return;
        }

        // if (userCheckGet) {
        
        //     const accessTokens: string = Cookies.get('AccessToken') as string;
        //     if (accessTokens !== undefined) {
        //         // if (await handleItemAdd(nameItem, priceItem, descItem, finalSizeSort, accessTokens)) {
        //         //     console.log(`Товар: ${nameItem} успешно добавлен`)
        //         // }
        //         // else {
        //         //     console.log('Некоторое содержимое имеет недопустимое выражение')
        //         // }

        //         // if (arrayFile.length > 0) {
        //         //     if (await handleImageUpload(nameItem, arrayFile, accessTokens)) {
        //         //         console.log(`Изображения добавлены: ${arrayFile}`)
        //         //     }
        //         //     else {
        //         //         console.log('Ошибка загрузки изображений')
        //         //     }
        //         // }
        //     }
        // }
    }

  
    const [selectedClick, setSelectedClick] = useState<boolean>(false);

    const [selectedClickButton, setSelectedClickButton] = useState<boolean>(false);

    const SetSelectedSize = (item: string) => {
        if (sizeMapper.get(item) === false) {
            sizeMapper.set(item, true)
        }
        else {
            sizeMapper.set(item, false)
        }

        sizeInOutputted(item)
 
        setSelectedClick(true)
    }

    const SetSelectedButton = (index: string) => {
        if (buttonMapper.get(index) === false) {
            buttonMapper.set(index, true)
        }
        else {
            buttonMapper.set(index, false)
        }

        setSelectedClickButton(true)
    } 

    
    useEffect(() => {
        setSelectedClick(false)

        //Сортировка размеров по возрастанию, так легче заносить и читать из бд
        if (selectedSizes.length > 0) {
            const { sortedStrings } = sortStringsAndExtractNumbers(selectedSizes);

            setfinalSizeSort(sortedStrings);

            if (finalSizeSort.length > 0) {
                console.log(finalSizeSort)
            }
        }

    }, [selectedClick]);


    useEffect(() => {
        setSelectedClickButton(false)
    }, [selectedClickButton]);


    useEffect(() => {
        if (priceItem === 0) {
            setPriceItem(0);
        }
    }, [priceItem]);

    const OutputButtonStateSize = (size_string: string, nospace: boolean) => {


        if (sizeMapper.get(size_string) === true) {
            return nospace ? 'item_sizeopt nospace clicked' : 'item_sizeopt clicked'
        }
   
        return nospace ? 'item_sizeopt nospace' : 'item_sizeopt'
        
    }

    const OutputButtonState = (size_string: string) => {
        if (buttonMapper.get(size_string) === true) {
            return 'buttonarea_sideline_button clicked'
        }
        
        return 'buttonarea_sideline_button'
    }

    const AddImageAdd = () => {
      
        setimageAddClicked(true)

        console.log(imageBlockCount)
    }

    const ImageItemDelete = (id_image: number) => {

        setimageDeleteClicked(true)

        setImageFile(null);

        arrayFile.splice(id_image, 1)

        //Отрендеренные изображения
        compiledImagesPreview.splice(id_image, 1)
   
    }

    useEffect(()=>{
        if (imageDeleteClicked) {
            setimageDeleteClicked(false)
            console.log(arrayFile)
        }
    }, [imageDeleteClicked])

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };



    const ItemImage = (add_image: boolean, id_image: number = -1) => {
        if (add_image) {
            if (imageAddClicked) {
                return (
                <>
                    <div className="add_image_button_panel hide"></div>
                </>
                )
            }
            else {
                return (
                <>
                    <div className="add_image_button_panel" onClick={AddImageAdd}></div>
                </>
                )
            }
        }
        else {

            if (arrayFile[id_image] !== undefined && arrayFile[id_image] !== null) {

                const imagesout = compiledImagesPreview[id_image];

                return (
                    <>
                        <div className="add_image_button_panel curimg"
                        // onDrop={handleDrop} 
                        // onDragOver={handleDragOver} 
                        onClick={() => ImageItemDelete(id_image)}
                        >
                            
                            <div 
                            style={{
                                width: '100%', 
                                height: '100%', 
                                backgroundSize: 'cover', 
                                backgroundPosition: 'center',
                                backgroundImage: `url(${imagesout})`,
                                borderRadius: '8px'
                            }}>       
                            </div>
                       
                        </div>
                </>)
            }
            else {
                return (<></>)
            }
         
        } 

    }

    const ImageAddBlock = () => {
        return (
        <>
           
           {ItemImage(false, 0)}
           {ItemImage(false, 1)}
           {ItemImage(false, 2)}
           {ItemImage(false, 3)}
           {ItemImage(false, 4)}
           {ItemImage(true)}
        </>
        )
    }

    const ImageUploadBlockJSX = () => {
        if (imageAddClicked) {
            return (
                <>
                    <div className="blurred_background" style={{left: '-20px', width: 'calc(100% + 30px)', height: '100%'}}>
                       
                        <div className="exit_image_upload_panel" onClick={() => setimageAddClicked(false)}></div>
                       
                        <div className="image_upload_panel_popup"
                        onDrop={handleDrop} 
                        onDragOver={handleDragOver}>
                            Перетащите изображение

                            
                        </div>
                    </div>
                </>
            )
        }
        else {
            return (<></>)
        }
    }


    return (<>
        {ImageUploadBlockJSX()}
    
        <div className="add_section_panel_mainblock">
            <div className="input_sideline add_panel">
                <div className="title_input big">Название</div>

                <input className="input_text whitefull" 
                type="text"
                value={nameItem}
                onChange={(e) => setNameItem(e.target.value)}></input>
            </div>

            <div className="input_sideline add_panel value smallspace">
                <div className="title_input big">Цена</div>

                <input  className="input_text whitefull" 
                type="number" min="0"
                value={priceItem}
                onChange={(e) => setPriceItem(Number(e.target.value))}></input>

                <div className="value_money_block">
                    Р
                </div>
            </div>


            <div className="textarea_sideline">
                <div className="title_input big">Описание</div>

                <textarea rows={4} cols={20} className="input_textarea"
                value={descItem}
                onChange={(e) => setDescItem(e.target.value)}></textarea>
            </div>

            <div className="textarea_sideline sizeopt">
                <div className="title_input big">Размеры</div>

                <div className="input_textarea sizeopt">
                    <div className={OutputButtonStateSize('36 RU', true)} onClick={() => SetSelectedSize('36 RU')}>36 RU</div>
                    <div className={OutputButtonStateSize('37 RU', false)} onClick={() => SetSelectedSize('37 RU')}>37 RU</div>
                    <div className={OutputButtonStateSize('38 RU', false)} onClick={() => SetSelectedSize('38 RU')}>38 RU</div>
                    <div className={OutputButtonStateSize('39 RU', false)} onClick={() => SetSelectedSize('39 RU')}>39 RU</div>
                    <div className={OutputButtonStateSize('40 RU', true)} onClick={() => SetSelectedSize('40 RU')}>40 RU</div>
                    <div className={OutputButtonStateSize('41 RU', false)} onClick={() => SetSelectedSize('41 RU')}>41 RU</div>
                    <div className={OutputButtonStateSize('42 RU', false)} onClick={() => SetSelectedSize('42 RU')}>42 RU</div>
                    <div className={OutputButtonStateSize('43 RU', false)} onClick={() => SetSelectedSize('43 RU')}>43 RU</div>
                </div>
            </div>

            <div className="buttonarea_sideline" style={{opacity: '0'}}>
                <div className="buttonarea_sideline_text">
                    Пометить как ''хит''
                </div>

                <div className={OutputButtonState('firstButton')} onClick={() => SetSelectedButton('firstButton')}></div>
            </div>

            <div className="buttonarea_sideline" style={{opacity: '0'}}>
                <div className="buttonarea_sideline_text">
                    Пометить как ''новое''
                </div>

                <div className={OutputButtonState('secondButton')} onClick={() => SetSelectedButton('secondButton')}></div>
            </div>
            
            <div className="buttonarea_complete" onClick={OnClickedChangeItem}>
                Изменить товар
            </div>

        </div>

    
        <div className="add_section_panel_secondblock">
            <PreviewItemChangeItem name={nameItem} description={descItem} price={priceItem} images={compiledImagesPreview} sizes={finalSizeSort} />
        </div>

        <div className="title_thirdblock_panel">Изображения</div>


        <div className="add_section_panel_thirdblock">
            {ImageAddBlock()}
        </div>
    </>)
}

const ChangeSectionPanel: React.FC = () => {

    const [infoItem, setInfoItem] = useState<ItemProperties[]>([]);

    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; itemId: number; } | null>(null);

    const [updateChange, setUpdateChange] = useState<boolean>(false);

    const { MitemPrevewGet, MitemPrevewSet } = useMItemPreviewVariable();

    const handleContextMenu = (event: MouseEvent, itemId: number) => {
        setMenuPosition(null);
        
        event.preventDefault(); // Предотвращаем стандартное контекстное меню
        if (menuPosition === null)
            setMenuPosition({ x: event.pageX, y: event.pageY, itemId });
    };
  

    const handleCloseMenu = () => {
        setMenuPosition(null);
        setUpdateChange(true)
    };


    const ItemGetInfo = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
  
            const getInfo = await handleGetItemInfo()
        
            if (getInfo !== null) {
                setInfoItem(getInfo);
            }
    
        }
    }

    const ItemPrint = () => {
        if (infoItem !== undefined) {
            return (<>
                {infoItem.map(item => 
                    <ItemShoes 
                    key={item.id} 
                    id_item={item.id}
                    name_item={item.name} 
                    description_item={item.description}
                    image_paths={item.imagePaths}
                    size_item={item.sizes}
                    hash_item={item.hashName}
                    type_item={"none"} 
                    animation_style={2} 
                    image_prevew_link={item.imagePaths.length > 0 ? item.imagePaths[0] : ''}
                    onContext={(e)=>handleContextMenu(e, item.id)}
                    price={item.price}/>
                )}
            </>)
        }
        else {
            return (<></>)
        }
    }

    useEffect(()=> {
        ItemGetInfo();
        MitemPrevewSet(null);
        changeItemSelected = false;
    }, [])

    useEffect(()=>{
        if (!changeItemSelected) {
            MitemPrevewSet(null);
            ItemGetInfo();
        }
    }, [changeItemSelected])

    useEffect(()=>{
        if (menuPosition === null)
            ItemGetInfo();
    }, [menuPosition]);

   
    useEffect(()=>{
        if (updateChange) {
            ItemGetInfo();
            setUpdateChange(false);
        }
    }, [updateChange])

    return (<>

        {menuPosition && (
            <ContextMenu x={menuPosition.x - 280} y={menuPosition.y - 90} itemId={menuPosition.itemId} onClose={handleCloseMenu} />
        )}


        {(changeItemSelected) && <ChangeItem/>}

        { (!changeItemSelected) &&
        <div className="area_of_webitems" onClick={handleCloseMenu}>
        {ItemPrint()}
        </div>
        }
    </>)
}

export default ChangeSectionPanel