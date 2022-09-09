import React from 'react'
import { AiFillHome } from 'react-icons/ai'
import { BsHandbagFill } from 'react-icons/bs'
import { FaCog } from 'react-icons/fa'
import { MdQrCodeScanner } from 'react-icons/md'
import { RiHome5Fill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { isEqual } from '../../utils'
import { Button } from '../UI-COMP'


function returnStoreName(){
  return window.location.pathname.replace(/\D/, "").split("/")[1]
}

function Sidebar({activeName}: any) {


  const storeName = returnStoreName()

  return (
    <div className="w-[250px] h-screen bg-dark-200 flex flex-col items-center justify-start ">
      <div className="w-full flex items-center justify-start p-4 mt-5">
        <h1 className="text-blue-200 font-extrabold ">Organization Name</h1>
      </div>
      <br />
      <div className="w-full flex flex-col items-start justify-start">
        <Link to={`/store/${storeName}`} className={`w-full`}>
          <li className={`w-full flex items-center justify-start gap-4 px-3 py-4 ${isEqual(activeName, "home") ? "bg-blue-300" : "bg-dark-200"} hover:bg-blue-300 list-none text-white-100 font-extrabold`}>
            <RiHome5Fill className='text-[20px] ' />  Home
          </li>
        </Link>
        <Link to={`/store/${storeName}/verify`} className={`w-full`}>
          <li className={`w-full flex items-center justify-start gap-4 px-3 py-4 ${isEqual(activeName, "verify") ? "bg-blue-300" : "bg-dark-200"} hover:bg-blue-300 list-none text-white-100 font-extrabold`}>
            <MdQrCodeScanner className='text-[20px] ' /> Verify
          </li>
        </Link>
        <Link to={`/store/${storeName}/products`} className={`w-full`}>
          <li className={`w-full flex items-center justify-start gap-4 px-3 py-4 ${isEqual(activeName, "products") ? "bg-blue-300" : "bg-dark-200"} hover:bg-blue-300 list-none text-white-100 font-extrabold`}>
            <BsHandbagFill className='text-[20px] ' /> Products
          </li>
        </Link>
        <Link to={`/store/${storeName}/settings`} className={`w-full`}>
          <li className={`w-full flex items-center justify-start gap-4 px-3 py-4 ${isEqual(activeName, "settings") ? "bg-blue-300" : "bg-dark-200"} hover:bg-blue-300 list-none text-white-100 font-extrabold`}>
            <FaCog className='text-[20px] ' /> Settings
          </li>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar