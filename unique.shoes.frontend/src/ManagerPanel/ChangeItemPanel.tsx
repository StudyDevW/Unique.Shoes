import { useState, useEffect, MouseEvent } from "react"
import { handleGetItemInfo } from "../components/API/ItemInfo.tsx";
import Cookies from 'js-cookie';
import ItemShoes from "../Item.tsx";
import { handleItemDelete } from "../components/API/CreateItem.tsx";

interface ItemProperties {
    id: number,
    hashName: string,
    name: string,
    description: string
    flags: string[]
    price: number
    count: boolean
    sizes: string[]
    imagePaths: string[]
}

const ContextMenu: React.FC<{ x: number; y: number; itemId: number; onClose: () => void }> = ({ x, y, itemId, onClose }) => {
    
    const ClickDelete = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
            await handleItemDelete(itemId, accessTokens);
        }
    }

    return (
        <div
            className="context_menu_area"
            style={{
                top: y,
                left: x,
            }}

            onClick={onClose}>

            <div className="context_menu_secarea">
                <div className="context_buttons">
                    Изменить товар
                </div>

                <div className="context_buttons red" onClick={ClickDelete}>
                    Удалить товар
                </div>
            </div>
        </div>
    );
  };

const ChangeSectionPanel: React.FC = () => {

    const [infoItem, setInfoItem] = useState<ItemProperties[]>([]);

    const [menuPosition, setMenuPosition] = useState<{ x: number; y: number; itemId: number; } | null>(null);

    const [updateChange, setUpdateChange] = useState<boolean>(false);

    const handleContextMenu = (event: MouseEvent, itemId: number) => {
        setMenuPosition(null);
        
        event.preventDefault(); // Предотвращаем стандартное контекстное меню
        if (menuPosition === null)
            setMenuPosition({ x: event.pageX, y: event.pageY, itemId });
    };
  
    const handleCloseMenu = () => {
        setMenuPosition(null);
        setUpdateChange(true)
    };
   
    useEffect(()=>{
        if (updateChange) {
            ItemGetInfo();
            setUpdateChange(false)
        }
    }, [updateChange])

    const ItemGetInfo = async () => {
        const accessTokens: string = Cookies.get('AccessToken') as string;
        if (accessTokens !== undefined) {
  
            const getInfo = await handleGetItemInfo()
        
            if (getInfo !== null) {
                setInfoItem(getInfo);
            }
    
        }
    }

    const ItemPrint = () => {
        if (infoItem !== undefined) {
            return (<>
                {infoItem.map(item => 
                    <ItemShoes 
                    key={item.id} 
                    id_item={item.id}
                    name_item={item.name} 
                    description_item={item.description}
                    image_paths={item.imagePaths}
                    size_item={item.sizes}
                    hash_item={item.hashName}
                    type_item={"none"} 
                    animation_style={2} 
                    image_prevew_link={item.imagePaths.length > 0 ? item.imagePaths[0] : ''}
                    onContext={(e)=>handleContextMenu(e, item.id)}
                    price={item.price}/>
                )}
            </>)
        }
        else {
            return (<></>)
        }
    }

    useEffect(()=> {
        ItemGetInfo();
    }, [])

    return (<>

        {menuPosition && (
            <ContextMenu x={menuPosition.x - 280} y={menuPosition.y - 90} itemId={menuPosition.itemId} onClose={handleCloseMenu} />
        )}

        <div className="area_of_webitems" onClick={handleCloseMenu}>
        {ItemPrint()}
        </div>
    </>)
}

export default ChangeSectionPanel