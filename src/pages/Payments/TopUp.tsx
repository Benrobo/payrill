import React, { useContext, useEffect, useState, useId } from 'react'
import APIROUTES from '../../apiRoutes'
import { Layout } from '../../components'
import Dialog from '../../components/Dialog/Dialog'
import { Input } from '../../components/UI-COMP'
import Keyboard from '../../components/UI-COMP/keyboard'
import { LoaderScreen, Spinner } from '../../components/UI-COMP/loader'
import Modal from '../../components/UI-COMP/modal'
import DataContext from '../../context/DataContext'
import { genUnique, sleep } from '../../utils'
import { formatCurrency } from '../../utils/creditCard'
import Fetch from '../../utils/fetch'
import Notification from '../../utils/toast'

const notif = new Notification(10000)

function TopUp() {

  const uuid = useId();
  const {steps, setSteps, clearStep, clearPin, walletInfo, Loader, setLoader} = useContext<any>(DataContext)
  const [kbactive, setKbActive] = useState(true)
  const [inputData, setInputData] = useState({
    amount: "",
    currency: "",
  })
  const [balance, setBalance] = useState(0)

  const toggleStep = (step: number) => {
    if(step === 2){
      if(inputData.amount === "") return notif.error("amount cant be empty.")
      setSteps((prev: any)=>({...prev, dialog:step}))
    }
    if(step === 3){
      if(inputData.currency === "") return notif.error("currency cant be empty...")
      setSteps((prev: any)=>({...prev, dialog:step}))
    }
  }


  const closeKeyboard = ()=>{
    setKbActive(false)
    clearStep("dialog", 1)
    clearPin()
    history.back()
  }
  

  const handleInput = (e: any, action?: string)=>{
    const value = e.target.value;
    const name = e.target.name;
    if(action === "currency") setInputData((prev: any)=>({...prev, currency: value}))
    setInputData((prev: any)=>({...prev, [name]: value}))
  }

  useEffect(()=>{
    if(inputData.currency === "") return;
    if(Object.entries(walletInfo).length === 0) return
    
    const filterBalance = walletInfo?.accounts.length > 0 ? walletInfo.accounts.filter((data: any) => data.currency === inputData.currency)[0].amount : 0;
    setBalance(+filterBalance)
    
  }, [inputData.currency])

  useEffect(()=>{
    // update inputData currency on render
    setInputData((prev: any)=>({...prev, currency: walletInfo.currency}))
  },[])

  async function handleTopup(){
    // const wallet = walletInfo;
    const {amount, currency} = inputData;
    try{
      setLoader((prev: any) => ({ ...prev, topUp: true }));
      const url = APIROUTES.addFund;
      const payload = {
        amount,
        currency,
        issued_bank_account: walletInfo.issuing_id // test
      }
      const { res, data } = await Fetch(url, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      setLoader((prev: any) => ({ ...prev, topUp: false }));

      if (!data.success) {
        return notif.error(data.error);
      }

      notif.success(data.message)
      await sleep(1.2)
      window.location.reload()
    }
    catch(e: any){
      notif.error(e.message)
      setLoader((prev: any) => ({ ...prev, topUp: false }));
    }
  }

  

  return (
    <Layout>
      <Modal isActive={true} back={true} backHandler={()=> clearStep("dialog", 1)}>
        <Dialog height={300}>
            <div className="w-full flex flex-col items-center justify-center">
              <p className="text-white-200">Account Top Up</p>
            </div>
            <br />
            <br />
            {
              steps.dialog === 1 ?
                <div className="w-full h-auto flex flex-col items-center justify-center px-6">
                  <input type="number" name="amount" onChange={handleInput} placeholder='300' className="w-full px-4 py-3 text-white-200 rounded-[30px] bg-dark-100 " />
                  <br />
                  <br />
                  <button className="w-full px-4 py-3 flex flex-col items-center justify-center font-extrabold text-white-100 bg-blue-300 rounded-[30px] " onClick={()=>toggleStep(2)}>
                    Proceed
                  </button>
                </div>
                :
              steps.dialog === 2 ?
                <div className="w-full h-auto flex flex-col items-start justify-start px-6">
                  <p className="text-white-200">Balance: <span className="font-extrabold text-blue-300">{formatCurrency(inputData.currency, balance)}</span> </p>
                  <br />
                  {
                    walletInfo.accounts.length > 0 ?
                      <select name="" id="" onChange={(e)=>handleInput(e, "currency")} className="w-full px-4 py-3 bg-dark-100 text-white-100 rounded-[30px]">
                        <option value="">Select Account</option>
                        {
                          walletInfo.accounts.map((data: any)=>{
                            return (
                              <option key={data.currency} value={data.currency}>{data.currency}</option>
                            )
                          })
                        }
                      </select>
                      :
                      <select name="" id="" onChange={(e)=>handleInput(e, "currency")} className="w-full px-4 py-3 bg-dark-100 text-white-100 rounded-[30px]">
                        <option value="">Select Account</option>
                        <option value={walletInfo.currency}>{walletInfo.currency}</option>
                      </select>
                  } 
                  <br />
                  <button className="w-full px-4 py-3 flex flex-col items-center justify-center font-extrabold text-white-100 bg-blue-300 rounded-[30px] " onClick={()=>toggleStep(3)}>
                    Continue
                  </button>
                </div>
                :
              steps.dialog === 3 ?
                <Keyboard active={kbactive} toggleKeyboard={closeKeyboard} handler={handleTopup} title="Account Topup"  subTitle={`${inputData.currency} += ${inputData.amount} `} />
                :
                ""
            }
        </Dialog>
        {Loader.topUp &&<LoaderScreen full={true} text="Toping Up..." />}
      </Modal>
    </Layout>
  )
}

export default TopUp

