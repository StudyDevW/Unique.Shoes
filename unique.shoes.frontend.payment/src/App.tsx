import { useEffect, useState, useRef } from 'react'
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
  const [cardMaxNum, setCardMaxNum] = useState<boolean>(false);

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

  const CardMaxNumberAnimation = (classname: string) => {
      if (cardMaxNum) 
        return `${classname} active`
      

      return `${classname}`
  }

  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);

  const handleKeyDown = (nextInputRef: React.RefObject<HTMLInputElement>) => {
      nextInputRef.current?.focus();
  };

  const handleKeyDownBack = (e: React.KeyboardEvent<HTMLInputElement>, nextInputRef: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Backspace' && numberCVV.length === 0)
      nextInputRef.current?.focus();
  };

  useEffect(()=>{
    if (numberCard.length === 19) {
      setCardMaxNum(true);
      handleKeyDown(inputRef2);
    }
    else {
      setNumberCVV("")
      setCardMaxNum(false);
    }
  }, [numberCard])

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
    
              {/* <div className="payment_cards_fromother_area">
                  <div className="payment_cards_fromother_title">Привязанные карты</div>

                  <div className="payment_cards_fromother_card_item_area">

                    <div className="payment_cards_fromother_card_item">
                      <div className="payment_cards_fromother_card_item_number" style={{fontSize: '16px', marginTop: '50px', marginLeft: '-1px', userSelect: 'none'}}>Оплатить другой картой</div>
                    </div>

                    <div className="payment_cards_fromother_card_item">
                      <div className="payment_cards_fromother_card_item_title">Виртуальная карта</div>
                      <div className="payment_cards_fromother_card_item_number">0000 1234 0000 4321</div>
                      <div className="payment_cards_fromother_card_item_image_desc"></div>
                    </div>

                    <div className="payment_cards_fromother_card_item">
                      <div className="payment_cards_fromother_card_item_title">Виртуальная карта</div>
                      <div className="payment_cards_fromother_card_item_number">0000 1234 0000 4321</div>
                      <div className="payment_cards_fromother_card_item_image_desc"></div>
                    </div>

                  </div>
              </div> */}

              <div className={CardMaxNumberAnimation("firstcardpay")}>
                  <div className="firstcardpay_title">Виртуальная карта</div>
                  <input  className="input_text" 
                      type="text" maxLength={19}
                      value={numberCard} ref={inputRef1}
                      onChange={handleChange}></input>
      
                  <div className="firstcardpay_desc">Введите номер карты</div>
      
                  <div className="image_desc"></div>
                </div>
      
                <div className={CardMaxNumberAnimation("secondcardpay")}>
                  <div className="secondcardpay_line"></div>
      
                  <input  className="input_text small" 
                      type="password" maxLength={3} 
                      value={numberCVV} ref={inputRef2}
                      onChange={(e) => setNumberCVV(e.target.value)}
                      onKeyDown={(e) => handleKeyDownBack(e, inputRef1)}></input>
      
                  <div className="secondcardpay_desc">Код CVV</div>
                  <div className="image_desc left">*обратная сторона карты</div>
                </div>

                {(numberCVV.length === 3) && <div className="buy_button" onClick={payFunc}>
                  Оплатить
                </div>} 

              {/* 
    
             */}
    
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
