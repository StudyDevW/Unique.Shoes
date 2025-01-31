import { useState, useRef, useEffect } from 'react'
import './preprocessor/App.sass'
import ItemShoes from './Item.tsx'
import Header from './Header.tsx'
import CheckTokensValidate from './TokenCheckMain.tsx'
import useItemPreviewVariable from './components/Variables/ItemPreviewVariable.ts'
import useOpenProfileVariable from './components/Variables/OpenProfileVariable.ts'
import useGetInfoUserVariable from './components/Variables/GetInfoUserVariable.ts'
import { useNavigate, useLocation } from 'react-router-dom';
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts'
import { AccessCheckBackground } from './components/Observer/TokenObserver.ts'
import useLoginSuccessVariable from './components/Variables/LoginSuccessVariable.ts'
import { GetInfoUser_Id } from './components/API/AccountInfo.tsx'
import { handleGetItemInfo } from './components/API/ItemInfo.tsx'
import Cookies from 'js-cookie';

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

function NewItems() {

  const navigate = useNavigate();

  const { itemPrevewGet } = useItemPreviewVariable();
  const location = useLocation();
  const { loginSuccessGet, loginSuccessSet } = useLoginSuccessVariable();
  const [infoItem, setInfoItem] = useState<ItemProperties[]>([]);

  const [starImages, setStarImages] = useState<string[]>([]);

  const [adogImages, setAdogImages] = useState<string[]>([]);

  const ref = useRef<HTMLDivElement>(null);

  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });


  
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


  useEffect(()=>{
    loginSuccessSet(false);
    ItemGetInfo();
  },[])
  
  const ItemGetInfo = async () => {

      const getInfo = await handleGetItemInfo()
  
      if (getInfo !== null) {
          setInfoItem(getInfo);
      }
  }

  const ItemPrint = (category: string) => {
    if (infoItem !== undefined) {
        return (<>
            {infoItem.map((item, index) => 
              (item.flags.includes(category)) && 
               <ItemShoes 
                key={item.id} 
                id_item={item.id}
                name_item={item.name} 
                description_item={item.description}
                image_paths={item.imagePaths}
                size_item={item.sizes}
                hash_item={item.hashName}
                type_item={category === "demand" ? "demand_mark" : "new_mark"} 
                animation_style={2} 
                image_prevew_link={item.imagePaths.length > 0 ? item.imagePaths[0] : ''}
                onContext={() => {}}
                price={item.price}/>
            )}
        </>)
    }
    else {
        return (<></>)
    }
  }


  return (
    <>

      <Header/>

      <div className="info_items" style={{marginTop: '120px'}}>


    
          {(infoItem !== null) && ItemPrint('new')}

          {/* <p style={{position: 'absolute', marginTop: '-3px'}}>Width: {size.width}px</p>
          <p style={{position: 'absolute', marginTop: '-3px', marginLeft: '100px'}}>Height: {size.height}px</p> */}

      </div>

    </>
  )
}

export default NewItems