
let flagProfileLoading: boolean = true;

const profileLoadingSet = (chk: boolean) => {
    flagProfileLoading = chk;
};

const profileLoadingGet = () => {
    return flagProfileLoading;
};

export { profileLoadingSet, profileLoadingGet }