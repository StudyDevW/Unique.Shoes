import { useState, useEffect } from "react"
import { handleItemAdd } from "../components/API/CreateItem.tsx"; 
import useGetInfoUserVariable from "../components/Variables/GetInfoUserVariable.ts";
import Cookies from 'js-cookie';
import CheckTokensValidate from "../TokenCheckMain.tsx"

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

let buttonMapper = new Map<string, boolean>([
    ['firstButton', false],
    ['secondButton', false]
]);

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

const AddSectionPanel: React.FC = () => {

    const [selectedSizes, setSelectedSizes] = useState<string[]>(['', '', '', '', '', '', '', '']); 

    const [finalSizeSort, setfinalSizeSort] = useState<string[]>([]); 

    const { userCheckGet } = useGetInfoUserVariable();


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

    const OnClickedAddItem = async () => {

        //Решить проблему с плавным обновлением токена 
        //Скорее всего ловить ошибку Axios, обновлять токены и заново
        //делать запрос в микросервис
        
        // CheckTokensValidate();

        if (userCheckGet) {
        
            const accessTokens: string = Cookies.get('AccessToken') as string;
            if (accessTokens !== undefined) {
                if (await handleItemAdd(nameItem, priceItem, descItem, finalSizeSort, accessTokens)) {
                    alert(`Товар: ${nameItem} успешно добавлен`)
                }
                else {
                    alert('Некоторое содержимое имеет недопустимое выражение')
                }
            }
        }
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

    return (
    <>
       

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

            <div className="buttonarea_sideline">
                <div className="buttonarea_sideline_text">
                    Пометить как ''хит''
                </div>

                <div className={OutputButtonState('firstButton')} onClick={() => SetSelectedButton('firstButton')}></div>
            </div>

            <div className="buttonarea_sideline">
                <div className="buttonarea_sideline_text">
                    Пометить как ''новое''
                </div>

                <div className={OutputButtonState('secondButton')} onClick={() => SetSelectedButton('secondButton')}></div>
            </div>
            
            <div className="buttonarea_complete" onClick={OnClickedAddItem}>
                Создать товар
            </div>

        </div>

        <div className="add_section_panel_secondblock">

        </div>

        <div className="add_section_panel_thirdblock">

        </div>

    </>)
}

export default AddSectionPanel