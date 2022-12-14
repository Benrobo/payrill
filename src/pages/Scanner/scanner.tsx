import React, { useState, useEffect, useContext } from "react";
import { FaCartPlus, FaLongArrowAltLeft, FaQrcode, FaTrashAlt } from "react-icons/fa";
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
import { LoaderScreen, LoaderScreenComp, Spinner } from "../../components/UI-COMP/loader";
import { sleep } from "../../utils";
import DataContext from "../../context/DataContext";
import APIROUTES from "../../apiRoutes";
import Fetch from "../../utils/fetch";
import { ErrorScreen } from "../../components/UI-COMP/error";
import { IoCartSharp } from "react-icons/io5";
import { IoIosQrScanner, IoMdQrScanner } from "react-icons/io";


const qrcodeconstraints = {
  facingMode: "environment",
};

const notif = new Notification(10000)


function Scanner() {
  const {Data, Loader, pin, clearPin, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
  const [qrcodeId, setQrcodeId] = useState("");
  const [steps, setSteps] = useState(1);
  const [activeAlertBox, setActiveAlertBox] = useState(false);
  const [activeKeyboard, setActiveKeyboard] = useState(false);
  const [productInfo, setProducInfo] = useState<any>({})
  const [ecartInfo, setEcartInfo] = useState({})

  const toggleActiveAlertBox = () => setActiveAlertBox(!activeAlertBox);
  const toggleActiveKeyboard = () => {
    setActiveKeyboard(!activeKeyboard)
    if(steps === 4) toggleSteps(2)
  };
  const [paymentData, setPaymentData] = useState({})
  const toggleSteps = (step: number) => setSteps(step);
  const [activeAlertMsg, setActiveAlertMsg] = useState("");
  const [paymentTrackingId, setPaymentTrackingId] = useState("");

  function handleQrcodeResult(result: any, error: any) {
    if (!!result) {
      setQrcodeId(result?.text);
    }
    if (!!error) {
      // console.info(error);
    }
  }

  async function handleEcartPayment() {
    const payload = {
      ecartId : Data.ecartItems[0].ecart_id,
      pin: pin.originalPin
    }
    try {

      setLoader((prev: any)=>({...prev, payForCart: true}))
      const url = APIROUTES.payForCart

      const {res, data} = await Fetch(url, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setLoader((prev: any)=>({...prev, payForCart: false}))

      if(!data.success){
        notif.error(data.message);
        clearPin()
        return
      }

      notif.success(data.message);
      clearPin()
      setPaymentData(data.data)
      setPaymentTrackingId(data.data.ecartId)
      toggleActiveAlertBox();
    } catch (e: any) {
      setLoader((prev: any)=>({...prev, payForCart: false}))
      notif.error(`An Error Occured:  ${e.message}`)
    }
    return console.log(payload)
  }

  useEffect(()=>{
    if(qrcodeId === "") return;
    // console.log(qrcodeId, steps)
    getItemById(qrcodeId)
    // getItemById("d26d5203-5448-4d83-bc82-0d2ccb4e516f")
  },[qrcodeId])

  useEffect(()=>{
    let videoId = document.querySelector("#qrcode-video") as any;
    videoId.width = "100%";
    videoId.height = "100%"
  },[])

  async function getItemById(itemId: string){
    try {

      setLoader((prev: any)=>({...prev, getStoreItems: true}))
      const url = APIROUTES.getStoreItemById.replace(":itemId", itemId);

      const {res, data} = await Fetch(url, {
        method: "GET",
      });
      setLoader((prev: any)=>({...prev, getStoreItems: false}))

      if(!data.success){
        setError((prev: any)=>({...prev, getStoreItems: data.message}))
        return
      }

      setProducInfo(data.data?.item)
      setError((prev: any)=>({...prev, getStoreItems: null}))
      toggleSteps(2)
    } catch (e: any) {
      setLoader((prev: any)=>({...prev, getStoreItems: false}))
      setError((prev: any)=>({...prev, getStoreItems: `An Error Occured:  ${e.message}`}))
    }
  }

  if(Loader.getStoreItems){
    return <LoaderScreenComp full={true}/>
  }
  
  if(Error.getStoreItems !== null){
    return <ErrorScreen full={true} text={Error.getStoreItems} />
  }

  if(qrcodeId !== "" && !Loader.getStoreItems && Object.entries(productInfo).length === 0){
    return <ErrorScreen full={true} text={"Oops!! looks like this item no longer exist or was not found."} size="md" />
  }


  return (
    <Layout>
      <div
        className={`w-full md:w-[500px] h-screen overflow-y-scroll noScrollBar fixed top-0 bg-dark-100 z-[20] `}
      >
        {steps === 1 && qrcodeId === "" ? (
          <div className="w-full bg-dark-100 h-screen relative flex flex-col items-center justify-center">
            <QrReader
              onResult={handleQrcodeResult}
              constraints={qrcodeconstraints}
              className="w-[100%] h-[100%] absolute top-0 left-0  "
              videoId="qrcode-video"
              
            />
            <div className="w-full flex flex-col items-center justify-center absolute top-[20%]">
              {/* <IoIosQrScanner className=" p-1 text-[290px] scale-[1.5] text-dark-500 " /> */}
              <div className="w-[300px] h-[280px] relative bg-white-800 ">
                <div className=" w-[70px] h-[70px] rounded-md border-[5px] border-solid border-l-blue-200 border-t-blue-200 border-r-transparent border-b-transparent "></div>
                <div className=" w-[70px] h-[70px] absolute top-0 right-0 rounded-md border-[5px] border-solid border-r-blue-200 border-t-blue-200 border-b-transparent border-l-transparent "></div>
                <div className=" w-[70px] h-[70px] absolute bottom-0 left-0 rounded-md border-[5px] border-solid border-l-blue-200 border-b-blue-200 border-r-transparent border-t-transparent "></div>
                <div className=" w-[70px] h-[70px] absolute bottom-0 right-0 rounded-md border-[5px] border-solid border-r-blue-200 border-b-blue-200 border-t-transparent border-l-transparent "></div>
              </div>
            </div>
            <div className="w-full absolute bottom-0 py-2 flex flex-col items-center justify-center">
              <Link to="/dashboard">
                <button className=" px-6 py-3 bg-dark-200  font-extrabold text-white-100 rounded-[30px]">
                  Exit Scanner
                </button>
              </Link>
            </div>
          </div>
        ) : steps === 2 ? (
          <ProductInfo data={productInfo} toggleStep={toggleSteps} />
        ) : steps === 3 ?
          <Keyboard
            active={activeKeyboard}
            title="Checkout Payment"
            handler={handleEcartPayment}
            toggleKeyboard={toggleActiveKeyboard}
          />
        :
        ""
        }
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

      { Loader.payForCart && <LoaderScreen full={true} text="Making payment.." /> }
    </Layout>
  );
}

export default Scanner;

function ProductInfo({ toggleStep, data }: any) {
  const {Data, Loader, walletInfo, Error} = useContext<any>(DataContext)
  const [quantity, setQuantity] = useState(1);
  const [selectcart, setSelectCart] = useState(false)
  const [ecartId, setEcartId] = useState("")
  const [addtocart, setAddToCart] = useState(false)

  const incQty = () => setQuantity((prev) => (prev += 1));
  const decQty = () =>
    setQuantity((prev) => (prev <= 1 ? (prev = 1) : (prev -= 1)));

  const toggleEcart = ()=> setSelectCart(!selectcart)
  const itemData = data;

  async function handleAddToCart() {
    if(ecartId === "") return notif.error("select an ecart to continue..")
    try {
      setAddToCart(true)

      const url = APIROUTES.addToCart
      const {res, data} = await Fetch(url, {
        method: "POST",
        body: JSON.stringify({
          cartId: ecartId,
          itemId: itemData.id,
          quantity: quantity
        })
      });
      setAddToCart(false)

      if(!data.success){
        notif.error(data.message)
        return
      }
      // if item has been added to cart...
      
      notif.success(data.message)
      window.location.href = "/ecart"
    } catch (e: any) {
      setAddToCart(false)
      notif.error(`An Error Occured:  ${e.message}`)
    }
  }

  if(Loader.getStoreItems){
    return <LoaderScreenComp full={true}/>
  }
  
  if(Error.getStoreItems !== null){
    return <ErrorScreen full={true} text={Error.getStoreItems} />
  }
  
  const productStyle = {
    backgroundImage: `url("${data.item_image}")`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="w-full h-screen bg-dark-100 flex flex-col items-center justify-start">
      <div
        className="w-full relative  h-[350px] bg-white-100 "
        style={{ ...productStyle }}
      >
        <div className="w-full absolute top-0 flex items-center justify-start px-4 py-3 ">
          <Link to="/dashboard">
            <button
              onClick={() => {
                // window.location.reload()
                toggleStep(1) 
              }}
              className="px-3 py-2 rounded-md bg-dark-300"
            >
              <FaLongArrowAltLeft className="text-[20px] text-white-100 " />
            </button>
          </Link>
          <button
            onClick={toggleEcart}
            className="p-3 scale-[.90] rounded-[50%] border-[2px] border-solid border-blue-300 bg-dark-700 absolute right-5 top-1 "
          >
            <FaCartPlus className="text-[15px] text-white-100 " />
          </button>
          <Link to="/ecart">
            <button
              className="px-4 py-3 scale-[.80] flex items-center justify-start gap-2 rounded-[30px] bg-blue-300 absolute right-[50px] top-1 "
            >
              View Cart <IoCartSharp className="text-[25px] text-white-100 " />
            </button>
          </Link>
        </div>
      </div>
      <div className="w-full flex items-center justify-between px-3 py-3">
        <div className="right w-auto flex flex-col items-start justify-start">
          <p className="text-white-200 font-extrabold capitalize ">{data.item_name}</p>
        </div>
        <div
          id="left"
          className="w-auto flex flex-row items-center justify-start bg-dark-300 p-1 rounded-md"
        >
          <button
            className="btn flex flex-col items-center justify-center bg-dark-200 px-4 py-2 rounded-md  scale-[.83] hover:scale-[.90] transition-all cursor-pointer text-[15px] font-extrabold text-white-200 "
            onClick={decQty}
          >
            -
          </button>
          <button className="btn flex flex-col items-center justify-center px-4 py-2 rounded-md  scale-[.83] hover:scale-[.90] transition-all cursor-pointer text-[15px] font-extrabold text-white-200 ">
            {quantity}
          </button>
          <button
            className="btn flex flex-col items-center justify-center bg-dark-200 px-4 py-2 rounded-md  scale-[.83] hover:scale-[.90] transition-all cursor-pointer text-[15px] font-extrabold text-white-200 "
            onClick={incQty}
          >
            +
          </button>
        </div>
      </div>
      <br />
      <div className="w-full flex items-start justify-start px-3 ">
        <p className="text-white-200 text-[15px] ">
          {data.item_description}
        </p>
      </div>
      <br />
      <div className="w-full h-[80px] bg-dark-200 absolute bottom-0 left-0 flex flex-row items-center justify-between shadow-xl drop-shadow-xl shadow-dark-100 px-3 ">
        <div
          id="left"
          className="w-auto flex flex-col items-start justify-start ml-2"
        >
          <p className="text-white-300 text-[12px] ">Price</p>
          <p className="text-white-100 font-extrabold text-[25px] ">
            {formatCurrency(data.item_currency, data.item_price)}
          </p>
        </div>
        <br />
        <button
          className="px-7 py-3 rounded-[30px] bg-blue-300 font-extrabold text-white-100 transition-all scale-[.90] hover:scale-[.95] mr-5 "
          onClick={()=>{
            if(ecartId === ""){
              toggleEcart()
            }
          }}
        >
          Add to Cart
        </button>
      </div>
      {selectcart && <SelectEcart active={selectcart} handleAddToCart={handleAddToCart} setEcartId={setEcartId} toggleActive={toggleEcart} />}
      {addtocart && <LoaderScreen text="Adding to e-cart.." /> }
    </div>
  );
}

function SelectEcart({active, toggleActive, setEcartId, handleAddToCart}: any){
  const {Data, Loader, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
  const [cartname, setCartName] = useState("")
  const [steps, setSteps] = useState(1)
  const [ecartName, setEcartName] = useState("")

  const toggleSteps = (step: number)=> setSteps(step)

  useEffect(()=>{
    fetchEcart()
  },[])

  function handleEcartId(e: any){
    const dataset = e.target.dataset;
    const value = e.target.value;
    if(value === "") {
      // if user selects an empty option, then set the previous ecart value to empty. ( FOR UI SAKE...)
      setCartName(value)
      return setEcartId(value)
    };
    const filter = Data.ecarts.filter((cart: any)=> cart.id === value)[0]
    setCartName(filter.name)
    setEcartId(value)
  }

  async function fetchEcart(){
    try {
      setLoader((prev: any)=>({...prev, getAllEcarts: true}))
      const url = APIROUTES.getAllEcarts

      const {res, data} = await Fetch(url, {
        method: "GET",
      });
      setLoader((prev: any)=>({...prev, getAllEcarts: false}))

      if(!data.success){
        notif.error(data.message)
        return
      }

      setData((prev: any)=>({...prev, ecarts: data.data?.ecarts}))
    } catch (e: any) {
      setLoader((prev: any)=>({...prev, getAllEcarts: false}))
      notif.error(`An Error Occured:  ${e.message}`)
    }
  }

  async function createEcart(){
    if(cartname === "") return notif.error("e-cart name cant be empty")
    try {

      setLoader((prev: any)=>({...prev, createEcart: true}))
      const url = APIROUTES.createEcart

      const {res, data} = await Fetch(url, {
        method: "POST",
        body: JSON.stringify({name: cartname})
      });
      setLoader((prev: any)=>({...prev, createEcart: false}))

      if(!data.success){
        notif.error(data.message)
        return
      }

      notif.success(data.message)
      await sleep(1.1)
      toggleSteps(1)
      fetchEcart()

    } catch (e: any) {
      setLoader((prev: any)=>({...prev, createEcart: false}))
      notif.error(`An Error Occured:  ${e.message}`)
    }
  }

  // closeModal
  function closeModal(){
    setCartName("");
    setEcartId("");
    toggleActive()
  }

  return (
    <Modal isActive={active} clickHandler={closeModal}>
      <Dialog height={300}>
        <div className="w-full flex flex-col items-center justify-center">
          {/* <p className="text-white-100 font-extrabold">E-cart</p> */}
          <p className="text-white-200 text-[15px] ">Select E-cart</p>
        </div>
        <br />
        <div className="w-full flex flex-col items-start justify-start px-7">
          {
            steps === 1 ?
              Loader.getAllEcarts ? 
                <LoaderScreenComp size={"md"}  />
                :
                <>
                  <p className="text-white-200 text-[15px] ">E-cart Name: <span className="text-white-100 font-extrabold">{cartname}</span> </p>
                  <br />
                  <select onChange={(e)=> {
                    handleEcartId(e)
                  }} className="w-full px-4 py-3 rounded-[30px] text-white-200 bg-dark-100">
                    <option value="">
                      {Data.ecarts.length === 0 ? "No ecarts available." : "Select e-cart"}
                    </option>
                    {
                      Data.ecarts.filter((ecart: any)=> ecart.confirmed !== "true").map((cart: any)=>(
                        <option value={cart.id} data-id={cart.id}>{cart.name}</option>
                      ))
                    }
                  </select>
                  <br />
                  <button className="w-full px-4 py-3 rounded-[30px] bg-blue-300 flex items-center justify-center text-white-100 font-extrabold" onClick={handleAddToCart}>
                    Continue
                  </button>
                  <small className="text-white-200 py-3">Dont have an e-cart? <span className="text-blue-200 font-extrabold cursor-pointer" onClick={()=> toggleSteps(2)}>create one</span> </small>
                </>
              :
              <>
                <br />
                <input type="text" placeholder="cart name" onChange={(e)=> setCartName(e.target.value)} className="w-full px-4 py-3 rounded-[30px] text-white-200 bg-dark-100" />
                <br />
                <br />
                <div className="w-full flex items-center justify-between gap-5">
                  <button className="w-full px-4 py-3 scale-[.89] hover:scale-[1] rounded-[30px] bg-dark-200 flex items-center justify-center text-white-200" disabled={Loader.createEcart} onClick={()=> {
                    toggleSteps(1)
                    setCartName("")
                  }}>
                    Back
                  </button>
                  <button className="w-full px-2 py-3 rounded-[30px] bg-blue-300 transition-all scale-[.89] hover:scale-[1] flex items-center justify-center text-white-100 font-extrabold" onClick={createEcart} disabled={Loader.createEcart}>
                    {Loader.createEcart ? <Spinner color="#fff" /> : "Create Cart" }
                  </button>
                </div>
              </>
          }
        </div>
        {/* <input type="text" className="w-full px-4 py-3 bg-dark-100" /> */}
      </Dialog>
    </Modal>
  )
}

function AlertContainer({
  active,
  toggleActive,
  toggleKeyboard,
  toggleStep,
  paymentData,
  message,
  paymentTrackingId
}: any) {
  async function handleRefund() {}

  const {Data, Loader, pin, clearPin, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext);
  const [ecartInfo, setEcartInfo] = useState<any>({})

  function handleCloseModal() {
    const confirm = window.confirm("Are you sure about this action?");
    if (!confirm) return;
    toggleActive();
    toggleKeyboard();
    toggleStep(2);
  }

  useEffect(()=>{
    getEcartItems(paymentTrackingId)
  },[paymentTrackingId])
  
  // this would get called once payment succeed
  async function getEcartItems(cartId: string){
    try {

      setLoader((prev: any)=>({...prev, getAllEcartItems: true}))
      const url = APIROUTES.getCartsItems.replace(":cartId", cartId)

      const {res, data} = await Fetch(url, {
        method: "GET"
      });
      setLoader((prev: any)=>({...prev, getAllEcartItems: false}))

      if(!data.success){
        setError((prev: any)=>({...prev, getAllEcartItems: data.message}))
        return
      }

      setEcartInfo(data.data)
      console.log(data.data)
      setError((prev: any)=>({...prev, getAllEcartItems: null}))
    } catch (e: any) {
      setLoader((prev: any)=>({...prev, getAllEcartItems: false}))
      setError((prev: any)=>({...prev, getAllEcartItems: `An Error Occured:  ${e.message}`}))
    }
  }

  if(Loader.getAllEcartItems){
    return <LoaderScreenComp full={true}/>
  }
  
  if(Error.getAllEcartItems !== null){
    return <ErrorScreen full={true} text={Error.getAllEcartItems} />
  }

  const isConfirmed = (ecartInfo.paid === "true" && ecartInfo.confirmed === "false") ? "false" : "true"

  return (
    <Modal isActive={active} clickHandler={handleCloseModal}>
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="w-[450px] h-auto bg-dark-200 rounded-md ">
          <div className="w-full flex flex-col text-center items-center justify-center">
            <div className="w-full px-3 py-3">
              <p className="text-green-200 text-[20px] font-extrabold">
                Payment Successfull
              </p>
              {message === "" ? <p className="text-white-300 text-[15px]">
                Your payment for <span className="text-white-100 font-extrabold">{formatCurrency(paymentData.currency, paymentData.amount)}</span> was
                successfull.
              </p> : <p className="text-white-300 text-[15px]">{message}</p>}
            </div>
            <div className="w-full flex flex-col items-center justify-center px-4">
              <p className="text-white-300 text-[15px]">
                
                ID : <span className="text-white-100 font-extrabold text-[15px] ">
                  {isConfirmed === "false" ? ecartInfo.id : paymentData.ecartId}
                </span>
              </p>
              <br />
              <div className="w-full flex flex-col items-center justify-center h-auto bg-white-100">
                <QRCode
                  scale={10}
                  width={"100%"}
                  height={"100%"}
                  value={isConfirmed === "false" ? ecartInfo.id : paymentData.ecartId}
                />
              </div>
              <div className="w-full flex flex-col items-center justify-center px-5 py-5 ">
                <button
                  className={`w-full px-5 py-3 rounded-[30px] bg-blue-300 font-extrabold text-white-100 transition-all hover:bg-dark-100 scale-[.95] mr-5 ${isConfirmed === "true" ? " opacity-[.5] " : "opacity-1"} `}
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
    </Modal>
  );
}
