import Header from "../Header.tsx"
import CheckTokensValidate from "../TokenCheckMain.tsx"
import useButtonActivePanel from "../components/Variables/PanelMenuVariable.ts";

interface PropertiesButton {
    name_button: string; 
    type_button: string;
}

const ButtonElementForPanel: React.FC<PropertiesButton> = ({name_button, type_button}) => {

    const { PButtonActiveGet, PButtonActiveSet } = useButtonActivePanel();


    const ButtonActiveComplete = () => {
        PButtonActiveSet(type_button)
    }

    const ButtonTypeClass = () => {
        return `icon_area_button_panel ${type_button}`
    }

    const MainButtonActiveClass = () => {
        if (PButtonActiveGet === type_button)
            return `button_panel_with_icon active`
        else 
            return 'button_panel_with_icon'
    }

    return (<>
      <div className={MainButtonActiveClass()} onClick={ButtonActiveComplete}>
        <div className={ButtonTypeClass()}></div>

        <div className="vertical_line_button_panel"></div>

        <div className="text_area_button_panel">{name_button}</div>
      </div>
    </>)
} 

const ManagerPanel: React.FC = () => {

    CheckTokensValidate();

    return (<>
        
        <Header/>

        <div className="left_panel_manager">
            <div className="area_of_buttons_panel">

                <div className="title_group_panel">Товар</div>

                <ButtonElementForPanel name_button="Добавить" type_button="add_button"/>
              
                <ButtonElementForPanel name_button="Изменить" type_button="change_button"/>

                <ButtonElementForPanel name_button="Скидки" type_button="sale_button"/>


                <div className="title_group_panel">Пользователи</div>

                <ButtonElementForPanel name_button="Гарантии" type_button="garant_button"/>
              
                <ButtonElementForPanel name_button="Спрос" type_button="spros_button"/>



            </div>
        </div>
        
    </>)
}

export default ManagerPanel