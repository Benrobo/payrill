import React, { useContext, useState } from "react";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import APIROUTES from "../../apiRoutes";
import { Layout } from "../../components";
import Dialog from "../../components/Dialog/Dialog";
import Keyboard from "../../components/UI-COMP/keyboard";
import { LoaderScreen } from "../../components/UI-COMP/loader";
import Modal from "../../components/UI-COMP/modal";
import DataContext from "../../context/DataContext";
import { Hotels } from "../../data";
import { sleep } from "../../utils";
import { formatCurrency } from "../../utils/creditCard";
import Fetch from "../../utils/fetch";
import Notification from "../../utils/toast";

const notif = new Notification(10000)

const bgImageStyle = {
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

function HotelBooking() {
  const [selectedData, setSelectedData] = useState<any>({});
  const [isActive, setIsActive] = useState(false);
  const [continuePayment, setContinuePayment] = useState(false);

  const toggleActive = () => setIsActive(!isActive);

  const toggleContinuePayment = () => setContinuePayment(!continuePayment);

  const toggleSelectedHotel = (e: any) => {
    const dataset = e.target.dataset;
    if (Object.entries(dataset).length === 0) return;
    const { id } = dataset;
    const filteredData = Hotels.filter((hotel) => hotel.id === +id)[0];
    setSelectedData(filteredData);
    toggleActive();
  };

  return (
    <Layout includeNav={false}>
      <div className="w-full h-screen overflow-hidden relative bg-dark-200">
        <div className="w-full flex items-center justify-start px-4 py-3 ">
          <Link to="/dashboard" className="w-auto">
            <button className="px-3 py-2 rounded-md bg-dark-100 ">
              <FaLongArrowAltLeft className="text-[20px] text-white-200 " />
            </button>
          </Link>
          <p className="text-white-100 font-extrabold ml-3">Hotel Booking</p>
        </div>
        {/* <div className="w-full px-4 py-3">
                <p className="text-white-200">Hotel booking just got easier with payril.</p>
            </div> */}
        {/* <br /> */}
        <div className="w-full px-4 md:px-4 h-full noScrollBar overflow-y-scroll flex flex-wrap items-center justify-start gap-2">
          {Hotels.map((data) => (
            <div
              key={data.id}
              className="w-full md:w-[220px] h-auto bg-dark-200 p-3 rounded-md "
            >
              <div
                id="img"
                className="w-full h-[250px] md:h-[150px] bg-dark-100 rounded-md "
                style={{
                  ...bgImageStyle,
                  backgroundImage: `url("${data.photograph}")`,
                }}
              ></div>
              {/* <br /> */}
              <div className="w-full mt-2 flex flex-col items-start justify-start">
                <p className="text-white-100 font-extrabold">{data.name}</p>
                <p className="text-white-300 text-[14px] ">
                  {data.neighborhood}
                </p>
                <br />
                <button
                  className="w-full px-4 py-3 rounded-md bg-blue-300 font-extrabold text-white-100"
                  data-id={data.id}
                  onClick={toggleSelectedHotel}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
          <div className="w-full h-[100px] "></div>
        </div>
        {isActive && (
          <SelectedHotel
            data={selectedData}
            toggleSelectedHotel={toggleActive}
            active={isActive}
            toggleContinuePayment={toggleContinuePayment}
          />
        )}

        {continuePayment && (
          <PaymentSection
            active={continuePayment}
            amount={selectedData?.price}
            data={selectedData}
            togglePayment={toggleContinuePayment}
          />
        )}
      </div>
    </Layout>
  );
}

export default HotelBooking;

function SelectedHotel({
  data,
  active,
  toggleContinuePayment,
  toggleSelectedHotel,
}: any) {
  return (
    <Modal isActive={active} clickHandler={toggleSelectedHotel}>
      <div className="relative w-full h-screen bg-dark-200 z-[-1] ">
        <div
          id="img"
          className="w-full h-[350px] bg-dark-100 opacity-[.8] "
          style={{
            ...bgImageStyle,
            backgroundImage: `url("${data?.photograph}")`,
          }}
        ></div>
        <div className="w-full mt-2 flex flex-col items-start justify-start px-4 py-3">
          <p className="text-white-100 font-extrabold">{data?.name}</p>
          <p className="text-white-300 text-[14px] ">{data?.neighborhood}</p>
          <br />
          <p className="text-white-200 text-[15px] font-extrabold ">
            {data?.address}
          </p>
        </div>
        <br />
        <div className="w-full absolute bottom-0 left-0 flex items-center justify-between gap-5 px-4 py-3">
          <div className="w-full flex flex-col items-start justify-start">
            <p className="text-white-300 font-extrabold">Price</p>
            <p className="text-white-100 font-extrabold">
              {formatCurrency(data.currency, +data.price)}
            </p>
          </div>
          <button
            className="w-full px-4 py-3 rounded-[30px] bg-blue-300 font-extrabold text-white-100"
            onClick={toggleContinuePayment}
            data-id={data?.id}
          >
            Book Now
          </button>
        </div>
      </div>
    </Modal>
  );
}

function PaymentSection({ active, data, amount, togglePayment }: any) {
  const {Loader, walletInfo,setLoader, pin, steps, setSteps, clearStep, clearPin } = useContext<any>(DataContext);
  const [kbactive, setKbActive] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>({
    currency: "",
    amount: data.price
  })

  const toggleStep = (step: number) =>
    setSteps((prev: any) => ({ ...prev, dialog: step }));

  const closeKeyboard = () => {
    setKbActive(false);
    clearStep("dialog", 1);
    clearPin();
    togglePayment();
  };

  const closePaymentSection = () => {
    togglePayment();
    clearStep("dialog", 1);
  };


  async function handlePayment() {
    paymentInfo["type"] = "hotel-booking";
    // paymentInfo["crypto"] = paymentInfo.cryptoAddress;
    paymentInfo["pin"] = pin.originalPin
    paymentInfo["amount"] = amount;
    try {
      setLoader((prev: any)=>({...prev, withdraw: true}))
      const url = APIROUTES.payForService;

      const {res, data} = await Fetch(url, {
        method: "POST",
        body:JSON.stringify(paymentInfo)
      });
      setLoader((prev: any)=>({...prev, withdraw: false}))
      console.log(data.success === false)
      if(!data.success){
        notif.error(data.message)
        return
      }
      
      notif.success("Hotel Booked Successfully")
      closeKeyboard()
      await sleep(1.1)
      window.location.reload()
    } catch (e: any) {
      setLoader((prev: any)=>({...prev, withdraw: false}))
      notif.error(`An Error Occured:  ${e.message}`)
    }
  }

  return (
    <Modal isActive={true} clickHandler={closePaymentSection}>
      <Dialog height={300}>
        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-white-200">Booking Payment</p>
        </div>
        <br />
        <br />
        {
          steps.dialog === 1 ?
            <div className="w-full h-auto flex  text-center flex-col items-center justify-center px-6">
                
                <select
                    onChange={(e)=>{
                        setPaymentInfo((prev: any)=> ({...prev, currency: e.target.value}))
                    }}
                    className="w-full px-4 py-3 bg-dark-100 text-white-100 rounded-[30px]"
                >
                    <option value="">Select Account</option>
                    {
                        walletInfo?.accounts.map((wall: any)=>(
                            <option key={wall.currency} value={wall.currency}>{wall.currency}</option>
                        ))
                    }
                </select>
                <br />
                <button
                    className="w-full px-4 py-3 flex flex-col items-center justify-center font-extrabold text-white-100 bg-blue-300 rounded-[30px] "
                    onClick={() => {
                        const {currency}  = paymentInfo;
                        if(currency === "") return notif.error("currency cant be empty")
                        toggleStep(2)
                    }}
                >
                    Continue
                </button>
            </div>
            :
            steps.dialog === 2 ?
              <Keyboard
                  active={kbactive}
                  toggleKeyboard={closeKeyboard}
                  handler={handlePayment}
                  title="Hotel Booking"
                  subTitle={`hotel booking for  ${formatCurrency(paymentInfo.currency, +paymentInfo.amount)} `}
              />
              :
              ""
        }
        { Loader.withdraw && <LoaderScreen full={true} /> }
      </Dialog>
    </Modal>
  );
}
