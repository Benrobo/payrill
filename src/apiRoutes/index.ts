import { BASE_URL } from "../config";

const APIROUTES = {
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    getAllUsers: `${BASE_URL}/user/all`,
    transferFund: `${BASE_URL}/user/transfer/:receiverId`,
    createWallet: `${BASE_URL}/wallet/create`,
    withdraw: `${BASE_URL}/wallet/withdraw`,
    getWalletInfo: `${BASE_URL}/wallet/get/:id`,
    addFund: `${BASE_URL}/wallet/addFund`,
    createEcart: `${BASE_URL}/cart/create`,
    getAllEcarts: `${BASE_URL}/cart/get/all`,
    getCartsItems: `${BASE_URL}/cart/get/:cartId`,
    getCartsItemsForOrg: `${BASE_URL}/cart/get/org/:cartId`,
    addToCart: `${BASE_URL}/cart/add`,
    payForCart: `${BASE_URL}/cart/pay`,
    removeFromCart: `${BASE_URL}/cart/remove`,
    createStore: `${BASE_URL}/store/create`,
    getAllStore: `${BASE_URL}/store/all`,
    getStoreBySubDomain1: `${BASE_URL}/store/byDomain/:subdomain`,
    getStoreBySubDomain2: `${BASE_URL}/store/:subdomain`,
    addStoreItems: `${BASE_URL}/item/add`,
    getStoreItems: `${BASE_URL}/item/get/all`,
    getStoreItemById: `${BASE_URL}/item/get/:itemId`,
    updateItem: `${BASE_URL}/item/update/:item_id`,
    getWalletTransactions: `${BASE_URL}/transaction/all`,
    getWalletTransactionById: `${BASE_URL}/transaction/`,
    getUserCards: `${BASE_URL}/card/cards`,
    changeCardStatus: `${BASE_URL}/card/status/:card/:status`
  };
  

export default APIROUTES;