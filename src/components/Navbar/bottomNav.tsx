import React from "react";
import {
  AiOutlineVideoCamera,
  AiFillVideoCamera,
  AiFillCalendar,
  AiFillDashboard,
  AiTwotoneShopping,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { GoBrowser } from "react-icons/go";
import { Link } from "react-router-dom";
import { DEVICE_WIDTH } from "../../config";
import { BiHomeAlt } from "react-icons/bi";
import { FiActivity } from "react-icons/fi"
import { BsFillWalletFill } from "react-icons/bs"
import { BiTransfer } from "react-icons/bi"
import { TbScan } from "react-icons/tb"
import { isEqual } from "../../utils";
import { HiShoppingBag } from "react-icons/hi";


interface BottomNavBarProps{
  activeName?: string;
}

function BottomNavbar({ activeName }: BottomNavBarProps) {


  return (
    <div
      className={`w-full md:w-[500px] md:w-[${DEVICE_WIDTH}] bg-dark-200 px-4 py-3 h-[70px] fixed bottom-0 text-white-100 flex flex-row items-center justify-between `}
    >   
      <Link to="/dashboard">
        <button className={`text-[20px] scale-[.90] hover:scale-[1] hover:text-blue-200 hover:opacity-[1] transition-all rounded-[10px] p-1 ${isEqual(activeName, "dashboard") ? "text-blue-200 scale-[1] font-extrabold" : "text-white-100 opacity-[.5] font-semibold scale-[.90] "} flex flex-col items-center justify-center`}>
          <BiHomeAlt className="" />
          <span className="text-[14px] pt-2 capitalize ">Home</span>
        </button>
      </Link>

      <Link to="/transactions/activities">
        <button className={`text-[20px] scale-[.90] hover:scale-[1] hover:text-blue-200 hover:opacity-[1] transition-all rounded-[10px] p-1 ${isEqual(activeName, "activities") ? "text-blue-200 scale-[1] font-extrabold" : "text-white-100 opacity-[.5] font-semibold scale-[.90] "} flex flex-col items-center justify-center`}>
          <FiActivity className="" />
          <span className="text-[14px] pt-2 capitalize ">activities</span>
        </button>
      </Link>

      {/* <div className="w-full absolute left-0 bottom-12 flex flex-col items-center justify-center">
      </div> */}
        <Link to="/scanner">
          <button className="mb-[50px] text-[29px] scale-[.90] hover:scale-[1] hover:text-blue-200 hover:opacity-[1] transition-all rounded-[50%] p-4 text-blue-200 bg-dark-300 flex flex-col items-center justify-center">
            <TbScan className="" />
          </button>
        </Link>

      <Link to="/store">
        <button className={`text-[20px] scale-[.90] hover:scale-[1] hover:text-blue-200 hover:opacity-[1] transition-all rounded-[10px] p-1 ${isEqual(activeName, "store") ? "text-blue-200 scale-[1] font-extrabold" : "text-white-100 opacity-[.5] font-semibold scale-[.90] "} flex flex-col items-center justify-center`}>
          <HiShoppingBag className="" />
          <span className="text-[14px] pt-2 capitalize ">stores</span>
        </button>
      </Link>

      <Link to="/profile">
        <button className={`text-[20px] scale-[.90] hover:scale-[1] hover:text-blue-200 hover:opacity-[1] transition-all rounded-[10px] p-1 ${isEqual(activeName, "profile") ? "text-blue-200 scale-[1] font-extrabold" : "text-white-100 opacity-[.5] font-semibold scale-[.90] "} flex flex-col items-center justify-center`}>
          <AiOutlineUserSwitch className="" />
          <span className="text-[14px] pt-2 capitalize ">profile</span>
        </button>
      </Link>

    </div>
  );
}

export default BottomNavbar;

