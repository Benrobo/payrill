import React, { useContext, useEffect, useState } from "react";
import { AiFillCopy, AiOutlineArrowLeft } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { Link } from "react-router-dom";
import APIROUTES from "../../apiRoutes";
import { Layout } from "../../components";
import VirtualCard from "../../components/Cards/VirtualCard";
import { ErrorScreen } from "../../components/UI-COMP/error";
import Keyboard from "../../components/UI-COMP/keyboard";
import { LoaderScreen, LoaderScreenComp, Spinner } from "../../components/UI-COMP/loader";
import Modal from "../../components/UI-COMP/modal";
import DataContext from "../../context/DataContext";
import { sleep } from "../../utils";
import { GetCardType, separateCardNum } from "../../utils/creditCard";
import Fetch from "../../utils/fetch";
import Notification from "../../utils/toast";

const notif = new Notification(10000);

function VirtualCards() {
  const { Data, Loader, Error, pin, clearPin, setData, setLoader, setError } =
    useContext<any>(DataContext);
  const [active, setActive] = useState(true);
  const [activeVc, setActiveVc] = useState<any>({});
  const [loading, setLoading] = useState(false)
  const [activeKeyboard, setActiveKeyboard] = useState(false)
  const [vcId, setVcId] = useState("")

  const toggleActive = () => setActive(!active);

  // const closeModal = () => {};

  useEffect(() => {
    getCards();
  }, []);

  useEffect(()=>{
    if(vcId === "") return;
    getSelectedVc(vcId)
  },[vcId])

  // get virtual cards
  async function getCards() {
    try {
      setLoader((prev: any) => ({ ...prev, getCards: true }));
      const url = APIROUTES.getUserCards;
      const { res, data } = await Fetch(url, {
        method: "GET",
      });
      setLoader((prev: any) => ({ ...prev, getCards: false }));

      if (!data.success) {
        setError((prev: any) => ({ ...prev, getCards: data.error }));
        return notif.error(data.error);
      }

      setData((prev: any) => ({ ...prev, cards: data.data }));
      setActiveVc(data.data[0])
    } catch (e: any) {
      setLoader((prev: any) => ({ ...prev, getCards: false }));
      setError((prev: any) => ({
        ...prev,
        getCards: `Something went wrong. Try again`,
      }));
      return notif.error(e.message);
    }
  }

  function copyText(e: any){
    const dataset = e.target.dataset;
    console.log(dataset)
    if(Object.entries(dataset).length === 0) return;
    const {value} = dataset;
    navigator.clipboard.writeText(value)
    notif.success("Copied...")
  }



  async function BlockAndUnblockCard(e: any){
    const dataset= e.target.dataset;
    if(Object.entries(dataset).length === 0) return;
    const {state, card_id} = dataset;

    const confirm = window.confirm("Are you sure about this action?")

    if(!confirm) return;

    try {
        setLoader((prev: any) => ({ ...prev, changeCardStatus: true }));
        const url = APIROUTES.changeCardStatus.replace(":card", card_id).replace(":status", state);
        const { res, data } = await Fetch(url, {
          method: "GET",
        });
        setLoader((prev: any) => ({ ...prev, changeCardStatus: false }));
  
        if (!data.success) {
          setError((prev: any) => ({ ...prev, changeCardStatus: data.error }));
          return notif.error(data.error);
        }
  
        notif.success(data.message)
        await sleep(1.2)
        window.location.reload()
      } catch (e: any) {
        setLoader((prev: any) => ({ ...prev, changeCardStatus: false }));
        return notif.error(e.message);
      }
  }

  async function createVc(){
    try {
      setActiveKeyboard(false)
      setLoading(true);
      const url = APIROUTES.createVirtualCard
      const { res, data } = await Fetch(url, {
        method: "POST",
        body: JSON.stringify({
          pin: pin.originalPin
        })
      });
      setLoading(false);

      if (!data.success) {
        notif.error(data.message)
        return notif.error(data.error);
      }

      notif.success(data.message)
      getCards()
    } catch (e: any) {
      setLoader((prev: any) => ({ ...prev, changeCardStatus: false }));
      return notif.error(e.message);
    }
  }

  function getSelectedVc(id: string){
    const filter = Data.cards.filter((card: any)=> card.card_id === id)[0];
    setActiveVc(filter)
  }

  return (
    <Layout>
      <div
        id="virtualCardOvl"
        className="w-full h-screen overflow-y-scroll fixed bottom-0 top-0 md:w-[500px] mx-auto bg-dark-100 z-[100] "
      >
        <div
          id="head"
          className="w-full flex flex-row items-center justify-start p-4 gap-10"
        >
          <Link to="/dashboard">
            <button className="px-3 py-2 flex items-center justify-center bg-dark-200 rounded-md ">
              <AiOutlineArrowLeft />
            </button>
          </Link>
          <p className="text-white-200 font-extrabold ">Virtual Cards</p>
        </div>
        <br />
        <div className="w-full flex items-center justify-between px-5">
          <button className="px-3 py-2 rounded-[30px] flex items-center justify-center bg-dark-200 text-white-200 " onClick={()=> setActiveKeyboard(!activeKeyboard)}>
            <FaPlus className="text-[12px] " />{" "}
            <span className="text-white-200 text-[15px] ml-3">Create Card</span>
          </button>
          <select
            name=""
            id=""
            className="w-auto px-3 py-2 flex items-center justify-center rounded-[30px] bg-dark-200 text-white-200"
            disabled={Error.getCards !== null || Loader.getCards}
            onChange={(e: any)=> setVcId(e.target.value)}
          >
            <option value="">Select Card</option>
            {
                Data.cards.map((data: any)=>(
                    <option value={data.card_id}>{data.card_number}</option>
                ))
            }
          </select>
        </div>
        {
            Loader.getCards ?
                <LoaderScreenComp text="Virtual Card Loading.." full={true} />
                :
            Error.getCards !== null ?
                <ErrorScreen full={true} text={Error.getCards} />
                :
            Object.entries(activeVc).length > 0 ?
                <div className="w-full">
                    <div
                    id="virtualCardCont"
                    className="w-full px-3 flex flex-col items-start justify-start gap-5 mt-5"
                    >
                    <VirtualCard
                        exp={activeVc.expiration_month +  "/" + activeVc.expiration_year}
                        name={GetCardType(activeVc.card_number)}
                        number={activeVc.card_number}
                        type={GetCardType(activeVc.card_number)}
                    />
                    </div>
                    <br />
                    <div
                    id="settings"
                    className="w-full h-auto flex flex-col items-center justify-center gap-2"
                    >
                    <div className="w-full flex flex-col items-start justify-start px-5">
                        <p className="text-white-200 text-[15px] font-extrabold ">
                        Card Details
                        </p>
                        <br />
                        <div
                        id="cardNum"
                        className="w-full bg-dark-200 rounded-lg flex items-center justify-between px-4 py-2 text-white-200 text-[12px] "
                        >
                        <span className="text-white-100 tracking-widest font-extrabold text-[15px] ">
                            {separateCardNum(activeVc.card_number)}
                        </span>
                        <button data-value={separateCardNum(activeVc.card_number)} className="px-3 py-2 text-white-200 text-[12px] scale-[.85] flex items-center justify-center bg-dark-100 rounded-md " onClick={copyText}>copy</button>
                        </div>
                        <br />
                        <div className="w-full flex items-center justify-between gap-5">
                            <div
                                id="exp"
                                className="w-full bg-dark-200 rounded-lg flex items-center justify-between px-3 py-2 "
                            >
                                <span className="text-white-100 tracking-widest font-extrabold text-[15px] ">
                                {activeVc.expiration_month +  "/" + activeVc.expiration_year}
                                </span>
                                <button data-value={activeVc.expiration_month +  "/" + activeVc.expiration_year} className="px-3 py-2 text-white-200 text-[12px] scale-[.85] flex items-center justify-center bg-dark-100 rounded-md " onClick={copyText}>copy</button>
                            </div>
                        <div
                            id="exp"
                            className="w-full bg-dark-200 rounded-lg flex items-center justify-between px-3 py-2 "
                        >
                            <span className="text-white-100 tracking-widest font-extrabold text-[15px] ">
                                {activeVc.cvv}
                            </span>
                            <button data-value={activeVc.cvv} className="px-3 py-2 text-white-200 text-[12px] scale-[.85] flex items-center justify-center bg-dark-100 rounded-md " onClick={copyText}>copy</button>
                        </div>
                        </div>
                        <br />
                    </div>
                    <div className="w-full flex flex-col items-start justify-start px-5">
                        <p className="text-white-200 text-[15px] font-extrabold ">
                        Card Settings
                        </p>
                        <br />
                        <div className="w-full flex flex-col items-center justify-between">
                            <br />
                            <div className="w-full flex items-center justify-between">
                                {
                                    activeVc.status === "ACT" ?
                                        <button data-card_id={activeVc.card_id} data-state="block" className="w-full px-4 py-3 flex flex-col items-center justify-center rounded-[30px] font-extrabold bg-dark-100 text-white-100 hover:bg-red-700 border-2 border-solid border-red-700" onClick={BlockAndUnblockCard} disabled={Loader.changeCardStatus}>
                                            {Loader.changeCardStatus ? <Spinner color="#fff" /> : "Block Card"}
                                        </button>
                                        :
                                        <button data-card_id={activeVc.card_id} data-state="unblock" className="w-full px-4 py-3 flex flex-col items-center justify-center rounded-[30px] font-extrabold bg-blue-300 text-white-100" onClick={BlockAndUnblockCard} disabled={Loader.changeCardStatus}>
                                            {Loader.changeCardStatus ? <Spinner color="#fff" /> : "Unblock Card"}
                                        </button>
                                }
                            </div>
                        </div>
                        <br />
                    </div>
                    </div>
                </div>
                :
            <ErrorScreen text="No Virtual Cards Available" />
        }

        { loading && <LoaderScreen />  }

        {
          activeKeyboard &&
          <Keyboard
            active={activeKeyboard}
            title="Create Virtual Card"
            handler={createVc}
            toggleKeyboard={()=> {
              clearPin()
              setActiveKeyboard(!activeKeyboard)
            }}
          />
        }
      </div>
    </Layout>
  );
}

export default VirtualCards;
