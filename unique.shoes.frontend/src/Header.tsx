import { useState, useRef, useEffect } from 'react'

import Miniprofile from './Miniprofile.tsx'
import useloginPageOpenedVariable from './components/Variables/OpenLoginPageVariable.ts';
import LoginPage from './LoginPage.tsx'
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
let animClosedHeader: boolean = false;
import useItemPreviewVariable from './components/Variables/ItemPreviewVariable.ts';
import MainProfile from './Profile/MainProfile.tsx';

import LoadShopCart from './components/DynamicHeader/ShopCart.tsx';
import useTabIndexVariable from './components/Variables/TabIndexVariable.ts';
import useOpenProfileVariable from './components/Variables/OpenProfileVariable.ts';
import PreviewItemHeader from './components/DynamicHeader/PreviewItem.tsx';


const HeaderPreviewItem: React.FC = () => {

  const { itemPrevewGet, itemPrevewSet } = useItemPreviewVariable();

  const { tabIndexGet, tabIndexSet } = useTabIndexVariable();

  useEffect(()=>{
  }, [tabIndexGet])

  const TabsCompiles = () => {
    if (itemPrevewGet === null) 
        return (<></>)

    if (tabIndexGet === 0 ) {
      return (<>
        <PreviewItemHeader/>      
      </>)
    }
    else if (tabIndexGet === 2) {
      return (<>
        <LoadShopCart/>
      </>)
    }
  }

  const TabSection = (index: number, small: boolean = false) => {
    if (index === tabIndexGet) {
      return small ? "header_item_preview_title small" : "header_item_preview_title"
    }
    else {
      return small ? "header_item_preview_title small inactive" : "header_item_preview_title inactive"
    }
  }

  if (itemPrevewGet !== null) 



    return (<>

        <div className="header_item_preview_title_area">
          <div className={TabSection(0)}        onClick={()=>tabIndexSet(0)}>Превью товара</div>
          <div className={TabSection(1)}        onClick={()=>tabIndexSet(1)}>Отзывы</div>
          <div className={TabSection(2, true)}  onClick={()=>tabIndexSet(2)}>Корзина</div>
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

    const { openProfileGet, openProfileSet } = useOpenProfileVariable();

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
            <div className="header fullsize">
                  <div className="logo"> </div>
    
                  {Miniprofile(false)}
    
                  <HeaderPreviewItem/>
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
        else if (openProfileGet) {
          animClosedHeader = true
    
          document.body.style.overflow = "hidden";
    
          handleScrollUp();
    
          return (<>
    
            <div ref={refScrollUp}> </div>
    
            <div className="header small">
                  <div className="logo"> </div>
    
                  {Miniprofile(true)}
            </div>
            
            <MainProfile/>
    
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