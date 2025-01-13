import { useState, useRef, useEffect } from 'react'
import Miniprofile from './Miniprofile.tsx'
import useloginPageOpenedVariable from './components/Variables/OpenLoginPageVariable.ts';
import LoginPage from './LoginPage.tsx'
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
let animClosedHeader: boolean = false;
import useItemPreviewVariable from './components/Variables/ItemPreviewVariable.ts';
import { handleLoadImage } from './components/API/ItemInfo.tsx';

const ImagePreviewMain: React.FC<{imageLink: string}> = ({imageLink}) => {

  const [imageSrc, setImageSrc] = useState('');

  const ImagePreload = async () => {

    if (imageLink !== "") {

        const imageFromAPI = await handleLoadImage(imageLink);

        if (imageFromAPI !== null) {
          setImageSrc(imageFromAPI)
        }
    }
  }

  useEffect(()=>{
    ImagePreload();
  },[])

  return (<>
    <div className="header_item_preview_area_image" 
    style=
    {
      {
        backgroundImage: `url(${imageSrc !== '' ? imageSrc : '../images/missing_image.png'})`,
        backgroundSize: imageSrc !== '' ? 'cover' : '250px',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    }>

    </div>
    </>)
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
  
    useEffect(()=>{
      ResetPrev();

    },[])

    useEffect(()=>{

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


                  <div className="header_item_preview_title">Превью товара</div>

                  <div className="header_item_preview_button_back" onClick={()=>{itemPrevewSet(null);}}>Вернуться</div>

                  <div className="header_item_preview_separator"></div>
                  <div className="header_item_preview_area">
                    <div className="header_item_preview_area_title">
                      {itemPrevewGet.name}
                    </div>

                  <ImagePreviewMain imageLink={itemPrevewGet.imagePaths[0]}/>

                  </div>
                  

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