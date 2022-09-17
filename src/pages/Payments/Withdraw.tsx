import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import APIROUTES from '../../apiRoutes'
import { Layout } from '../../components'
import Dialog from '../../components/Dialog/Dialog'
import Keyboard from '../../components/UI-COMP/keyboard'
import { LoaderScreen } from '../../components/UI-COMP/loader'
import Modal from '../../components/UI-COMP/modal'
import DataContext from '../../context/DataContext'
import Fetch from '../../utils/fetch'
import Notification from '../../utils/toast'

const notif = new Notification(10000)

function Withdraw() {

  const {steps, setSteps, clearStep, pin, clearPin, setLoader, Loader, Error, walletInfo} = useContext<any>(DataContext)
  const [active, setActive] = useState(true)
  const [kbactive, setKbActive] = useState(true)
  const [details, setDetails] = useState<any>({
    amount: 0,
    currency: ""
  })

  const toggleStep = (step: number) => setSteps((prev: any)=>({...prev, dialog:step}))

  const closeKeyboard = ()=>{
    setKbActive(false)
    clearStep("dialog", 1)
  }

  async function handleWithdraw(){
    details["pin"] = pin.originalPin;

    try {
            
      setLoader((prev: any)=>({...prev, withdraw: true}))
      const url = APIROUTES.withdraw;
      const {res, data} = await Fetch(url, {
          method: "POST",
          body: JSON.stringify(details)
      });
      setLoader((prev: any)=>({...prev, withdraw: false}))

      if(!data.success){
          notif.error(data.message)
          return
      }

      notif.success(data.message);
      closeKeyboard()
      clearPin()
      window.location.href = "/dashboard"

  } catch (e: any) {
      setLoader((prev: any)=>({...prev, withdraw: false}))
      notif.error(`Something went wrong. ${e.message} `)
      return
  }
  }
  

  return (
    <Layout>
        <Modal isActive={active} back={true}>
          <Dialog height={320}>
              {
                steps.dialog === 1 ?
                  <div className="w-full mt-5 h-auto flex flex-col items-start justify-start px-6">
                    <input type="text" placeholder='300' className="w-full px-4 py-3 text-white-200 rounded-[30px] bg-dark-100 " onChange={(e)=> setDetails((prev: any)=>({...prev, amount: e.target.value}))} />
                    <br />
                    <select name="" id="" className="w-full px-4 py-3 bg-dark-100 text-white-100 rounded-[30px]" onChange={(e)=> setDetails((prev: any)=>({...prev, currency: e.target.value}))}>
                      <option value="">Select Account</option>
                      {
                        walletInfo?.accounts.map((wall: any)=>(
                          <option key={wall.currency} value={wall.currency}>{wall.currency}</option>
                        ))
                      }
                    </select>
                    <br />
                    <button className="w-full px-4 py-3 flex flex-col items-center justify-center font-extrabold text-white-100 bg-blue-300 rounded-[30px] " onClick={()=>toggleStep(2)}>
                      Proceed
                    </button>
                  </div>
                  :
                steps.dialog === 2 ?
                  <Keyboard active={true} title="Withdraw" subTitle='Account Withdraw' toggleKeyboard={closeKeyboard} handler={handleWithdraw} />
                  :
                  ""
              }
          </Dialog>
        </Modal>
        { Loader.withdraw && <LoaderScreen full={true} /> }
    </Layout>
  )
}

export default Withdraw