import React from 'react'
import Modal from './modal';


interface LoaderProps{
    size?: number | string;
    color?: string;
    full?: boolean;
    text?: string;
}

export function LoaderScreen({size, color, text}: LoaderProps){

    const Size = typeof size === "undefined" ? " w-[30px] h-[30px] " : ` w[${size}px] h-[${size}px] `

    const Color = typeof color === "undefined" ? "border-t-blue-200 border-r-transparent border-l-blue-200 border-b-transparent" : `border-[${color}] border-r-transparent border-b-transparent`

    return (
        <Modal isActive={true}>
            <div id="payrill-spinner" className={`w-auto rounded-[50%] ${Size} border-[3px] ${Color}  `}></div>
            <span className="text-white-100 text-[13px] py-5 ">{text}</span>
        </Modal>
    )
}

export function LoaderScreenComp({color, size, full, text}: LoaderProps){
    
    return (
        <div className={`w-full ${full ? "h-screen": "h-auto"} flex flex-col items-center justify-center `}>
            <span className="text-white-100 text-[13px] pb-5 ">{text}</span>
            <Spinner color={color} size={size} />
        </div>
    )
}

export function Spinner({size, color}: LoaderProps){

    const Size = typeof size === "undefined" ? " w-[30px] h-[30px] " : ` w[${size}px] h-[${size}px] `

    const Color = typeof color === "undefined" ? "border-t-blue-200 border-r-transparent border-l-blue-200 border-b-transparent" : `border-[${color}] border-r-transparent border-b-transparent`

    return (
        <div id="payrill-spinner" className={`rounded-[50%] ${Size} border-[3px] ${Color}  `}></div>
    )
}

