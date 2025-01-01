import { useState, useRef, useEffect } from 'react'
import Miniprofile from './Miniprofile.tsx'
import useloginPageOpenedVariable from './components/Variables/OpenLoginPageVariable.ts';
import LoginPage from './LoginPage.tsx'
import useLoadingProfile from './components/Variables/LoadingProfileVariable.ts';
let animClosedHeader: boolean = false;

const Header: React.FC = () => {
    
    const { loginPageOpenedGet } = useloginPageOpenedVariable();

    const refScrollUp = useRef<HTMLDivElement>(null);

    const handleScrollUp = () => {
        refScrollUp.current?.scrollIntoView({ behavior: "smooth" });
    };
    

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

export default Header