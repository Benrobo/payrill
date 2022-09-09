import React, { useContext, useEffect, useState } from 'react'
import DataContext from '../../context/DataContext';
import { formatCurrency } from '../../utils/creditCard'
import { LoaderScreenComp } from '../UI-COMP/loader';
import Modal from '../UI-COMP/modal'

function WalletCard() {

  const {Data, Loader, walletInfo, Error, setData, setLoader, setError} = useContext<any>(DataContext)
  const [currency, setCurrency] = useState("")
  const [balance, setBalance] = useState<number>(0)
  const [active, setActive] = useState(false);

  const toggleActive = ()=> setActive(!active)

  useEffect(()=>{
    getWalletBalance(currency)
  },[currency, balance])

  useEffect(()=>{
    getWalletBalance(currency)
  },[])

  function selectCurrency(e: any){
    const dataset = e.target.dataset;
    if(Object.entries(dataset).length === 0) return;
    const {id} = dataset;
    const filterCurr = walletInfo.accounts.filter((curr: any)=> curr.id === id)[0]
    setCurrency(filterCurr.currency)
    setBalance(filterCurr.balance)
    toggleActive()
  }

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

  return (
    <div className="w-full h-[180px] py-9">
        <div className="w-full flex flex-col items-center justify-center">
            <p className="text-white-300 text-[20px] ">Total Balance</p>
            {(currency !== "") && <p className="text-white-100 text-[35px] font-extrabold font-sans  ">
                {formatCurrency(currency, balance)} <span className="text-white-300 font-mono ">{currency}</span>
            </p>}
        </div>
        <br />
        <div className="w-full flex flex-col items-center justify-center">
          <button className="px-3 py-2 rounded-[30px] bg-dark-300 scale-[.85] " onClick={toggleActive}>
            Other Balance
          </button>
        </div>
        <br />
        <br />
        

        {
          active &&
          <Modal isActive={active} clickHandler={toggleActive}>
            <div className="w-[300px] p-5 rounded-md flex flex-wrap items-center justify-start bg-dark-300 gap-3 ">
              <div className="w-full flex flex-start items-start justify-start ">
                <p className="text-white-200 text-[20px] ">View Balance</p>
                <br />
              </div>
              <div className="w-full flex flex-wrap items-start justify-start gap-8">
                {
                  walletInfo.accounts.map((data: any)=>(
                    <button data-curr={data.currency} key={data.id} data-id={data.id} className={`p-5 rounded-md bg-dark-200 font-extrabold text-white-200 text-[20px] border-[3px] hover:bg-dark-100 hover:border-solid ${currency == data.currency ? "border-blue-300" : "border-transparent"} hover:border-blue-300 scale-[.80] `} onClick={selectCurrency}>{data.currency}</button>
                  ))
                }
              </div>
            </div>
          </Modal>
        }

    </div>
  )
}

export default WalletCard
