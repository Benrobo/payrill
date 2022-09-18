import React, { useContext, useEffect, useState } from 'react'
import Modal from './modal'
import {IoIosBackspace} from "react-icons/io"
import {MdOutlineClear} from "react-icons/md"
import { AiTwotoneEye, AiTwotoneEyeInvisible } from 'react-icons/ai'
import DataContext from '../../context/DataContext'



interface KeyboardProps {
  active: boolean;
  toggleKeyboard?: any;
  handler: ()=> void;
  title?: string;
  subTitle?: string;
}

function Keyboard({title, subTitle, active, toggleKeyboard, handler}: KeyboardProps) {
  
  const {pin, setPin, clearPin} = useContext<any>(DataContext)

  const PIN_LENGTH = 4;

  const keyPad = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "backspace", "0", "done"
  ];

  // const [revealState, setRevealState] = useState<boolean>(true)


  useEffect(()=>{
    
  }, [])

  const handlePin = (e: any)=>{
    const dataset = e.target.dataset;
    if(Object.entries(dataset).length > 0){
      const {key, value} = dataset;
      let {originalPin, labelPin } = pin;
      if(originalPin.split("").length >= PIN_LENGTH) return
      originalPin += +value
      const newLabel = labelPin.replace(/\-/, value)
      setPin((prev: any)=> ({...prev, ["originalPin"]: originalPin, ["copyPin"]: originalPin, ["labelPin"]: newLabel}))
    }
  }

  // function handleRevealPin(){
  //   const {labelPin, originalPin} = pin;
  //   let lb : any;
  //   if(labelPin === "" || originalPin === "") return
  //   if(!revealState) {
  //     setRevealState(true)
  //     lb = labelPin.replace("-", originalPin)
  //     setPin((prev)=> ({...prev, ["labelPin"]: lb}))
  //     console.log(lb);
  //     return 
  //   }
  //   setRevealState(false)
  //   lb = labelPin.replace(/\d/g, "-")
  //   console.log(lb);
  //   setPin((prev)=> ({...prev, ["labelPin"]: lb}))
  // }

  function handleKeyboardData(e: any){
    handler()
  }



  return (
    <Modal isActive={active} clickHandler={toggleKeyboard} >
      <div id="dailog-box" className={`w-full ${active ? "h-auto" : "h-0"} overflow-y-scroll noScrollBar transition-all bg-dark-200 rounded-t-[30px] absolute bottom-0 left-0 px-2 md:px-5 py-3 flex flex-col items-center justify-start `} data-name="keyboard">
        <div id="knob" className="w-[50px] h-[5px] rounded-[50px] absolute top-3 bg-white-400 "></div>
        <br />
        <div id="head" className="w-full flex flex-col items-center justify-center">
          <p className="text-white-100 font-extrabold">
            { title || "Keyboard Title" }
          </p>
          <p className="text-white-300 pb-5">
            { subTitle || ""}
          </p>
          <br />
          <div id="pinScreen" className="w-full flex flex-row items-center justify-between px-3 md:px-5">
            {
              pin.labelPin.split("").map((pins: any, i: any)=>(
                <div key={i} className="h-[50px] w-[70px] rounded-md bg-dark-100 flex flex-col items-center justify-center font-extrabold text-[20px] ">
                  {pins}
                </div>
              ))
            }
            {/* <div className="h-[50px] w-[70px] rounded-md flex flex-col items-center justify-center font-extrabold text-[20px] cursor-pointer" onClick={handleRevealPin}>
              {
                revealState ?
                <AiTwotoneEye className="text-white-100 text-[20px] " />
                :
                <AiTwotoneEyeInvisible className="text-white-100 text-[20px] " />
              }
            </div> */}
          </div>
          <br />
          <div className="w-full flex flex-row flex-wrap items-center justify-center">
            {
              keyPad.map((key, i)=> (
                <button key={i} id="pad" data-key={i} data-value={key} className="w-[60px] h-[60px] rounded-[50%] scale-[.90] md:scale-[1]  hover:bg-dark-100 cursor-pointer flex flex-col items-center justify-center m-4 font-extrabold" onClick={(e)=>{
                  if(key !== "done") handlePin(e)
                  if(key === "backspace") clearPin(e)
                  if(key === "done") handleKeyboardData(e)
                }}>
                  {
                    key === "backspace" ? 
                      <MdOutlineClear className='text-white-100 text-[20px]' />
                      : 
                    key
                  }
                </button>
              ))
            }
          </div>
        </div>
        <div className="w-full h-[20px] "></div>
      </div>
  </Modal>
  )
}

export default Keyboard

