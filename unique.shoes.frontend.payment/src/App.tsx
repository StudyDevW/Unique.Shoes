import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import './App.sass'
import axios from 'axios';

const handlePay = async (hashPay: string, cardNumber: string, cvv: string) => {
  try {
    const response = await axios.post(`http://localhost:8083/api/Payment/CardPay`, {
        hashPay: hashPay,
        cardNumber: cardNumber,
        cvv: cvv
    });

    if (response.status === 200) {
        return true;
    }

    return false;

  }
  catch (error) {
    console.log(error)
  }
}

const handleHashCheckToExist = async (hashPay: string) => {
  try {
    const response = await axios.get('http://localhost:8083/api/Payment/Check', {
          headers: {
              hashPay: hashPay,
          },
    });

    if (response.status === 200) {
        return true
    }

  } catch (error) {

    return false;
  }
}

const App: React.FC = () => {

  const location = useLocation();
  const [numberCard, setNumberCard] = useState<string>("");
  const [payChecked, setPayChecked] = useState<boolean>(false);
  const [numberCVV, setNumberCVV] = useState<string>("");


  const insertSpacesEveryFourChars = (input: string): string => {
    return input.replace(/(.{4})/g, '$1 ').trim();
  }

  const extractIdFromUrl = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  const idPath = extractIdFromUrl(`http://localhost:5173/${location.pathname}`);


  const PaymentCheckFunc = async () => {
    if (await handleHashCheckToExist(idPath)) {
      setPayChecked(true);
    }
    else {
      setPayChecked(false);
    }
  }

  useEffect(()=>{
    PaymentCheckFunc();
  },[])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '');
    const formattedValue = insertSpacesEveryFourChars(value);
    setNumberCard(formattedValue);
  };

  const payFunc = async () => {
    if (await handlePay(idPath, numberCard, numberCVV)) {
      window.location.href = 'http://localhost:4000/paymentexist';
    }
  }

  const PaymentPrint = () => {
    if (payChecked) {
      return (
        <>
          <div className="area_payment">
            <div className="payment_title">
              Оплата заказа
            </div>
    
            <div className="payment_title_hash">
              {`Заказ: ${idPath}`}
            </div>
    
            <div className="payment_area_elements">
    
              <div className="firstcardpay">
                <div className="firstcardpay_title">Виртуальная карта</div>
                <input  className="input_text" 
                    type="text" maxLength={19}
                    value={numberCard}
                    onChange={handleChange}></input>
    
                <div className="firstcardpay_desc">Введите номер карты</div>
    
                <div className="image_desc"></div>
              </div>
    
              <div className="secondcardpay">
                <div className="secondcardpay_line"></div>
    
                <input  className="input_text small" 
                    type="password" maxLength={3} 
                    value={numberCVV}
                    onChange={(e) => setNumberCVV(e.target.value)}></input>
    
                <div className="secondcardpay_desc">Код CVV</div>
    
              </div>
    
              <div className="buy_button" onClick={payFunc}>
                Оплатить
              </div>
    
            </div>
    
          </div>
        </>
      )
    }
    else {
      return (
        <>
          <div className="area_payment">
            <div className="payment_title" style={{textAlign: 'left', marginLeft: '25px'} }>
              Ошибка
            </div>
    
            <div className="payment_title_hash">
              {`Такого заказа не существует`}
            </div>
          </div>
        </>
      )
    }
  }

  return (<>
    {PaymentPrint()}
  </>)
  
}

export default App
