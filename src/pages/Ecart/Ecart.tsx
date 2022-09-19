import React, { useState, useEffect, useContext } from "react";
import {
  FaCartPlus,
  FaLongArrowAltLeft,
  FaShareAlt,
  FaShoppingCart,
  FaTrashAlt,
} from "react-icons/fa";
import { HiArrowSmLeft } from "react-icons/hi";
import { QrReader } from "react-qr-reader";
import { Link, Navigate } from "react-router-dom";
import { Layout } from "../../components";
import Modal from "../../components/UI-COMP/modal";
import milkImg from "../../assets/images/products/milk.png";
import { formatCurrency } from "../../utils/creditCard";
import { QRCode } from "react-qrcode";
import Keyboard from "../../components/UI-COMP/keyboard";
import Dialog from "../../components/Dialog/Dialog";
import Notification from "../../utils/toast";
import {
  LoaderScreen,
  LoaderScreenComp,
  Spinner,
} from "../../components/UI-COMP/loader";
import { sleep } from "../../utils";
import DataContext from "../../context/DataContext";
import APIROUTES from "../../apiRoutes";
import Fetch from "../../utils/fetch";
import { ErrorScreen } from "../../components/UI-COMP/error";
import { IoCartSharp } from "react-icons/io5";
import { data } from "autoprefixer";

const qrcodeconstraints = {
  facingMode: "",
};

const notif = new Notification(10000);

function Ecart() {
  const {
    Data,
    Loader,
    pin,
    clearPin,
    walletInfo,
    Error,
    setData,
    setLoader,
    setError,
  } = useContext<any>(DataContext);
  const [steps, setSteps] = useState(1);
  const [activeAlertBox, setActiveAlertBox] = useState(false);
  const [activeKeyboard, setActiveKeyboard] = useState(false);
  const [productInfo, setProducInfo] = useState<any>({});
  const [ecartInfo, setEcartInfo] = useState({});

  const toggleActiveAlertBox = () => setActiveAlertBox(!activeAlertBox);
  const toggleActiveKeyboard = () => {
    setActiveKeyboard(!activeKeyboard);
    if (steps === 2) toggleSteps(1);
  };
  const [paymentData, setPaymentData] = useState({});
  const toggleSteps = (step: number) => setSteps(step);
  const [activeAlertMsg, setActiveAlertMsg] = useState("");
  const [paymentTrackingId, setPaymentTrackingId] = useState("");

  async function handleEcartPayment() {
    const payload = {
      ecartId: Data.ecartItems[0].ecart_id,
      pin: pin.originalPin,
    };
    try {
      setLoader((prev: any) => ({ ...prev, payForCart: true }));
      const url = APIROUTES.payForCart;

      const { res, data } = await Fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setLoader((prev: any) => ({ ...prev, payForCart: false }));

      if (!data.success) {
        notif.error(data.message);
        clearPin();
        return;
      }

      notif.success(data.message);
      clearPin();
      setPaymentData(data.data);
      toggleActiveAlertBox();
    } catch (e: any) {
      setLoader((prev: any) => ({ ...prev, payForCart: false }));
      notif.error(`An Error Occured:  ${e.message}`);
    }
    return console.log(payload);
  }

  if (Loader.getStoreItems) {
    return <LoaderScreenComp full={true} />;
  }

  //   if(Error.getStoreItems !== null){
  //     return <ErrorScreen full={true} text={Error.getStoreItems} />
  //   }

  //   if(!Loader.getStoreItems && Object.entries(productInfo).length === 0){
  //     return <ErrorScreen full={true} text={"Oops!! looks like this item no longer exist or was not found."} size="md" />
  //   }

  return (
    <Layout>
      <div
        className={`w-full md:w-[500px] h-screen fixed top-0 bg-dark-100 z-[20] `}
      >
        {steps === 1 ? (
          <CheckoutCont
            toggleStep={toggleSteps}
            toggleKeyboard={toggleActiveKeyboard}
            toggleAtiveAlertBox={toggleActiveAlertBox}
            setActiveAlertMsg={setActiveAlertMsg}
            setEcartInfo={setEcartInfo}
            setPaymentTrackingId={setPaymentTrackingId}
          />
        ) : steps === 2 ? (
          <Keyboard
            active={activeKeyboard}
            title="Checkout Payment"
            handler={handleEcartPayment}
            toggleKeyboard={toggleActiveKeyboard}
          />
        ) : (
          ""
        )}
      </div>
      {activeAlertBox && (
        <AlertContainer
          active={activeAlertBox}
          toggleKeyboard={toggleActiveKeyboard}
          toggleStep={toggleSteps}
          toggleActive={toggleActiveAlertBox}
          paymentData={paymentData}
          message={activeAlertMsg}
          paymentTrackingId={paymentTrackingId}
        />
      )}

      {Loader.payForCart && (
        <LoaderScreen full={true} text="Making payment.." />
      )}
    </Layout>
  );
}

