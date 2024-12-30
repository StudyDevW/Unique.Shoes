import Header from "./Header.tsx"
import CheckTokensValidate from "./TokenCheckMain.tsx";

function ManagerPanel() {

    CheckTokensValidate();

    return (<>
        
        <Header/>
    </>)
}

export default ManagerPanel