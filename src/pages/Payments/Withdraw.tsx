import React, { useContext, useState } from 'react'
import { Layout } from '../../components'
import Dialog from '../../components/Dialog/Dialog'
import Keyboard from '../../components/UI-COMP/keyboard'
import Modal from '../../components/UI-COMP/modal'
import DataContext from '../../context/DataContext'

function Withdraw() {

  const {steps, setSteps, clearStep} = useContext<any>(DataContext)
  const [active, setActive] = useState(true)
  const [kbactive, setKbActive] = useState(true)

  const toggleStep = (step: number) => setSteps((prev: any)=>({...prev, dialog:step}))

  const closeKeyboard = ()=>{
    setKbActive(false)
    clearStep("dialog", 1)
  }

  async function handleWithdraw(){

  }
  

  return (
    <Layout>
        <Modal isActive={active} back={true}>
          <Dialog height={320}>
              {
                steps.dialog === 1 ?
                  <div className="w-full mt-5 h-auto flex flex-col items-start justify-start px-6">
                    <input type="text" placeholder='300' className="w-full px-4 py-3 text-white-200 rounded-[30px] bg-dark-100 " />
                    <br />
                    <p className="text-white-200">Balance: <span className="font-extrabold text-blue-300">$300</span> </p>
                    <br />
                    <select name="" id="" className="w-full px-4 py-3 bg-dark-100 text-white-100 rounded-[30px]">
                      <option value="">Select Account</option>
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
    </Layout>
  )
}

export default Withdraw