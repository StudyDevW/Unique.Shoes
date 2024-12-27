
let loginPageOpened: boolean = false;

function SetOpenLogin(chk: boolean): void {
    loginPageOpened = chk
}

function GetOpenLogin(): boolean {
    return loginPageOpened
}

export { SetOpenLogin, GetOpenLogin }