import { BASE_URL } from "../config";

const APIROUTES = {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    getAllUsers: `${BASE_URL}/user/all`,
    createWallet: `${BASE_URL}/wallet/create`,
    withdraw: `${BASE_URL}/wallet/withdraw`,
    getWalletInfo: `${BASE_URL}/wallet/get/:id`,
    getIdentityTypes: `${BASE_URL}/wallet/identityTypes`,
    verifyWalletIdentity: `${BASE_URL}/wallet/verify`,
    issueIban: `${BASE_URL}/wallet/issue/iban`,
    addFund: `${BASE_URL}/wallet/addFund`,
    createEcart: `${BASE_URL}/cart/create`,
    getAllEcarts: `${BASE_URL}/cart/***`,
    getCartsItems: `${BASE_URL}/cart/***`,
    addToCart: `${BASE_URL}/cart/add`,
    removeFromCart: `${BASE_URL}/cart/remove`,
    createStore: `${BASE_URL}/store/create`,
    getAllStore: `${BASE_URL}/store/all`,
    getWalletTransactions: `${BASE_URL}/transaction/all`,
    getWalletTransactionById: `${BASE_URL}/transaction/`,
    getUserCards: `${BASE_URL}/card/cards`,
    changeCardStatus: `${BASE_URL}/card/status/:card/:status`
  };
  

export default APIROUTES;