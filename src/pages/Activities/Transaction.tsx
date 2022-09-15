import React, { useContext, useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { FaLongArrowAltDown, FaLongArrowAltLeft, FaUserTie } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { Link } from "react-router-dom";
import APIROUTES from "../../apiRoutes";
import { Layout } from "../../components";
import { ErrorScreen } from "../../components/UI-COMP/error";
import { LoaderScreenComp } from "../../components/UI-COMP/loader";
import DataContext from "../../context/DataContext";
import Fetch from "../../utils/fetch";
import Notification from "../../utils/toast";
import moment from "moment"
import { formatCurrency } from "../../utils/creditCard";
import { BiArrowFromBottom, BiArrowFromTop } from "react-icons/bi";


const notif = new Notification(10000)

// interface ViewTransactionProp {
//     handleActiveState: (name: string, e?: any) => void;
//     active: boolean;
//     setActiveState?: any;
// }

function TransactionActivities() {
  const {Data, Loader, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext);
  const [activeState, setActiveState] = useState({
    viewTransaction: false,
  });
  const [transactionId, setTransactionId] = useState("")

  function handleActiveState(name: string, e?: any) {
    if (name === "viewTransaction") {
      const dataset = e.target.dataset;
      if(Object.entries(dataset).length === 0) return;
      const {id} = dataset;
      setTransactionId(id);
      setActiveState((prev) => ({
        ...prev,
        ["viewTransaction"]: !activeState.viewTransaction,
      }));
    }
  }

  useEffect(()=>{
    fetchTransactions()
  },[])

  async function fetchTransactions(){
    try {
      setLoader((prev: any)=>({...prev, transactions: true}))
      const url = APIROUTES.getTransactions

      const {res, data} = await Fetch(url, {
        method: "GET",
      });
      setLoader((prev: any)=>({...prev, transactions: false}))

      if(!data.success){
        setError((prev: any)=>({...prev, transactions: data.message}))
        return
      }

      setData((prev: any)=>({...prev, transactions: data.data}))
    } catch (e: any) {
      setLoader((prev: any)=>({...prev, transactions: false}))
      setError((prev: any)=>({...prev, transactions: ` An Error occured: ${e.message} `}))
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
          <span className="text-white-100 font-extrabold bg-blue-300 rounded-md px-2 py-1 text-[10px] ">{Data.transactions.length}</span> 
        </div>
        <br />
        <TransactionLists handleActiveState={handleActiveState}/>

        {activeState.viewTransaction && <ViewTransaction
          handleActiveState={handleActiveState}
          active={activeState.viewTransaction}
          setActiveState={setActiveState}
          transactionId={transactionId}
        />}
      </div>
    </Layout>
  );
}

export default TransactionActivities;

function TransactionLists({ handleActiveState }: any) {
  const {Data, user, Loader, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext);

  const avatarImg = {
    background: `url("https://avatars.dicebear.com/api/avataaars/a.svg")`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  if(Loader.transactions){
    return <LoaderScreenComp full={true} />
  }

  if(Error.transactions !== null){
    return <ErrorScreen full={true} text={Error.transactions} />
  }

  function determineIdentity(receiver_id: string, sender_id: string){
    const {id} = user;
    let _result = {toMe: false, fromMe: false }
    if(receiver_id === id && sender_id !== id){
      _result.toMe = true;
      _result.fromMe = false; 
    }
    if(receiver_id !== id && sender_id === id){
      _result.toMe = false,
      _result.fromMe = true;
    }
    return _result;
  }


  return (
    <div
      id="transaction-list"
      className="w-full flex flex-col items-center justify-center gap-5"
    >
      {
        Data.transactions.length > 0 ?
          Data.transactions.map((tra: any)=>(
            <div
              id="card"
              data-id={tra.id}
              key={tra.id}
              className="w-full flex flex-row items-row justify-between bg-dark-200 p-4 rounded-[12px] cursor-pointer"
              onClick={(e) => {
                handleActiveState("viewTransaction", e)
              }}
            >
              <div
                id="left"
                className="w-auto flex flex-row items-start justify-start gap-3"
              >
                {/* <div
                  id="img"
                  className="p-6 rounded-[50%] bg-dark-200 border-[3px] border-solid border-blue-200 "
                  style={{...avatarImg, backgroundImage:`url("${tra}")`}}
                ></div> */}
                {(determineIdentity(tra.receiver_id, tra.sender_id).toMe && !determineIdentity(tra.receiver_id, tra.sender_id).fromMe) &&
                  <BiArrowFromTop className=" p-2 text-white-300 text-[45px] bg-dark-100 rounded-[50%] "  />}
                  
                {(!determineIdentity(tra.receiver_id, tra.sender_id).toMe && determineIdentity(tra.receiver_id, tra.sender_id).fromMe) &&
                  <BiArrowFromBottom className=" p-2 text-white-300 text-[45px] bg-dark-100 rounded-[50%] "  />}

                <div className="w-auto flex flex-col items-start justify-start">
                  <span className="text-white-200 text-[15px] capitalize font-extrabold ">
                    {tra.type}
                  </span>
                  <span className="text-white-300 text-[12px]">
                    {moment(tra.createdAt).format("MMM Do YY h:mm a")}
                  </span>
                </div>
              </div>
              <div
                id="right"
                className="w-auto flex flex-col items-center justify-center"
              >
                <span className={`w-[90px] ${determineIdentity(tra.receiver_id, tra.sender_id).toMe && !determineIdentity(tra.receiver_id, tra.sender_id).fromMe ? "text-green-400" : !determineIdentity(tra.receiver_id, tra.sender_id).toMe && determineIdentity(tra.receiver_id, tra.sender_id).fromMe ? "text-red-200" : "" } text-[15px] font-extrabold `}>
                  {
                    determineIdentity(tra.receiver_id, tra.sender_id).toMe && !determineIdentity(tra.receiver_id, tra.sender_id).fromMe ?
                    "+"+formatCurrency(tra.currency, tra.amount)
                    :
                    !determineIdentity(tra.receiver_id, tra.sender_id).toMe && determineIdentity(tra.receiver_id, tra.sender_id).fromMe ?
                    "-"+formatCurrency(tra.currency, tra.amount)
                    :
                    ""
                  }
                </span>
              </div>
            </div>
          ))
          :
          ""
      }
      <div className="w-full h-[100px] "></div>
    </div>
  );
}

function ViewTransaction({ active, transactionId, setActiveState, handleActiveState }: any) {
  const {Data, user, Loader, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext);
  const [selectedData, setSelectedData] = useState<any>({
    transactions: {},
    user: {}
  });

  const avatarImg = {
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  useEffect(()=>{
    fetchAllUsers()

    filterTransaction()
  },[])

  async function fetchAllUsers(){
    try{
      const url = APIROUTES.getAllUsers;
      setLoader((prev: any)=>({...prev, users: true}))
      const {res, data} = await Fetch(url, {
          method: "GET"
      });
      setLoader((prev: any)=>({...prev, users: false}))

      if(!data.success){
          return setError((prev: any)=>({...prev, users: data.error}));
      }

      const usersData = data.data;
      localStorage.setItem("payrill-users", JSON.stringify(usersData));
      setData((prev: any)=>({...prev, users: data.data}));
    }   
    catch(e: any){
      setLoader((prev: any)=>({...prev, users: false}))
      setError((prev: any)=>({...prev, users: e.message}));
    }
  }
  
  if(Loader.users){
    return <LoaderScreenComp full={true} />
  }

  if(Error.users !== null){
    return <ErrorScreen full={true} text={Error.users} />
  }

  function filterTransaction(){
    const filtered = Data.transactions.filter((data: any)=> data.id === transactionId)[0]
    setSelectedData((prev: any)=>({...prev, transactions: filtered}))
    filterUser(filtered.sender_id, filtered.receiver_id)
  }

  function filterUser(sId: string, rId: string){
    const {id} = user;
    let _result = {toMe: false, fromMe: false, sName: "", rName: "",sUname: "", rUname: "" }
    const localUsers = JSON.parse(localStorage.getItem("payrill-users") as any)
    if(rId === id && sId !== id){
      _result.toMe = true;
      _result.fromMe = false; 
      _result.sName = localUsers.filter((user:any)=> user.id === sId)[0]?.name;
      _result.rName = localUsers.filter((user:any)=> user.id === rId)[0]?.name;
      _result.sUname = localUsers.filter((user:any)=> user.id === sId)[0]?.username;
      _result.rUname = localUsers.filter((user:any)=> user.id === rId)[0]?.username;
    }

    if(rId !== id && sId === id){
      _result.toMe = false,
      _result.fromMe = true;
      _result.sName = Data.users.filter((user:any)=> user.id === sId)[0]?.name;
      _result.rName = Data.users.filter((user:any)=> user.id === rId)[0]?.name;
      _result.sUname = Data.users.filter((user:any)=> user.id === sId)[0]?.username;
      _result.rUname = Data.users.filter((user:any)=> user.id === rId)[0]?.username;
    }

    setSelectedData((prev: any)=>({...prev, user: _result}))
  }


  if(Loader.users){
    return <LoaderScreenComp full={true} />
  }

  if(Error.users !== null){
    return <ErrorScreen full={true} text={Error.users} />
  }


    return (
      <div
        className={`w-full md:w-[500px] ${
          active ? "h-full" : "h-0"
        } fixed bottom-0 bg-dark-100 z-[10] transition-all`}
      >
        <div className="w-full flex flex-row items-row justify-between mt-3 px-3">
          <button
            className="p-3 flex flex-row items-center justify-center rounded-md bg-dark-200 text-[15px] "
            onClick={()=>setActiveState((prev: any)=>({viewTransaction: false})) }
          >
            <FaLongArrowAltLeft className="text-[20px] " />
          </button>
        </div>
        <br />
        <div
          id="info"
          className="w-auto h-[180px] flex flex-col items-center justify-center "
        >
          {selectedData.user.fromMe && <div
            id="img"
            className="w-[70px] h-[70px] rounded-[50%] bg-dark-100 border-[3px] border-solid border-blue-200 "
            style={{...avatarImg, backgroundImage: `url("https://avatars.dicebear.com/api/avataaars/${selectedData.user.rUname}.svg")`,}}
          ></div>}

          {selectedData.user.toMe && <div
            id="img"
            className="w-[70px] h-[70px] rounded-[50%] bg-dark-100 border-[3px] border-solid border-blue-200 "
            style={{...avatarImg, backgroundImage: `url("https://avatars.dicebear.com/api/avataaars/${selectedData.user.sUname}.svg")`,}}
          ></div>}
          
          <br />
          <p className="text-white-300 text-[12px] pb-4 mt-2">
            {selectedData.transactions.type}
          </p>
          <p className="text-white-100 ">
            You  
            {selectedData.user.fromMe && " sent " } 
            {selectedData.user.toMe && " received "}

            <span className="font-extrabold">{formatCurrency(selectedData.transactions.currency, selectedData.transactions.amount)}</span> 
            {selectedData.user.fromMe && " to " } 
            {selectedData.user.toMe && " from "}

            <span className="font-extrabold"> 
              {selectedData.user.fromMe && selectedData.user.rUname}
              {selectedData.user.toMe && selectedData.user.sUname}
            </span>
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
  
            <p className="text-white-300 text-[12px] pb-4">
              {moment(selectedData.transactions.createdAt).format("MMM Do YY h:mm a")}
            </p>
          </div>
          <div className="w-full flex flex-row items-start justify-start gap-4 px-5 p-4">
            <button className="p-3 flex flex-row items-center justify-center rounded-md bg-dark-100 text-white-200 text-[15px] ">
              <GiWallet className="text-[20px] " />
            </button>
            <div className="w-auto flex flex-col items-start justify-start">
              <p className="text-white-100 text-[15px] font-extrabold">Amount</p>
              <p className="text-white-200 text-[15px]">
                {formatCurrency(selectedData.transactions.currency, selectedData.transactions.amount)}
              </p>
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
              {formatCurrency(selectedData.transactions.currency, selectedData.transactions.amount)}
            </p>
          </div>
          <br />
  
          <span className="absolute top-2 w-[100px] p-1 rounded-[30px] bg-dark-100 "></span>
        </div>
      </div>
    );
  }