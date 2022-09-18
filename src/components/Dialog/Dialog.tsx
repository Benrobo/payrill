import React, { useEffect, useRef, useState } from 'react'


interface DialogProp{
    height?: string | number;
    color?: string;
    children?: React.ReactNode
}

function Dialog({height, children}: DialogProp ) {

    const dialogRef = useRef<any>("")

    useEffect(()=>{
        if(dialogRef !== null) dialogRef.current.style.height = height+"px"
    },[height])
  return (
    <div id="dailog-box" className={`w-full h-[${height || 380}px] bg-dark-200 rounded-t-[30px] absolute bottom-0 left-0 py-3 flex flex-col items-center justify-start `} ref={dialogRef}>
        <div id="knob" className="w-[50px] h-[5px] rounded-[50px] absolute top-3 bg-white-400 "></div>
        <div className="w-full mt-5">
            {children}
            <div className="w-full h-[50px] "></div>
        </div>
    </div>
  )
}

export default Dialog