import React, { useContext, useEffect, useState } from "react";
import { FaArrowDown } from "react-icons/fa";
import { GiWallet } from "react-icons/gi";
import { MdProductionQuantityLimits } from "react-icons/md";
import OrgLayout from "../../components/Layout/OrgLayout";
import { ErrorScreen } from "../../components/UI-COMP/error";
import { LoaderScreen, LoaderScreenComp } from "../../components/UI-COMP/loader";
import DataContext from "../../context/DataContext";
import { getLastPathName } from "../../utils";
import { formatCurrency } from "../../utils/creditCard";

function OrgDashboard() {
    const {Data, Loader, walletInfo, getOrgStoreInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
    const [currency, setCurrency] = useState("")
    const [balance, setBalance] = useState<number>(0)

  const cardStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const userCurrency = localStorage.getItem("payrill_user_currency") === null ? "" : JSON.parse(localStorage.getItem("payrill_user_currency") as any)

  useEffect(()=>{
    const storeName = getLastPathName();
    getOrgStoreInfo(storeName)

    // set default currency
    // setCurrency(userCurrency)
  },[])



  useEffect(()=>{
    // console.log({currency})
    // if(currency === "") return;
    console.log("Currency ", currency)
    getWalletBalance(currency || userCurrency)
  },[currency])


  function getWalletBalance(currency: string){
    if(Object.entries(walletInfo).length === 0) return
    let filterCurr;
    if(typeof currency === "undefined" || currency === ""){
      filterCurr = walletInfo.accounts[0];
      setCurrency(filterCurr.currency)
      setBalance(filterCurr.balance)
      return;
    }
    filterCurr = walletInfo.accounts.filter((curr: any)=> curr.currency === currency)[0]
    setCurrency(filterCurr.currency)
    setBalance(filterCurr.balance)
  }

  if(Loader.getOrgStoreInfo){
    return <LoaderScreenComp text="Loading Store..." full={true} />
  }

  // if(Loader.wallet){
  //   return <LoaderScreenComp text="Loading Store..." full={true} />
  // }
  
  if(Error.getOrgStoreInfo !== null){
    return <ErrorScreen text={Error.getOrgStoreInfo} size={"lg"} full={true} />
  }

  if(!Loader.getOrgStoreInfo && Object.entries(Data.orgStoreInfo).length === 0){
    return <ErrorScreen text={Error.getOrgStoreInfo} full={true} />
  }

  const storeData = Data.orgStoreInfo;

  return (
    <OrgLayout sideBarActiveName="home">
      <div className="w-full flex flex-col items-between justify-between px-5 mt-5">
        <div className="w-auto flex items-start justify-start gap-5 border-b-[1px] border-solid border-dark-500 pb-2 ">
            <div className="w-[70px] h-[70px] bg-dark-200 rounded-md p-2 cursor-pointer  " style={{...cardStyle, backgroundImage: `url("${storeData.logo}")`,}}></div>
            <div className="w-auto flex flex-col items-start justify-start">
                <p className="text-white-100 text-[20px] font-extrabold "> <span className="text-white-300 font-extralight text-[14px] ">Welcome Back </span> {storeData.name}</p>
                <p className="text-white-200 font-extrabold text-[15px] ">{storeData.subdomain}</p>
            </div>
        </div>
        <br />
        <br />
        <div className="w-full flex items-center justify-start gap-5">
            <div className="w-[300px] h-[150px] p-5 rounded-md bg-dark-200 flex items-start flex-col justify-between relative ">
                <div className="w-auto flex items-start justify-start gap-3">
                    {
                        Loader.wallet ?
                            <LoaderScreenComp full={false} />
                            :
                        !Loader.wallet && Error.wallet !== null ?
                            <ErrorScreen text={Error.wallet} />
                            :
                            <>
                                <GiWallet className=" p-1 rounded-md bg-green-700 text-green-400 text-[50px] " />
                                <div className="w-auto">
                                    <p className="text-white-200 font-extrabold text-[20px] ">Balance</p>
                                </div>
                                <select className="w-auto p-2 absolute top-2 right-3 rounded-md bg-dark-100 text-white-100" onChange={(e: any)=> {
                                    if(e.target.value === "") return;
                                    setCurrency(e.target.value)
                                }}>
                                    <option value="">Acct</option>
                                    {
                                        walletInfo.accounts.map((data: any)=>(
                                            <option value={data.currency}>{data.currency}</option>
                                        ))
                                    }
                                </select>
                            </>
                    }
                </div>
                <br />
                <div className="w-auto flex flex-col items-start justify-start">
                {(currency !== "") ? <p className="text-white-100 text-[25px] font-extrabold font-sans  ">
                    {formatCurrency(currency, balance)}
                </p> : <p className="text-white-100 text-[25px] font-extrabold font-sans  ">
                    0.000
                </p>}
                </div>
            </div>

            <div className="w-[300px] h-[150px] p-5 rounded-md bg-dark-200 flex items-start flex-col justify-between ">
                <div className="w-auto flex items-start justify-start gap-3">
                    <MdProductionQuantityLimits className=" p-1 rounded-md bg-blue-900 text-blue-200 text-[50px] " />
                    <div className="w-auto">
                        <p className="text-white-200 font-extrabold text-[20px] ">Products</p>
                    </div>
                </div>
                <br />
                <div className="w-auto flex flex-col items-start justify-start">
                    <p className="text-white-100 font-extrabold text-[30px] ">800</p>
                </div>
            </div>

            <div className="w-[300px] h-[150px] p-5 rounded-md bg-dark-200 flex items-start flex-col justify-between ">
                <div className="w-auto flex items-start justify-start gap-3">
                    <MdProductionQuantityLimits className=" p-1 rounded-md bg-blue-900 text-blue-200 text-[50px] " />
                    <div className="w-auto">
                        <p className="text-white-200 font-extrabold text-[20px] ">Total Transactions</p>
                    </div>
                </div>
                <br />
                <div className="w-auto flex flex-col items-start justify-start">
                    <p className="text-white-100 font-extrabold text-[30px] ">800</p>
                </div>
            </div>
        </div>
      </div>
    </OrgLayout>
  );
}

export default OrgDashboard;
