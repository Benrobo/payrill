import React from 'react'
import {GetCardType, formatCardNUm, formatCurrency} from '../../utils/creditCard'

interface VirtualCardProp {
    type: string;
    number: string;
    exp: string;
    name: string;
    balance?: string;
}

function VirtualCard({type, number, exp, name, balance} : VirtualCardProp) {

  return (
    <div className="w-full p-3 flex flex-col items-center justify-center">
        
        <div id="card" className="relative w-full rounded-md bg-dark-200 p-3 h-[200px] overflow-hidden">

            {/* circle one */}
            
            <div id="circle" className="p-20 w-[100px] h-[100px] bg-blue-200 opacity-[.5] rounded-[50%] absolute left-[-100px] bottom-[-50px]"></div>

            <div id="circle" className="p-20 w-[100px] h-[100px] bg-blue-200 opacity-[.5] rounded-[50%] absolute right-[-80px] top-[-80px]"></div>

            <div id="box" className="w-full absolute top-3">
                <div id="top" className="w-full flex flex-row items-center justify-between gap-3 ">
                    <div className="w-auto flex flex-col items-start justify-start">
                        <span className="text-white-100 text-[12px] ">Card Name</span>
                        <span className="text-white-100 font-extrabold">{name}</span>
                    </div>
                </div>
                <br />
                <span className="absolute text-[25px] top-0 font-sans right-5 text-white-100 font-extrabold capitalize ">
                    {name}
                </span>
                <br />
                <p className="text-white-100 font-extrabold font-mono space-x-2 text-[25px] ">{formatCardNUm(number)}</p>
                <br />
              { 
                    (typeof balance !== "undefined" && balance !== "" ) && <p className="text-white-100 font-extrabold space-x-2 text-[30px] ">{formatCurrency("USD", +balance)}</p>  
                }
                <span className="absolute bottom-2 right-6 text-white-100 font-extrabold">{exp}</span>
            </div>
        </div>
    </div>
  )
}

export default VirtualCard