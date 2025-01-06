

const AddSectionPanel: React.FC = () => {
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

            <div className="textarea_sideline">
                <div className="title_input big">Размеры</div>

                <div className="input_textarea sizeopt">
                    <div className="item_sizeopt nospace">36 RU</div>

                    <div className="item_sizeopt">37 RU</div>

                    <div className="item_sizeopt">38 RU</div>

                    <div className="item_sizeopt">39 RU</div>

                    <div className="item_sizeopt nospace">40 RU</div>

                    <div className="item_sizeopt">41 RU</div>

                    <div className="item_sizeopt">42 RU</div>

                    <div className="item_sizeopt">43 RU</div>

                </div>
            </div>

        </div>

        <div className="add_section_panel_secondblock">

        </div>

        <div className="add_section_panel_thirdblock">

        </div>

    </>)
}

export default AddSectionPanel