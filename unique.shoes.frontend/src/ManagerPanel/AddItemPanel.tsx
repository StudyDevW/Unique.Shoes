import { useState, useEffect } from "react"

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

const AddSectionPanel: React.FC = () => {

    // const [selectedSizes, setSelectedSizes] = useState<string[]>(['', '', '', '', '', '', '', '']); 

    const [selectedClick, setSelectedClick] = useState<boolean>(false);

    const [selectedClickButton, setSelectedClickButton] = useState<boolean>(false);

    const SetSelectedSize = (item: string) => {
        if (sizeMapper.get(item) === false) {
            sizeMapper.set(item, true)
        }
        else {
            sizeMapper.set(item, false)
        }

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
                type="text"></input>
            </div>

            <div className="input_sideline add_panel value smallspace">
                <div className="title_input big">Цена</div>

                <input className="input_text whitefull" 
                type="text"></input>

                <div className="value_money_block">
                    Р
                </div>
            </div>


            <div className="textarea_sideline">
                <div className="title_input big">Описание</div>

                <textarea rows={4} cols={20} className="input_textarea"></textarea>
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
            
            <div className="buttonarea_complete">
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