import React, { useState } from 'react'
import { formatCurrency } from '../../utils/creditCard'
import Modal from '../UI-COMP/modal'

function WalletCard() {

  const [active, setActive] = useState(false);

  const toggleActive = ()=> setActive(!active)

  return (
    <div className="w-full h-[180px] py-9">
        <div className="w-full flex flex-col items-center justify-center">
            <p className="text-white-300 text-[20px] ">Total Balance</p>
            <p className="text-white-100 text-[35px] font-extrabold font-sans  ">
                {formatCurrency("USD", 40000)} <span className="text-white-300 font-mono ">USD</span>
            </p>
        </div>
        <br />
        <div className="w-full flex flex-col items-center justify-center">
          <button className="px-3 py-2 rounded-[30px] bg-dark-300 scale-[.85] " onClick={toggleActive}>
            Other Balance
          </button>
        </div>
        <br />
        <br />
        <OpenOtherBalance active={active} toggleActive={toggleActive} />
    </div>
  )
}

export default WalletCard

function OpenOtherBalance({active, toggleActive}: any){



  return (
    <Modal isActive={active} clickHandler={toggleActive}>
      <div className="w-[300px] p-5 rounded-md flex flex-wrap items-center justify-start bg-dark-300 gap-3 ">
        <div className="w-full flex flex-start items-start justify-start ">
          <p className="text-white-200 text-[20px] ">View Balance</p>
          <br />
        </div>
        <button className="p-5 rounded-md bg-dark-200 font-extrabold text-white-200 text-[20px] ">USD</button>
        <button className="p-5 rounded-md bg-dark-200 font-extrabold text-white-200 text-[20px] ">GDP</button>
      </div>
    </Modal>
  )
}