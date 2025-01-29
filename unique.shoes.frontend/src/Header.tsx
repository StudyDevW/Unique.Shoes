import { useState, useRef, useEffect } from 'react'

import Miniprofile from './Miniprofile.tsx'
import useloginPageOpenedVariable from './components/Variables/OpenLoginPageVariable.ts';
import useregisterPageOpenedVariable from './components/Variables/OpenRegisterPageVariable.ts';
import LoginPage from './components/AuthPages/LoginPage.tsx'
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
let animClosedHeader: boolean = false;
import useItemPreviewVariable from './components/Variables/ItemPreviewVariable.ts';
import MainProfile from './Profile/MainProfile.tsx';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import LoadShopCart from './components/DynamicHeader/ShopCart.tsx';
import useTabIndexVariable from './components/Variables/TabIndexVariable.ts';
import useOpenProfileVariable from './components/Variables/OpenProfileVariable.ts';
import PreviewItemHeader from './components/DynamicHeader/PreviewItem.tsx';
import useGetInfoUserVariable from './components/Variables/GetInfoUserVariable.ts';
import CheckTokensValidate from './TokenCheckMain.tsx';
import useLoginSuccessVariable from './components/Variables/LoginSuccessVariable.ts';
import { GetInfoUser_Id } from './components/API/AccountInfo.tsx';
import RegisterPage from './components/AuthPages/RegisterPage.tsx';


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
    
    const { loginPageOpenedGet, loginPageOpenedSet } = useloginPageOpenedVariable();

    const { registerPageOpenedGet, registerPageOpenedSet } = useregisterPageOpenedVariable();

    const { openProfileGet, openProfileSet } = useOpenProfileVariable();

    const [resetPreview, setResetPreview] = useState<boolean>(true);

    const { itemPrevewGet, itemPrevewSet } = useItemPreviewVariable();

    const [headerBig, setHeaderBig] = useState<boolean>(false);

    const refScrollUp = useRef<HTMLDivElement>(null);

    const { userCheckGet, userCheckSet } = useGetInfoUserVariable();

    const { loginSuccessGet, loginSuccessSet } = useLoginSuccessVariable();
  
    const [tokenSuccess, SetTokenSuccess] = useState<boolean>(false);
  
  
    const TokenPreStart = async () => {
        if (!loginSuccessGet && await CheckTokensValidate()) {
            SetTokenSuccess(true);
            console.log(`Профиль открыт ${openProfileGet}`)
            console.log(loginSuccessGet)
        }
    }
  
    useEffect(()=>{
        TokenPreStart();
    }, [loginSuccessGet])

    useEffect(()=>{
      TokenPreStart();
    }, [loginPageOpenedGet])

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

    useEffect(()=>{
      if (tokenSuccess) {
        loginSuccessSet(true);

        userCheckSet(true);

        console.log(loginSuccessGet);
      }
    }, [tokenSuccess])

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
      else if (registerPageOpenedGet) {
        animClosedHeader = true
  
        document.body.style.overflow = "hidden";
  
        handleScrollUp();
  
        return (<>
  
          <div ref={refScrollUp}> </div>
  
          <div className="header small">
                <div className="logo"> </div>
  
                {Miniprofile(true)}
          </div>
  
          <RegisterPage/>
  
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
        else if (registerPageOpenedGet) {
          animClosedHeader = true
    
          document.body.style.overflow = "hidden";
    
          handleScrollUp();
    
          return (<>
    
            <div ref={refScrollUp}> </div>
    
            <div className="header small">
                  <div className="logo"> </div>
    
                  {Miniprofile(true)}
            </div>
    
            <RegisterPage/>
    
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
            
            
            {(tokenSuccess) && (<MainProfile/>)}
    
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