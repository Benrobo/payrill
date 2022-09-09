import React, { useState, useEffect } from "react";
import { FaCartPlus, FaLongArrowAltLeft, FaTrashAlt } from "react-icons/fa";
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
import { LoaderScreen } from "../../components/UI-COMP/loader";
import { sleep } from "../../utils";

const qrcodeconstraints = {
  facingMode: "",
};

const notif = new Notification(10000)


function Scanner() {
  const [qrcodeId, setQrcodeId] = useState("");
  const [steps, setSteps] = useState(2);
  const [activeAlertBox, setActiveAlertBox] = useState(false);
  const [activeKeyboard, setActiveKeyboard] = useState(false);

  const toggleActiveAlertBox = () => setActiveAlertBox(!activeAlertBox);
  const toggleActiveKeyboard = () => setActiveKeyboard(!activeKeyboard);

  const toggleSteps = (step: number) => setSteps(step);

  function handleQrcodeResult(result: any, error: any) {
    if (!!result) {
      setQrcodeId(result?.text);
    }
    if (!!error) {
      // console.info(error);
    }
  }

  function handleEcartPayment() {
    toggleActiveAlertBox();
  }

  return (
    <Layout>
      <div
        className={`w-full md:w-[500px] h-screen fixed top-0 bg-dark-100 z-[20] `}
      >
        {steps === 1 ? (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <QrReader
              onResult={handleQrcodeResult}
              constraints={qrcodeconstraints}
              className="w-full"
            />
            <Link to="/dashboard">
              <button className="px-6 py-3 bg-dark-200  font-extrabold text-white-100 rounded-[30px]">
                Exist Scanner
              </button>
            </Link>
          </div>
        ) : steps === 2 ? (
          <ProductInfo toggleStep={toggleSteps} />
        ) : steps === 3 ? (
          <CheckoutCont
            toggleStep={toggleSteps}
            toggleKeyboard={toggleActiveKeyboard}
            toggleAtiveAlertBox={toggleActiveAlertBox}
          />
        ) : steps === 4 ? (
          <Keyboard
            active={activeKeyboard}
            title="Checkout Payment"
            handler={handleEcartPayment}
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
        />
      )}
    </Layout>
  );
}

export default Scanner;

