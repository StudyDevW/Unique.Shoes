import useOpenProfileVariable from "./components/Variables/OpenProfileVariable"
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentExist: React.FC = () => {

    const navigate = useNavigate();
    const { openProfileGet, openProfileSet } = useOpenProfileVariable();

    useEffect(()=>{
        if (!openProfileGet) {

            console.log(openProfileGet);

            const intervalId = setInterval(()=>
            {
                openProfileSet(true);
                navigate('/');
                
            }, 4000); 
  
            return () => clearInterval(intervalId);
        }
        else {
            navigate('/');
        }
    },[openProfileGet])

    return(<>Переадресация...</>)
}

export default PaymentExist;