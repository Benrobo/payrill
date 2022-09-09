import React, { useContext, useEffect, useState } from "react";
import { Layout } from "../../components";
import VirtualCard from "../../components/Cards/VirtualCard";
import TopNavbar from "../../components/Navbar/topNavbar";
import { IoMdArrowDropdown } from "react-icons/io";
import { BsBoxArrowUp, BsBoxArrowDown } from "react-icons/bs";
import { BiMessageSquareAdd, BiRightArrow } from "react-icons/bi";
import { RiHistoryFill } from "react-icons/ri";
import {
  FaBitcoin,
  FaLongArrowAltDown,
  FaLongArrowAltLeft,
  FaUserTie,
} from "react-icons/fa";
import { GiHouse, GiWallet } from "react-icons/gi";
import { CgMenuGridO, CgClose } from "react-icons/cg";

import { DEVICE_WIDTH } from "../../config";
import Modal from "../../components/UI-COMP/modal";
import WalletCard from "../../components/Cards/WalletCard";
import { Link } from "react-router-dom";
import { LoaderScreen, Spinner } from "../../components/UI-COMP/loader";
import DataContext from "../../context/DataContext";
// import { getVirtualCards } from "../../services/cards";
import APIROUTES from "../../apiRoutes";
import Fetch from "../../utils/fetch";
import Notification from "../../utils/toast";
import { ErrorScreen } from "../../components/UI-COMP/error";
import { GetCardType } from "../../utils/creditCard";

interface ActiveState {
  viewTransaction: boolean;
  moreOptions: boolean;
  virtualCard: boolean;
  switchCard: boolean;
}

interface LastTransactionProp {
  handleActiveState: (name: string, e?: any) => void;
}

interface ViewTransactionProp {
  handleActiveState: (name: string, e?: any) => void;
  active: boolean;
}

interface handleActiveStateParams {
  name: string;
  e?: any;
  state?: boolean;
}

const notif = new Notification(10000)

