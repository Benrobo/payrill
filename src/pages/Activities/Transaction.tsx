import React, { useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaLongArrowAltDown, FaLongArrowAltLeft, FaUserTie } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { Link } from "react-router-dom";
import { Layout } from "../../components";


interface ViewTransactionProp {
    handleActiveState: (name: string, e?: any) => void;
    active: boolean;
}

function TransactionActivities() {
  const [activeState, setActiveState] = useState({
    viewTransaction: false,
  });

  function handleActiveState(name: string, state?: boolean) {
    if (name === "viewTransaction") {
      setActiveState((prev) => ({
        ...prev,
        ["viewTransaction"]: !activeState.viewTransaction,
      }));
    }
  }

  return (
    <Layout sideBarActiveName="activities">
      <div className="w-full h-screen flex flex-col items-center justify-start">
        <div
          id="head"
          className="w-full flex flex-row items-center justify-start p-4 gap-10"
        >
          <Link to="/dashboard">
            <button className="px-3 py-2 flex items-center justify-center bg-dark-200 rounded-md ">
              <AiOutlineArrowLeft />
            </button>
          </Link>
          <p className="text-white-200 font-extrabold ">Activities</p>
        </div>
        <br />
        <TransactionLists handleActiveState={handleActiveState} />

        <ViewTransaction
          handleActiveState={handleActiveState}
          active={activeState.viewTransaction}
        />
      </div>
    </Layout>
  );
}

export default TransactionActivities;

function TransactionLists({ handleActiveState }: any) {
  const avatarImg = {
    background: `url("https://avatars.dicebear.com/api/avataaars/a.svg")`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
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
            <span className="text-white-300 text-[12px]">Mon 19, Dec 2020</span>
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
        className={`w-full md:w-[500px] ${
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