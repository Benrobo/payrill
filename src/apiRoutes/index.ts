import { BASE_URL } from "../config";

const APIROUTES = {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    getAllUsers: `${BASE_URL}/user/all`,
    createWallet: `${BASE_URL}/wallet/create`,
    withdraw: `${BASE_URL}/wallet/withdraw`,
    getWalletInfo: `${BASE_URL}/wallet/get/:id`,
    addFund: `${BASE_URL}/wallet/addFund`,
    createEcart: `${BASE_URL}/cart/create`,
    getAllEcarts: `${BASE_URL}/cart/***`,
    getCartsItems: `${BASE_URL}/cart/***`,
    addToCart: `${BASE_URL}/cart/add`,
    removeFromCart: `${BASE_URL}/cart/remove`,
    createStore: `${BASE_URL}/store/create`,
    getAllStore: `${BASE_URL}/store/all`,
    getStoreBySubDomain1: `${BASE_URL}/store/byDomain/:subdomain`,
    getStoreBySubDomain2: `${BASE_URL}/store/:subdomain`,
    addStoreItems: `${BASE_URL}/item/add`,
    getStoreItems: `${BASE_URL}/item/get/all`,
    getStoreItemById: `${BASE_URL}/item/get/:item_id`,
    updateItem: `${BASE_URL}/item/update/:item_id`,
    getWalletTransactions: `${BASE_URL}/transaction/all`,
    getWalletTransactionById: `${BASE_URL}/transaction/`,
    getUserCards: `${BASE_URL}/card/cards`,
    changeCardStatus: `${BASE_URL}/card/status/:card/:status`
  };
  

export default APIROUTES;