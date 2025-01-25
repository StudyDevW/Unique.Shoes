import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import './App.sass'
import axios from 'axios';

interface OutPayInfo {
    hashPay: string,
    payStatus: string,
    cardNumber: string,
    date: string
}

var printInfo: OutPayInfo[] = [];

const handleCheckOperations = async (hashPay: string) => {
    try {
        const response = await axios.get(`http://localhost:8083/api/Payment/${hashPay}`);
    
        if (response.status === 200) {
            printInfo = response.data;
            return true;
        }
    
      } catch (error) {
        return false;
      }
}

const InfoApp: React.FC = () => {
    const [payChecked, setPayChecked] = useState<boolean>(false);
    const location = useLocation();

    const extractIdFromUrl = (url: string): string => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    };

    const idPath = extractIdFromUrl(`http://localhost:5173/getInfo/${location.pathname}`);

    const PaymentsPrintFunc = async () => {
        if (await handleCheckOperations(idPath)) {
            setPayChecked(true);
          }
          else {
            setPayChecked(false);
          }
    }

    useEffect(()=>{
        PaymentsPrintFunc();
    },[])

    const PrintTitlePay = (index_get: number) => {
        var outString: string = "";

        printInfo.map((operation, index) => {
            if (index === index_get) {
                if (operation.payStatus === "success") {
                    outString = "Оплата успешна"
                }
                else if (operation.payStatus === "failed") {
                    outString = "Оплата не прошла"
                }
                else if (operation.payStatus === "money_not_exist") {
                    outString = "Оплата не прошла"
                }
            }
        });

        return outString;

    }

    const DatePrint = (dateFrom: string) => {
        const date = new Date(dateFrom);

        const day = date.getDate();
        const month = date.toLocaleString('russian', { month: 'short' }); // Получаем название месяца
        const year = date.getFullYear();

        return `Попытка от ${day} ${month} ${year}`;
    }

    const PrintStatusPay = (index_get: number) => {
        var outString: string = "";

        printInfo.map((operation, index) => {
            if (index === index_get) {
                if (operation.payStatus === "success") {
                    outString = "Деньги списаны"
                }
                else if (operation.payStatus === "failed") {
                    outString = "Неизвестная карта"
                }
                else if (operation.payStatus === "money_not_exist") {
                    outString = "Недостаточно средств"
                }
            }
        });

        return outString;
    }

    const PaymentPrint = () => {
        if (payChecked) {
            return (<>
                <div className="area_payment">
                    <div className="payment_title" style={{textAlign: 'left', marginLeft: '25px'} }>
                    История оплаты
                    </div>
            
                    <div className="payment_title_hash">
                    {`Заказ: ${idPath}`}
                    </div>

                    <div className="payment_print_area">

                        {printInfo.map((operation, index) => 
                        
                            <div key={index} className="payment_print_item">
                                <div className="payment_print_item_title">{PrintTitlePay(index)}</div>

                                <div className="payment_print_item_cardn">{`Карта: ${operation.cardNumber}`}</div>

                                <div className="payment_print_item_status">{PrintStatusPay(index)}</div>

                                
                                <div className="payment_print_item_data">{DatePrint(operation.date)}</div>
                            </div>
                        )}

                        

                      
                    </div>
            </div>
            </>)
        }
    }

    return (<>{PaymentPrint()}</>)
}

export default InfoApp;