function ProductInfo({ toggleStep }: any) {
  const [quantity, setQuantity] = useState(1);
  const [selectcart, setSelectCart] = useState(false)
  const [ecartId, setEcartId] = useState("")
  const [addtocart, setAddToCart] = useState(false)

  const incQty = () => setQuantity((prev) => (prev += 1));
  const decQty = () =>
    setQuantity((prev) => (prev <= 1 ? (prev = 1) : (prev -= 1)));

  const toggleEcart = ()=> setSelectCart(!selectcart)

  const productStyle = {
    backgroundImage: `url("${milkImg}")`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  async function handleAddToCart() {
    if(ecartId === "") return notif.error("select an ecart to continue..")
    console.log(ecartId)
    setAddToCart(true)
    
    // if item has been added to cart...
    await sleep(2)
    notif.success("product added to cart.")
    setAddToCart(false)
    toggleStep(3);
  }

  return (
    <div className="w-full h-screen bg-dark-100 flex flex-col items-center justify-start">
      <div
        className="w-full relative  h-[350px] bg-white-100 "
        style={{ ...productStyle }}
      >
        <div className="w-full absolute top-0 flex items-center justify-start px-4 py-3 ">
          <button
            onClick={() => toggleStep(1)}
            className="px-3 py-2 rounded-md bg-dark-300"
          >
            <FaLongArrowAltLeft className="text-[20px] text-white-100 " />
          </button>
          <button
            onClick={toggleEcart}
            className="p-3 scale-[.90] rounded-[50%] border-[2px] border-solid border-blue-300 bg-dark-700 absolute right-5 top-1 "
          >
            <FaCartPlus className="text-[15px] text-white-100 " />
          </button>
        </div>
      </div>
      <div className="w-full flex items-center justify-between px-3 py-3">
        <div className="right w-auto flex flex-col items-start justify-start">
          <p className="text-white-200 font-extrabold ">Product Name</p>
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque,
          pariatur!
        </p>
      </div>
      <br />
      <div className="w-full h-[80px] bg-dark-200 absolute bottom-0 left-0 flex flex-row items-center justify-between shadow-xl drop-shadow-xl shadow-dark-100 px-3 ">
        <div
          id="left"
          className="w-auto flex flex-col items-start justify-start ml-2"
        >
          <p className="text-white-300 text-[12px] ">Price</p>
          <p className="text-white-100 font-extrabold text-[25px] ">$200</p>
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
      <SelectEcart active={selectcart} handleAddToCart={handleAddToCart} setEcartId={setEcartId} toggleActive={toggleEcart} />
      {addtocart && <LoaderScreen text="Adding to e-cart.." /> }
    </div>
  );
}

function SelectEcart({active, toggleActive, setEcartId, handleAddToCart}: any){

  const [cartname, setCartName] = useState("")
  const [steps, setSteps] = useState(1)

  const toggleSteps = (step: number)=> setSteps(step)

  useEffect(()=>{
    fetchEcart()
  },[])

  function handleEcartId(e: any){
    const dataset = e.target.dataset;
    const value = e.target.value;
    if(Object.entries(dataset).length === 0) {
      // if user selects an empty option, then set the previous ecart value to empty. ( FOR UI SAKE...)
      return setEcartId(value)
    };
    const {id} = dataset;
    setEcartId(id)
  }

  async function fetchEcart(){

  }

  async function createEcart(){
    if(cartname === "") return notif.error("e-cart name cant be empty")
    console.log(cartname)
    try {
      
    } catch (e: any) {
      
    }
  }

  return (
    <Modal isActive={active} clickHandler={toggleActive}>
      <Dialog height={300}>
        <div className="w-full flex flex-col items-center justify-center">
          {/* <p className="text-white-100 font-extrabold">E-cart</p> */}
          <p className="text-white-200 text-[15px] ">Select E-cart</p>
        </div>
        <br />
        <div className="w-full flex flex-col items-start justify-start px-7">
          {
            steps === 1 ?
              <>
                <p className="text-white-200 text-[15px] ">E-cart Name: <span className="text-white-100 font-extrabold">{cartname}</span> </p>
                <br />
                <select onChange={(e)=> {
                  setCartName(e.target.value)
                  handleEcartId(e)
                }} className="w-full px-4 py-3 rounded-[30px] text-white-200 bg-dark-100">
                  <option value="">Select e-cart</option>
                  <option value="Store-1.0" data-id={"e-cart-id"}>Store 1.0</option>
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
                  <button className="w-full px-4 py-3 scale-[.89] hover:scale-[1] rounded-[30px] bg-dark-200 flex items-center justify-center text-white-200" onClick={()=> {
                    toggleSteps(1)
                    setCartName("")
                  }}>
                    Back
                  </button>
                  <button className="w-full px-2 py-3 rounded-[30px] bg-blue-300 transition-all scale-[.89] hover:scale-[1] flex items-center justify-center text-white-100 font-extrabold" onClick={createEcart}>
                    Create Cart
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

function CheckoutCont({
  toggleStep,
  toggleAtiveAlertBox,
  toggleKeyboard,
}: any) {
  async function handleCheckout() {
    toggleStep(4);
    toggleKeyboard(true);
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex items-center justify-start px-4 py-3 ">
        <button
          onClick={() => toggleStep(1)}
          className="px-3 py-2 rounded-md bg-dark-300"
        >
          <FaLongArrowAltLeft className="text-[20px] text-white-100 " />
        </button>
        <p className="text-white-100 text-[18px] ml-5 font-extrabold ">
          Checkout
        </p>
        <button
          onClick={() => console.log(1)}
          className="px-2 py-2 rounded-md bg-dark-300 absolute top-4 right-5 "
        >
          <FaTrashAlt className="text-[15px] text-white-100 " />
        </button>
      </div>
      <br />
      <div className="w-full h-[450px] noScrollBar flex flex-col items-center justify-center px-3 gap-5 overflow-y-scroll ">
        {Array(12)
          .fill(0)
          .map((data: any, i: number) => (
            <CartCard key={i} data={data} />
          ))}
        <div className="w-full h-[120px] "></div>
      </div>
      <div className="w-full h-[100px] flex items-center justify-between absolute bottom-0 left-0 px-3 ">
        <div className="w-auto flex flex-col items-start justify-start">
          <p className="text-white-300 text-[12px] ">Total Price</p>
          <p className="text-white-100 text-[20px] font-extrabold ">
            {formatCurrency("USD", 700)}
          </p>
        </div>
        <button
          className="w-auto px-7 py-3 rounded-[30px] bg-blue-300 font-extrabold text-white-100 transition-all hover:bg-dark-200 scale-[.95] mr-5 "
          onClick={handleCheckout}
        >
          Checkout & Pay Now
        </button>
      </div>
    </div>
  );
}

function AlertContainer({
  active,
  toggleActive,
  toggleKeyboard,
  toggleStep,
}: any) {
  async function handleRefund() {}

  function handleCloseModal() {
    const confirm = window.confirm("Are you sure about this action?");
    if (!confirm) return;
    toggleActive();
    toggleKeyboard();
    toggleStep(2);
  }

  return (
    <Modal isActive={active} clickHandler={handleCloseModal}>
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <div className="w-[350px] h-auto bg-dark-200 rounded-md ">
          <div className="w-full flex flex-col text-center items-center justify-center">
            <div className="w-full px-3 py-3">
              <p className="text-green-200 text-[20px] font-extrabold">
                Payment Successfull
              </p>
              <p className="text-white-300 text-[15px]">
                Your payment for{" "}
                <span className="text-white-100 font-extrabold">$500</span> was
                successfull.{" "}
              </p>
            </div>
            <div className="w-full flex flex-col items-center justify-center">
              <p className="text-white-300 text-[15px]">
                {" "}
                E-cart Id :{" "}
                <span className="text-white-100 font-extrabold capitalize text-[20px] ">
                  {" "}
                  A6XFGH78{" "}
                </span>{" "}
              </p>
              <br />
              <div className="w-full flex flex-col items-center justify-center h-auto bg-white-100">
                <QRCode
                  scale={10}
                  width={"100%"}
                  height={"100%"}
                  value="dfvdfvdfdfdvfv"
                />
              </div>
              <div className="w-full flex flex-col items-center justify-center px-5 py-5 ">
                <button
                  className="w-full px-5 py-3 rounded-[30px] bg-blue-300 font-extrabold text-white-100 transition-all hover:bg-dark-100 scale-[.95] mr-5 "
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

function CartCard({ data, key }: any) {
  const productStyle = {
    backgroundImage: `url("${milkImg}")`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const [quantity, setQuantity] = useState(1);

  const incQty = () => setQuantity((prev) => (prev += 1));
  const decQty = () =>
    setQuantity((prev) => (prev <= 1 ? (prev = 1) : (prev -= 1)));

  return (
    <div
      className="w-full h-[90px] bg-dark-200 rounded-md p-4 flex items-center justify-between gap-5 "
      key={key}
    >
      <div
        className="w-[50px] rounded-md relative  h-[50px] bg-white-100 "
        style={{ ...productStyle }}
      ></div>
      <div className="w-auto flex flex-col items-start justify-start">
        <p className="text-white-100 text-[15px] font-extrabold">Milk Can</p>
        <p className="text-white-200 text-[12px] font-extrabold">
          {formatCurrency("USD", 7)}
        </p>
      </div>
      <div
        id="left"
        className="w-auto flex flex-row items-center justify-start p-1 rounded-md"
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
      <button
        onClick={() => console.log(1)}
        className="h-full px-2 py-2 rounded-md bg-red-800 text-red-200 "
      >
        <FaTrashAlt className="text-[15px]" />
      </button>
    </div>
  );
}