export default Ecart;

function CheckoutCont({
  toggleStep,
  toggleAtiveAlertBox,
  setActiveAlertMsg,
  toggleKeyboard,
  setPaymentTrackingId,
}: any) {
  const {
    Data,
    Loader,
    user,
    pin,
    walletInfo,
    getOrgStoreInfo,
    Error,
    setData,
    setLoader,
    setError,
  } = useContext<any>(DataContext);
  const [cartId, setCartId] = useState("");
  const [totalPayment, setTotalPayment] = useState({
    amount: 0,
    currency: "",
  });
  const [ecartId, setEcartId] = useState("");
  const [tempCheckoutInfo, setTempCheckoutInfo] = useState([]);
  const [selectedEcart, setSelectedEcart] = useState<any>({});
  const [activesharecart, setActiveShareCart] = useState(false);
  const [activeCartType, setActiveCartType] = useState("share");
  const [to, setTo] = useState("");
  const [iskeyboardactive, setIsKeyboardActive] = useState(false);

  useEffect(() => {
    fetchEcart();
  }, []);

  useEffect(() => {
    if (activesharecart) fetchAllUsers();
  }, [activesharecart]);

  useEffect(() => {
    if (cartId === "") return;
    getEcartItems(cartId);

    const $ecart = Data.ecarts.filter((ecart: any) => ecart.id === cartId)[0];
    setSelectedEcart($ecart);
  }, [cartId]);

  const toggleShareCart = () => setActiveShareCart(!activesharecart);
  const toggleTransferKeyboard = () => setIsKeyboardActive(!iskeyboardactive);

  async function handleCheckout() {
    if (selectedEcart.paid === "true" && selectedEcart.confirmed === "false") {
      setActiveAlertMsg("Payment has been made for this ecart.");
      toggleAtiveAlertBox();
      return;
    }
    toggleStep(2);
    toggleKeyboard(true);
  }

  async function fetchEcart() {
    try {
      setLoader((prev: any) => ({ ...prev, getAllEcarts: true }));
      const url = APIROUTES.getAllEcarts;

      const { res, data } = await Fetch(url, {
        method: "GET",
      });
      setLoader((prev: any) => ({ ...prev, getAllEcarts: false }));

      if (!data.success) {
        notif.error(data.message);
        return;
      }

      setData((prev: any) => ({ ...prev, ecarts: data.data?.ecarts }));
    } catch (e: any) {
      setLoader((prev: any) => ({ ...prev, getAllEcarts: false }));
      notif.error(`An Error Occured:  ${e.message}`);
    }
  }

  async function fetchAllUsers() {
    try {
      const url = APIROUTES.getAllUsers;
      setLoader((prev: any) => ({ ...prev, users: true }));
      const { res, data } = await Fetch(url, {
        method: "GET",
      });
      setLoader((prev: any) => ({ ...prev, users: false }));

      if (!data.success) {
        return setError((prev: any) => ({ ...prev, users: data.message }));
      }

      const { id } = user;
      const usersData = data.data.filter((user: any) => user.id !== id);
      setData((prev: any) => ({ ...prev, users: usersData }));
      setError((prev: any) => ({ ...prev, users: null }));
    } catch (e: any) {
      setLoader((prev: any) => ({ ...prev, users: false }));
      setError((prev: any) => ({ ...prev, users: e.message }));
    }
  }

  async function getEcartItems(cartId: string) {
    try {
      setLoader((prev: any) => ({ ...prev, getAllEcartItems: true }));
      const url = APIROUTES.getCartsItems.replace(":cartId", cartId);

      const { res, data } = await Fetch(url, {
        method: "GET",
      });
      setLoader((prev: any) => ({ ...prev, getAllEcartItems: false }));

      if (!data.success) {
        setError((prev: any) => ({ ...prev, getAllEcartItems: data.message }));
        return;
      }

      setData((prev: any) => ({ ...prev, ecartItems: data.data.items }));
      console.log(data);
      setPaymentTrackingId(data.data.id);
      setError((prev: any) => ({ ...prev, getAllEcartItems: null }));
      calculateTotalPayment(data.data.items);
    } catch (e: any) {
      setLoader((prev: any) => ({ ...prev, getAllEcartItems: false }));
      setError((prev: any) => ({
        ...prev,
        getAllEcartItems: `An Error Occured:  ${e.message}`,
      }));
    }
  }

  function calculateTotalPayment(ecartItems: any) {
    const totalAmount = ecartItems.reduce((total: number, arr: any) => {
      total += arr.item_price * arr.item_quantity;
      return total;
    }, 0);
    const currency = ecartItems.map((cart: any) => cart.item_currency)[0];
    setTotalPayment({ amount: totalAmount, currency });
  }

  async function handleEcartSharingandReceiving() {
    if (activeCartType === "share") {
      if (pin.originalPin === "") return;
      if (ecartId === "") return notif.error("select ecart");
      if (to === "") return notif.error("select a user to transfer to.");
      // handle share
      try {
        const url = APIROUTES.transferCart;
        setLoader((prev: any) => ({ ...prev, transfer: true }));
        const { res, data } = await Fetch(url, {
          method: "POST",
          body: JSON.stringify({
            pin: pin.originalPin,
            to,
            cartId: ecartId,
          }),
        });
        setLoader((prev: any) => ({ ...prev, transfer: false }));

        if (!data.success) {
          return notif.error(data.message);
        }

        notif.success(data.message);
        window.location.reload();
      } catch (e: any) {
        setLoader((prev: any) => ({ ...prev, users: false }));
        notif.error(`An error occured: ${e.message}`);
      }
    }
    if (activeCartType === "receive") {
      // handle importing
      if (ecartId === "") return notif.error("enter ecart id");
      // if (to === "") return notif.error("select a user to transfer to.");
      // handle share
      try {
        const url = APIROUTES.importECart.replace(":cartId", ecartId);
        setLoader((prev: any) => ({ ...prev, transfer: true }));
        const { res, data } = await Fetch(url, {
          method: "GET",
        });
        setLoader((prev: any) => ({ ...prev, transfer: false }));

        if (!data.success) {
          return notif.error(data.message);
        }

        notif.success(data.message);
        window.location.reload();
      } catch (e: any) {
        setLoader((prev: any) => ({ ...prev, users: false }));
        notif.error(`An error occured: ${e.message}`);
      }
    }
  }

  async function deleteEcartItem(e: any) {
    // return console.log(e.target.dataset)
    const dataset = e.target.dataset;
    if (Object.entries(dataset).length === 0) return;
    const { id, ecart } = dataset;
    try {
      const url = APIROUTES.removeFromCart;
      setLoader((prev: any) => ({ ...prev, deleteEcartItem: true }));
      const { res, data } = await Fetch(url, {
        method: "POST",
        body: JSON.stringify({
          itemId: id,
          cartId: ecart,
        }),
      });
      setLoader((prev: any) => ({ ...prev, deleteEcartItem: false }));

      if (!data.success) {
        return notif.error(data.message);
      }

      getEcartItems(ecart);
    } catch (e: any) {
      setLoader((prev: any) => ({ ...prev, deleteEcartItem: false }));
      notif.error(`An error occured: ${e.message}`);
    }
  }

  if (Loader.getAllEcarts) {
    return <LoaderScreenComp full={true} />;
  }

  if (Error.getAllEcarts !== null) {
    return <ErrorScreen full={true} text={Error.getAllEcarts} />;
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="relative w-full flex items-center justify-start px-4 py-3 ">
        <Link to="/dashboard">
          <button
            onClick={() => toggleStep(1)}
            className="px-3 py-2 rounded-md bg-dark-300"
          >
            <FaLongArrowAltLeft className="text-[20px] text-white-100 " />
          </button>
        </Link>
        <p className="text-white-100 text-[18px] ml-5 font-extrabold ">
          Checkout
          {Object.entries(selectedEcart).length > 0 && (
            <span className="absolute left-[15px] bottom-[-30px] text-[12px] px-3 py-1 rounded-md bg-blue-300 text-white-100">
              {/* { selectedEcart?.paid === "false" ? "unpaid" : selectedEcart.paid === "true" && selectedEcart.paid === "false" ? "uncomfirmed" : "" } */}
              {selectedEcart?.paid === "false"
                ? "unpaid"
                : selectedEcart.paid === "true"
                ? "uncomfirmed"
                : selectedEcart.confirmed === "true"
                ? "Paid"
                : ""}
            </span>
          )}
        </p>
        <select
          name=""
          id=""
          className="absolute top-4 right-5 px-4 py-3 text-[12px] rounded-[30px] bg-dark-200 text-white-100"
          onChange={(e: any) => {
            const value = e.target.value;
            if (value === "") return;
            setCartId(value);
          }}
        >
          <option value="">Select E-carts.</option>
          {Data.ecarts.length > 0 ? (
            Data.ecarts
              .filter((ecart: any) => ecart.confirmed === "false")
              .map((data: any) => (
                <option value={data.id} key={data.id}>
                  {data.name}
                </option>
              ))
          ) : (
            <option value="">No ecarts available.</option>
          )}
        </select>
        <button
          onClick={toggleShareCart}
          className="absolute top-6 right-[200px] px-3 py-2 rounded-md text-[12px] font-extrabold bg-blue-300"
        >
          <FaShareAlt className="text-[15px] text-white-100 " />
        </button>
      </div>
      <br />
      <br />
      <div className="w-full h-[450px] noScrollBar flex flex-col items-start justify-start px-3 gap-5 overflow-y-scroll ">
        {Loader.getAllEcartItems ? (
          <LoaderScreenComp full={true} />
        ) : Error.getAllEcartItems !== null ? (
          <ErrorScreen full={true} text={Error.getAllEcartItems} />
        ) : cartId === "" && Data.ecartItems.length === 0 ? (
          <ErrorScreen full={true} text="Select e-cart" size="md" />
        ) : cartId !== "" && Data.ecartItems.length > 0 ? (
          Data.ecartItems.map((data: any, i: number) => (
            <CartCard
              key={i}
              getEcartItems={getEcartItems}
              setTempCheckoutInfo={setTempCheckoutInfo}
              deleteEcartItem={deleteEcartItem}
              calculateTotalPayment={calculateTotalPayment}
              data={data}
            />
          ))
        ) : (
          <ErrorScreen full={true} text="No cart items" size="md" />
        )}
        <div className="w-full h-[120px] "></div>
      </div>
      {cartId !== "" && Data.ecartItems.length > 0 && (
        <div className="w-full h-[100px] flex items-end py-2 justify-between absolute bottom-0 left-0 px-3 ">
          <div className="w-auto flex flex-col items-start justify-start">
            <p className="text-white-300 text-[12px] ">Total Price</p>
            <p className="text-white-100 text-[20px] font-extrabold ">
              {totalPayment.currency === "" && totalPayment.amount === 0
                ? ""
                : formatCurrency(totalPayment.currency, totalPayment.amount)}
            </p>
          </div>
          <button
            className="w-auto px-7 py-3 rounded-[30px] bg-blue-300 font-extrabold text-white-100 transition-all hover:bg-dark-200 scale-[.95] mr-5 "
            onClick={handleCheckout}
          >
            Checkout & Pay Now
          </button>
        </div>
      )}

      {/* share ecart */}
      {activesharecart && (
        <Modal
          isActive={activesharecart}
          clickHandler={() => {
            toggleShareCart();
            setEcartId("");
          }}
        >
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-[350px] h-auto p-4 rounded-md bg-dark-200 ">
              <div className="w-full flex flex-col items-center justify-center">
                <p className="text-white-100 font-extrabold">Share E-cart.</p>
              </div>
              <br />
              {activeCartType === "share" ? (
                <>
                  <select
                    name=""
                    id=""
                    className="w-full px-4 py-3 text-[12px] rounded-[30px] bg-dark-100 text-white-100"
                    onChange={(e: any) => {
                      const value = e.target.value;
                      if (value === "") return;
                      setTo(value);
                    }}
                  >
                    <option value="">Select Users.</option>
                    {Loader.users ? (
                      <option value="">Loading...</option>
                    ) : Error.users !== null ? (
                      <option value="">{Error.users}</option>
                    ) : Data.users.length > 0 ? (
                      Data.users.map((data: any) => (
                        <option value={data.id} key={data.id}>
                          @{data.username}
                        </option>
                      ))
                    ) : (
                      <option value="">No users available.</option>
                    )}
                  </select>
                  <br />
                  <br />
                  <select
                    name=""
                    id=""
                    className="w-full px-4 py-3 text-[12px] rounded-[30px] bg-dark-100 text-white-100"
                    onChange={(e: any) => {
                      const value = e.target.value;
                      if (value === "") return;
                      setEcartId(value);
                    }}
                  >
                    <option value="">Select E-carts.</option>
                    {Data.ecarts.length > 0 ? (
                      Data.ecarts
                        .filter((ecart: any) => ecart.confirmed === "false")
                        .map((data: any) => (
                          <option value={data.id} key={data.id}>
                            {data.name}
                          </option>
                        ))
                    ) : (
                      <option value="">No ecarts available.</option>
                    )}
                  </select>
                  <br />
                </>
              ) : (
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-dark-100 text-white-100 font-extrabold rounded-[30px] text-[13px] "
                  value={activeCartType === "receive" ? ecartId : ""}
                  onChange={(e: any) => {
                    if (activeCartType === "receive")
                      setEcartId(e.target.value);
                  }}
                  placeholder="ecart id"
                />
              )}

              <button
                className="px-4 py-3 rounded-[30px] mt-5 w-full flex flex-col items-center justify-center font-vextrabold bg-blue-300"
                onClick={()=>{
                  if(activeCartType === "share"){
                    return toggleTransferKeyboard();
                  }
                  handleEcartSharingandReceiving()
                }}
              >
                {activeCartType === "share" ? "Share Ecart" : "Import Ecart"}
              </button>
              <br />
              {activeCartType === "share" ? (
                <p className="text-white-200 font-extrabold text-[12px] w-full ">
                  import{" "}
                  <span
                    className="text-blue-200 cursor-pointer "
                    onClick={() => setActiveCartType("receive")}
                  >
                    E-Carts
                  </span>{" "}
                  .
                </p>
              ) : (
                <p className="text-white-200 font-extrabold text-[12px] w-full ">
                  share{" "}
                  <span
                    className="text-blue-200 cursor-pointer "
                    onClick={() => setActiveCartType("share")}
                  >
                    E-Carts
                  </span>{" "}
                  .
                </p>
              )}
            </div>
            {iskeyboardactive && (
              <Keyboard
                title="cart transfer"
                active={iskeyboardactive}
                handler={handleEcartSharingandReceiving}
                toggleKeyboard={toggleTransferKeyboard}
              />
            )}
            {Loader.transfer && <LoaderScreen />}
          </div>
        </Modal>
      )}
    </div>
  );
}