function Dashboard() {
  const {Data, Loader, getVirtualCards, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
  const [activeState, setActiveState] = useState<ActiveState>({
    viewTransaction: false,
    moreOptions: false,
    virtualCard: false,
    switchCard: false,
  });
  const [virtualCardId, setVirtualCardId] = useState<string>("");
  const [selectedVcInfo, setSelectedVcInfo] = useState<any>({})

  useEffect(()=>{
    if(activeState.switchCard){
      getVirtualCards()
    }
  },[activeState])

  useEffect(()=>{
    if(virtualCardId === "") return;
    getVirtualCardInfo(virtualCardId)
  },[virtualCardId])

  function handleActiveState(name: string, state?: boolean, vcId?: any) {
    if (name === "viewTransaction") {
      setActiveState((prev) => ({
        ...prev,
        ["viewTransaction"]: !activeState.viewTransaction,
      }));
    }
    if (name === "moreOptions") {
      setActiveState((prev) => ({
        ...prev,
        ["moreOptions"]: !activeState.moreOptions,
      }));
    }
    if (name === "virtualCard") {
      if (typeof state !== "undefined"){
        setVirtualCardId(vcId);
        setActiveState((prev: any) => ({ ...prev, ["virtualCard"]: state }));
      }
      
    }
    if (name === "switchCard") {
      setActiveState((prev) => ({
        ...prev,
        ["switchCard"]: !activeState.switchCard,
      }));
    }
  }

  function getVirtualCardInfo(cardId: string){
    if(cardId === "cardid") return;
    const cards = Data.cards;
    const filteredCard = cards.filter((card: any) => card.card_id === cardId || virtualCardId)[0];
    setSelectedVcInfo(filteredCard)
  }

  // check if an error occured during fetching of wallet info
  if(Loader.wallet){
    return <LoaderScreen full={true} text="Loading...." />
  }

  if(!Loader.wallet && Error.wallet !== null){
    return <ErrorScreen full={true} size="md" text={Error.wallet} />
  }

  return (
    <>
      <Layout sideBarActiveName="dashboard">
        <TopNavbar />
        <br />
        <div className="w-full flex flex-row items-center justify-end mb-2 px-3">
          <button
            className="px-4 py-2 flex flex-row items-center justify-around rounded-[30px] bg-dark-200 text-[15px "
            onClick={() => handleActiveState("switchCard", true, null)}
          >
            Switch Card <IoMdArrowDropdown className="text-[25px] " />
          </button>
        </div>
        {activeState.virtualCard ? (
          <>
          {
            Object.entries(selectedVcInfo).length > 0 &&
            <VirtualCard
              exp={selectedVcInfo?.expiration_month + "/" + selectedVcInfo?.expiration_year}
              name={GetCardType(selectedVcInfo?.card_number)}
              number={selectedVcInfo?.card_number}
              type={GetCardType(selectedVcInfo?.card_number)}
            />
          }
          </>
        ) : (
          <WalletCard />
        )}
        <br />
        <Feature handleActiveState={handleActiveState} />
        <br />
        <SwitchedCard
          handleActiveState={handleActiveState}
          active={activeState.virtualCard}
          isActive={activeState.switchCard}
        />
        <br />
        <LastTransactions handleActiveState={handleActiveState} />

        <ViewTransaction
          handleActiveState={handleActiveState}
          active={activeState.viewTransaction}
        />

        <MoreOptions
          handleActiveState={handleActiveState}
          active={activeState.moreOptions}
        />

        {/* <LoaderScreen /> */}
      </Layout>
    </>
  );
}

export default Dashboard;

function Feature({ handleActiveState }: any) {
  return (
    <div className="w-full flex flex-row items-start justify-between py-2 px-3">
      <div id="box" className="flex flex-col items-center justify-center ">
        <Link to="/payment/transfer">
          <button className="px-4 py-4 mb-4 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] ">
            <BsBoxArrowUp className="text-[25px] " />
          </button>
          <span className="text-white-300 text-[15px] mt-4 ">Transfer</span>
        </Link>
      </div>

      <div id="box" className="flex flex-col items-center justify-center">
        <Link to="/payment/withdraw">
          <button className="px-4 py-4 mb-4 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] ">
            <BsBoxArrowDown className="text-[25px] " />
          </button>
          <span className="text-white-300 text-[15px] mt-4 ">Withdraw</span>
        </Link>
      </div>

      <div id="box" className="flex flex-col items-center justify-center">
        <Link to="/payment/topup">
          <button className="px-4 py-4 mb-4 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] ">
            <BiMessageSquareAdd className="text-[25px] " />
          </button>
          <span className="text-white-300 text-[15px] mt-4 ">TopUp</span>
        </Link>
      </div>

      <div id="box" className="flex flex-col items-center justify-center">
        <button
          className="px-4 py-4 mb-4 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] "
          onClick={() => handleActiveState("moreOptions")}
        >
          <CgMenuGridO className="text-[25px] " />
        </button>
        <span className="text-white-300 text-[15px]">More</span>
      </div>
    </div>
  );
}

function SwitchedCard({ handleActiveState, active, isActive }: any) {
  
  const {Data, Loader, Error, setData, setLoader, setError} = useContext<any>(DataContext)
  const [activetarget, setActiveTarget] = useState<any>({
    name: "",
    cardId: null,
  });

  useEffect(() => {
    
  }, []);

  const handleActiveTarget = (e: any) => {
    const dataset = e.target.dataset;
    if (Object.entries(dataset).length > 0) {
      const { id, name } = dataset;
      setActiveTarget({ name, cardId: id });
    }
  };

  const continueSwitch = () => {
    if (activetarget.name === "virtualCard") {
      handleActiveState("virtualCard", true,activetarget.cardId);
      handleActiveState("switchCard", false);
      return;
    }
    if(activetarget.name === "walletCard"){
      handleActiveState("virtualCard", false, activetarget.cardId);
      handleActiveState("switchCard", false);
    }
  };
  return (
    <Modal isActive={isActive}>
      <div className="w-[350px] bg-dark-200 rounded-md p-3 ">
        <button
          className="absolute scale-[.60] top-4 right-2 px-4 py-4 flex flex-row items-center justify-center rounded-[50%] bg-red-900 text-[15px] "
          onClick={() => handleActiveState("switchCard")}
        >
          <CgClose className="text-[25px] text-red-200 " />
        </button>
        <div
          id="head"
          className="w-full flex flex-col items-start justify-start"
        >
          <p className="text-white-100 text-[15px] ">Account Card</p>
          <p className="text-white-300 text-[12px] ">Select account cards.</p>
        </div>
        <br />
        <div
          id="walletCard"
          className="w-full flex flex-col items-start justify-start"
        >
          <div
            id="card"
            className={`w-full rounded-md flex flex-row items-center justify-start px-4 py-3 gap-3 cursor-pointer border-[3px] ${activetarget.name === "walletCard" ? "border-blue-300 bg-blue-300 " : "border-transparent bg-dark-100 "} border-solid hover:bg-blue-300 `}
            data-id={"cardid"}
            data-name="walletCard"
            onClick={handleActiveTarget}
          >
            <p className="text-white-100 text-[15px] ">E-Wallet</p>
          </div>
        </div>
        <div
          id="virtualCards"
          className="w-full flex flex-col items-start justify-start gap-2"
        >
          {
            Loader.getCards ? 
              <>
                <div className="w-full flex flex-col items-center justify-center mt-2 py-2 ">
                  <Spinner />
                  <span className="text-white-200 text-[12px] py-2 ">Loading Virtual Cards</span>
                </div>
              </>
              :
            Error.getCards !== null ?
              <div className="w-full flex items-center justify-center mt-3">
                <span className="text-white-200 text-[12px] py-2 ">{Error.getCards}</span>
              </div>
              :
            Data.cards.length > 0 ?
              Data.cards.map((data: any)=>(
                <div
                  id="card"
                  className={`w-full rounded-md flex flex-row items-center justify-start px-4 py-3 gap-3 cursor-pointer mt-1 border-[3px] ${activetarget.name === "virtualCard" ? "border-blue-300 bg-blue-300" : "border-transparent bg-dark-100 "} border-solid hover:bg-blue-300`}
                  onClick={handleActiveTarget}
                  data-name="virtualCard"
                  data-id={data.card_id}
                  data-type="virtual_card"
                >
                  <p className="text-white-100 text-[15px] capitalize ">
                    {GetCardType(data.card_number)}
                  </p>
                </div>
              ))
              :
              <div className="w-full flex items-center justify-center">
                <span className="text-white-200 text-[12px] py-2 ">No virtual cards available</span>
              </div>
          }
        </div>
        <br />
        <div className="w-full flex flex-row items-center justify-between">
          <button
            className={`w-full rounded-md px-4 py-3 flex flex-row items-center justify-center bg-blue-300 text-white-100 ${Loader.getCards ? "opacity-[.7]" : "opacity-1"} `}
            onClick={continueSwitch}
            disabled={Loader.getCards}
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}

function LastTransactions({ handleActiveState }: LastTransactionProp) {
  const avatarImg = {
    background: `url("https://avatars.dicebear.com/api/avataaars/a.svg")`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div className="w-full px-3">
      <div
        id="head"
        className="w-full flex flex-row items-center justify-between"
      >
        <p className="text-white-200 text-[15px] ">Last Transactions</p>
        <button className="px-3 py-2 flex flex-row items-center justify-center rounded-md text-[12px] bg-dark-200 gap-3 ">
          <BiRightArrow className="text-[15px] " /> View All
        </button>
      </div>
      <br />
      <div
        id="transaction-list"
        className="w-full flex flex-col items-center justify-center gap-2"
      >
        <div
          id="card"
          className="w-full flex flex-row items-row justify-between bg-dark-200 p-4 rounded-[12px] cursor-pointer"
          onClick={(e) => handleActiveState("viewTransaction", e)}
        >
          <div
            id="left"
            className="w-full flex flex-row items-start justify-start gap-3"
          >
            <div
              id="img"
              className="p-6 rounded-[50%] bg-dark-200 border-[3px] border-solid border-blue-200 "
              style={avatarImg}
            ></div>
            <div className="w-auto flex flex-col items-start justify-start">
              <span className="text-white-200 text-[15px] font-extrabold ">
                John Doe
              </span>
              <span className="text-white-300 text-[12px]">
                Mon 19, Dec 2020
              </span>
            </div>
          </div>
          <div
            id="right"
            className="w-auto flex flex-col items-center justify-center"
          >
            <span className="text-green-400 text-[15px] font-extrabold ">
              +$500
            </span>
          </div>
        </div>

        <div
          id="card"
          className="w-full flex flex-row items-row justify-between bg-dark-200 p-4 rounded-[12px] cursor-pointer"
          onClick={(e) => handleActiveState("viewTransaction", e)}
        >
          <div
            id="left"
            className="w-full flex flex-row items-start justify-start gap-3"
          >
            <div
              id="img"
              className="p-6 rounded-[50%] bg-dark-200 border-[3px] border-solid border-blue-200 "
              style={avatarImg}
            ></div>
            <div className="w-auto flex flex-col items-start justify-start">
              <span className="text-white-200 text-[15px] font-extrabold ">
                John Doe
              </span>
              <span className="text-white-300 text-[12px]">
                Mon 19, Dec 2020
              </span>
            </div>
          </div>
          <div
            id="right"
            className="w-auto flex flex-col items-center justify-center"
          >
            <span className="text-red-400 text-[15px] font-extrabold ">
              -$500
            </span>
          </div>
        </div>
        <div className="w-full h-[100px] "></div>
      </div>
    </div>
  );
}

function ViewTransaction({ active, handleActiveState }: ViewTransactionProp) {
  const avatarImg = {
    background: `url("https://avatars.dicebear.com/api/avataaars/a.svg")`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <div
      className={`w-full md:w-[500px] md:w-[${DEVICE_WIDTH}] ${
        active ? "h-full" : "h-0"
      } fixed bottom-0 bg-dark-100 z-[10] transition-all`}
    >
      <div className="w-full flex flex-row items-row justify-between mt-3 px-3">
        <button
          className="p-3 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] "
          onClick={() => handleActiveState("viewTransaction")}
        >
          <FaLongArrowAltLeft className="text-[20px] " />
        </button>
      </div>
      <br />
      <div
        id="info"
        className="w-auto h-[180px] flex flex-col items-center justify-center "
      >
        <div
          id="img"
          className="w-[70px] h-[70px] rounded-[50%] bg-dark-100 border-[3px] border-solid border-blue-200 "
          style={avatarImg}
        ></div>
        <br />
        <p className="text-white-300 text-[12px] pb-4 mt-2">
          payment description
        </p>
        <p className="text-white-100 ">
          You received <span className="font-extrabold">$500 USD</span> from
          <span className="font-extrabold"> John Doe.</span>
        </p>
      </div>
      <div
        id="payment-info"
        className="w-full h-full rounded-t-[50px] bg-dark-200 relative flex flex-col items-center justify-start "
      >
        <div className="w-full flex flex-row items-center justify-between gap-3 mt-10 px-6 ">
          <p className="text-white-200 text-[15px] font-extrabold pb-4">
            Transaction Details
          </p>

          <p className="text-white-300 text-[12px] pb-4">Mon 19, Jun 2020</p>
        </div>
        <div className="w-full flex flex-row items-start justify-start gap-4 px-5 p-4">
          <button className="p-3 flex flex-row items-center justify-center rounded-md bg-dark-100 text-white-200 text-[15px] ">
            <GiWallet className="text-[20px] " />
          </button>
          <div className="w-auto flex flex-col items-start justify-start">
            <p className="text-white-100 text-[15px] font-extrabold">Amount</p>
            <p className="text-white-200 text-[15px]">$2,500 USD</p>
          </div>
        </div>
        <div className="w-full flex flex-row items-start justify-start gap-4 px-5 p-4 opacity-[.3] ">
          <button className="p-3 flex flex-row items-center justify-center rounded-md bg-dark-100 text-white-200 text-[15px] ">
            <FaUserTie className="text-[20px] " />
          </button>
          <div className="w-auto flex flex-col items-start justify-start">
            <p className="text-white-100 text-[15px] font-extrabold">
              PayRill Fee
            </p>
            <p className="text-white-200 text-[15px]">$10 USD</p>
          </div>
        </div>
        {/* <div className="w-[70%] border-b-[1px] border-b-solid "></div> */}
        <div className="w-full h-auto flex flex-col items-center justify-center">
          <button className="p-3 flex flex-row items-center justify-center rounded-[50%] bg-blue-400 text-white-200 text-[15px] ">
            <FaLongArrowAltDown className="text-[20px] " />
          </button>
          <br />
          <p className="text-white-200 text-[12px]">Total Received</p>
          <p className="text-white-100 text-[20px] font-extrabold ">
            $2,490 USD
          </p>
        </div>
        <br />

        <span className="absolute top-2 w-[100px] p-1 rounded-[30px] bg-dark-100 "></span>
      </div>
    </div>
  );
}

function MoreOptions({ active, handleActiveState }: any) {
  // console.log(active);
  
  return (
    <Modal isActive={active} >
      <button
        className="absolute scale-[.60] top-4 right-2 px-4 py-4 flex flex-row items-center justify-center rounded-[50%] bg-red-900 text-[15px] "
        onClick={() => handleActiveState("moreOptions")}
      >
        <CgClose className="text-[25px] text-red-200 " />
      </button>
      <div className="relative w-[280px] flex flex-wrap flex-row items-center p-5 rounded-md bg-dark-300 gap-5">

        <div id="box" className="flex flex-col items-center justify-center">
          <Link to="/cards/vc">
            <button className="px-4 py-4 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] ">
              <GiWallet className="text-[25px] " />
            </button>
            <span className="text-white-300 text-[15px] mt-4 ">Cards</span>
          </Link>
        </div>

        <div id="box" className="flex flex-col items-center justify-center">
          <Link to="/booking">
            <button className="px-4 py-4 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] ">
              <GiHouse className="text-[25px] " />
            </button>
            <span className="text-white-300 text-[15px] mt-4 ">Booking</span>
          </Link>
        </div>

        <div id="box" className="flex flex-col items-center justify-center">
          <Link to="/crypto">
            <button className="px-4 py-4 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] ">
              <FaBitcoin className="text-[25px] " />
            </button>
            <span className="text-white-300 text-[15px] mt-4 ">Crypto</span>
          </Link>
        </div>

        <div id="box" className="flex flex-col items-center justify-center">
          <button className="px-4 py-4 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] ">
            <RiHistoryFill className="text-[25px] " />
          </button>
          <span className="text-white-300 text-[15px] mt-4 ">History</span>
        </div>
      </div>
    </Modal>
  );
}