function AlertContainer({
  active,
  toggleActive,
  toggleKeyboard,
  iskeyboardactive,
  toggleStep,
  paymentData,
  message,
  paymentTrackingId,
}: any) {
  const {
    Data,
    Loader,
    refundCart,
    pin,
    clearPin,
    walletInfo,
    Error,
    setData,
    setLoader,
    setError,
  } = useContext<any>(DataContext);
  const [ecartInfo, setEcartInfo] = useState<any>({});

  async function handleRefund() {
    refundCart(paymentTrackingId);
  }

  function handleCloseModal() {
    toggleActive();
    toggleStep(1);
    if (iskeyboardactive) toggleKeyboard();
  }

  // console.log(ecartInfo)

  useEffect(() => {
    console.log({ paymentTrackingId });
    getEcartItems(paymentTrackingId);
  }, [paymentTrackingId]);

  // this would get called once payment succeed
  async function getEcartItems(cartId: string) {
    try {
      setLoader((prev: any) => ({ ...prev, getAllEcartItems: true }));
      const url = APIROUTES.getCartsItems.replace(":cartId", cartId);

      const { res, data } = await Fetch(url, {
        method: "GET",
      });
      setLoader((prev: any) => ({ ...prev, getAllEcartItems: false }));

      if (!data.success) {
        setError((prev: any) => ({ ...prev, getAllEcartItems: data.message }));
        return;
      }

      setEcartInfo(data.data);
      console.log(data.data);
      setError((prev: any) => ({ ...prev, getAllEcartItems: null }));
    } catch (e: any) {
      setLoader((prev: any) => ({ ...prev, getAllEcartItems: false }));
      setError((prev: any) => ({
        ...prev,
        getAllEcartItems: `An Error Occured:  ${e.message}`,
      }));
    }
  }

  if (Loader.getAllEcartItems) {
    return <LoaderScreenComp full={true} />;
  }

  if (Error.getAllEcartItems !== null) {
    return <ErrorScreen full={true} text={Error.getAllEcartItems} />;
  }

  const isConfirmed =
    ecartInfo.paid === "true" && ecartInfo.confirmed === "false"
      ? "false"
      : "true";

  return (
    <Modal isActive={active} clickHandler={handleCloseModal}>
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="w-[450px] scale-[.75] md:scale-[.90] h-auto bg-dark-200 rounded-md ">
          <div className="w-full flex flex-col text-center items-center justify-center">
            <div className="w-full px-3 py-3">
              <p className="text-green-200 text-[20px] font-extrabold">
                Payment Successfull
              </p>
              {message === "" ? (
                <p className="text-white-300 text-[15px]">
                  Your payment for{" "}
                  <span className="text-white-100 font-extrabold">
                    {formatCurrency(paymentData.currency, paymentData.amount)}
                  </span>{" "}
                  was successfull.
                </p>
              ) : (
                <p className="text-white-300 text-[15px]">{message}</p>
              )}
            </div>
            <div className="w-full flex flex-col items-center justify-center px-4">
              <p className="text-white-300 text-[15px]">
                ID :{" "}
                <span className="text-white-100 font-extrabold text-[15px] ">
                  {isConfirmed === "false" ? ecartInfo.id : paymentData.ecartId}
                </span>
              </p>
              <br />
              <div className="w-full flex flex-col items-center justify-center h-auto bg-white-100">
                <QRCode
                  scale={10}
                  width={"100%"}
                  height={"100%"}
                  value={
                    isConfirmed === "false" ? ecartInfo.id : paymentData.ecartId
                  }
                />
              </div>
              <div className="w-full flex flex-col items-center justify-center px-5 py-5 ">
                <button
                  className={`w-full px-5 py-3 rounded-[30px] bg-blue-300 font-extrabold text-white-100 transition-all hover:bg-dark-100 scale-[.95] mr-5 ${
                    isConfirmed === "true" ? " opacity-[.5] " : "opacity-1"
                  } `}
                  disabled={isConfirmed === "true" ? true : false}
                  onClick={handleRefund}
                >
                  Refund
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {Loader.refundCart && <LoaderScreen full={true} />}
    </Modal>
  );
}

function CartCard({
  data,
  getEcartItems,
  deleteEcartItem,
  setTempCheckoutInfo,
  calculateTotalPayment,
  key,
}: any) {
  const { Data, setData, setLoader, setError } = useContext<any>(DataContext);

  const productStyle = {
    backgroundImage: `url("${data.item_image}")`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  let [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(data.item_quantity);
  }, []);

  const itemData = data;

  async function updateItemQuantity(item_quantity: any) {
    // return console.log({item_quantity})
    try {
      setLoader((prev: any) => ({ ...prev, updatCartItems: true }));
      const url = APIROUTES.addToCart;
      const { res, data } = await Fetch(url, {
        method: "POST",
        body: JSON.stringify({
          cartId: itemData.ecart_id,
          itemId: itemData.item_id,
          quantity: item_quantity,
        }),
      });
      setLoader((prev: any) => ({ ...prev, updatCartItems: false }));

      if (!data.success) {
        notif.error(data.message);
        return;
      }

      getEcartItems(itemData.ecart_id);
    } catch (e: any) {
      setLoader((prev: any) => ({ ...prev, updatCartItems: false }));
      notif.error(`An Error Occured:  ${e.message}`);
    }
  }

  const incQty = () => {
    let newQty = quantity;
    newQty += 1;
    setQuantity(newQty);
    updateItemQuantity(newQty);
  };
  const decQty = () => {
    let newQty = quantity;
    newQty <= 1 ? (newQty = 1) : (newQty -= 1);
    setQuantity(newQty);
    updateItemQuantity(newQty);
  };

  return (
    <div
      className="w-full h-[90px] bg-dark-200 rounded-md p-4 flex items-center justify-between gap-5 "
      key={key}
    >
      <div
        className="w-[50px] max-w-[50px] rounded-md relative  h-[50px] bg-white-100 "
        style={{ ...productStyle }}
      ></div>
      <div className="w-auto flex flex-col items-start justify-start">
        <p className="text-white-100 text-[15px] font-extrabold capitalize ">
          {data.item_name}
        </p>
        <p className="text-white-200 text-[12px] font-extrabold">
          {formatCurrency(data.item_currency, data.item_price).replace(
            "CA$",
            "CAD "
          )}
        </p>
      </div>
      <div
        id="left"
        className="w-auto flex flex-row items-center justify-start p-1 rounded-md"
      >
        <button
          className="btn flex flex-col items-center justify-center bg-dark-200 px-4 py-2 rounded-md  scale-[.83] hover:scale-[.90] transition-all cursor-pointer text-[15px] font-extrabold text-white-200 "
          onClick={() => {
            decQty();
          }}
        >
          -
        </button>
        <button className="btn flex flex-col items-center justify-center px-4 py-2 rounded-md  scale-[.83] hover:scale-[.90] transition-all cursor-pointer text-[15px] font-extrabold text-white-200 ">
          {data.item_quantity}
        </button>
        <button
          className="btn flex flex-col items-center justify-center bg-dark-200 px-4 py-2 rounded-md  scale-[.83] hover:scale-[.90] transition-all cursor-pointer text-[15px] font-extrabold text-white-200 "
          onClick={() => {
            incQty();
          }}
        >
          +
        </button>
      </div>
      <button
        onClick={deleteEcartItem}
        data-id={data.item_id}
        data-ecart={data.ecart_id}
        className="h-full px-2 py-2 rounded-md bg-red-800 text-white-100 "
      >
        <FaTrashAlt className="text-[12px]" />
      </button>
    </div>
  );
}
